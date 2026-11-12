import { createHmac } from "node:crypto";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "@/http/app.js";

const mocks = vi.hoisted(() => ({
  createSale: vi.fn(),
  createCheckoutPreference: vi.fn(),
  getPayment: vi.fn(),
}));

vi.mock("@/services/erp-sale.service.js", () => ({
  createSale: mocks.createSale,
}));

vi.mock("@/services/mercado-pago.service.js", () => ({
  createCheckoutPreference: mocks.createCheckoutPreference,
  mercadoPagoClient: {},
}));

vi.mock("mercadopago", async (importOriginal) => {
  const actual = await importOriginal<typeof import("mercadopago")>();

  return {
    ...actual,
    Payment: class {
      get = mocks.getPayment;
    },
  };
});

const app = createApp();
const idempotencyKey = "077bb654-4edf-4ac4-9cfc-a0f6c18f4432";
const webhookSecret = "test-webhook-secret";
const sale = {
  payment: "PIX",
  products: [{ productId: 10, quantity: 2 }],
};

function createWebhookSignature(paymentId: string, requestId: string) {
  const timestamp = "1700000000";
  const manifest = `id:${paymentId};request_id:${requestId};ts:${timestamp};`;
  const signature = createHmac("sha256", webhookSecret)
    .update(manifest)
    .digest("hex");

  return `ts=${timestamp},v1=${signature}`;
}

//Testes de integração para as rotas de venda do delivery
describe("delivery sale routes", () => {
  beforeEach(() => {
    process.env.MERCADO_PAGO_WEBHOOK_SECRET = webhookSecret;
    vi.clearAllMocks();
  });

  // Testes de documentação da API
  it("serves the generated OpenAPI document with all REST sale routes", async () => {
    const response = await request(app).get("/api-docs.json");

    expect(response.status).toBe(200);
    expect(response.body.paths).toHaveProperty("/delivery/sales");
    expect(response.body.paths).toHaveProperty("/delivery/sales/checkout");
    expect(response.body.paths).toHaveProperty(
      "/delivery/sales/payments/webhooks/mercado-pago",
    );
    expect(response.body.components.schemas).toHaveProperty(
      "DeliverySaleRequest",
    );
    expect(response.body.components.schemas).toHaveProperty(
      "DeliveryCheckoutRequest",
    );
    expect(response.body.paths["/delivery/sales"].post.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Idempotency-Key",
          in: "header",
          required: true,
        }),
      ]),
    );
  });

  it("serves the Swagger UI", async () => {
    const response = await request(app).get("/api-docs/");

    expect(response.status).toBe(200);
    expect(response.text).toContain("swagger-ui");
  });

  it("creates an ERP sale with a valid idempotency key", async () => {
    mocks.createSale.mockResolvedValue({ id: 12 });

    const response = await request(app)
      .post("/delivery/sales")
      .set("Idempotency-Key", idempotencyKey)
      .send(sale);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 12 });
    expect(mocks.createSale).toHaveBeenCalledWith(sale, idempotencyKey);
  });

  // Testes de validação de entrada
  it("rejects a sale with an invalid body before calling the ERP", async () => {
    const response = await request(app)
      .post("/delivery/sales")
      .set("Idempotency-Key", idempotencyKey)
      .send({ payment: "PIX", products: [] });

    expect(response.status).toBe(400);
    expect(mocks.createSale).not.toHaveBeenCalled();
  });

  // Testes de validação de idempotency key
  it("rejects a sale without a valid idempotency key", async () => {
    const response = await request(app).post("/delivery/sales").send(sale);

    expect(response.status).toBe(400);
    expect(mocks.createSale).not.toHaveBeenCalled();
  });

  it("creates a checkout preference for valid checkout data", async () => {
    mocks.createCheckoutPreference.mockResolvedValue({
      checkoutUrl: "https://payments.example.test/checkout",
    });

    const response = await request(app)
      .post("/delivery/sales/checkout")
      .set("Idempotency-Key", idempotencyKey)
      .send(sale);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      checkoutUrl: "https://payments.example.test/checkout",
    });
    expect(mocks.createCheckoutPreference).toHaveBeenCalledWith(
      sale,
      idempotencyKey,
    );
  });

  // Testes de validação de entrada para checkout
  it("rejects the webhook when the secret is not configured", async () => {
    delete process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    const response = await request(app)
      .post("/delivery/sales/payments/webhooks/mercado-pago")
      .set("x-request-id", "request-1")
      .set("x-signature", createWebhookSignature("payment-1", "request-1"))
      .send({ data: { id: "payment-1" } });

    expect(response.status).toBe(401);
    expect(mocks.getPayment).not.toHaveBeenCalled();
  });

  // Testes de validação de assinatura do webhook
  it("rejects a webhook with an invalid signature", async () => {
    const response = await request(app)
      .post("/delivery/sales/payments/webhooks/mercado-pago")
      .set("x-request-id", "request-1")
      .set("x-signature", "ts=1700000000,v1=invalid")
      .send({ data: { id: "payment-1" } });

    expect(response.status).toBe(401);
    expect(mocks.getPayment).not.toHaveBeenCalled();
  });

  // Testes de validação de pagamento aprovado
  it("processes an approved payment with a valid webhook signature", async () => {
    const paymentId = "payment-1";
    const requestId = "request-1";
    mocks.getPayment.mockResolvedValue({
      status: "approved",
      payment_type_id: "credit_card",
      metadata: {
        delivery_sale: JSON.stringify(sale),
        idempotency_key: idempotencyKey,
      },
    });
    mocks.createSale.mockResolvedValue({ id: 12 });

    const response = await request(app)
      .post("/delivery/sales/payments/webhooks/mercado-pago")
      .set("x-request-id", requestId)
      .set("x-signature", createWebhookSignature(paymentId, requestId))
      .send({ data: { id: paymentId } });

    expect(response.status).toBe(200);
    expect(mocks.getPayment).toHaveBeenCalledWith({ id: paymentId });
    expect(mocks.createSale).toHaveBeenCalledWith(
      { ...sale, payment: "CARTAO_CREDITO" },
      idempotencyKey,
    );
  });
});
