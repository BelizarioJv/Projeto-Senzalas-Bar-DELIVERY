import { deliveryIdempotencyKeySchema, deliverySaleSchema, deliveryCheckoutSchema, } from "../docs/Schemas/DeliverySaleRequestSchema.js";
import { createSale } from "../services/erp-sale.service.js";
import { createCheckoutPreference } from "../services/mercado-pago.service.js";
import { Payment } from "mercadopago";
import { createHmac, timingSafeEqual } from "node:crypto";
function isValidWebhookSignature(req) {
    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    if (!secret)
        return false;
    const signature = req.header("x-signature");
    const requestId = req.header("x-request-id");
    if (!signature || !requestId)
        return false;
    const parts = Object.fromEntries(signature
        .split(",")
        .map((part) => part.trim().split("=", 2))
        .filter((part) => part.length === 2 && Boolean(part[0]) && Boolean(part[1])));
    if (!parts.ts || !parts.v1 || !/^[a-f\d]{64}$/i.test(parts.v1)) {
        return false;
    }
    const paymentId = req.body?.data?.id ?? req.body?.id;
    if (paymentId === undefined || paymentId === null)
        return false;
    const manifest = `id:${paymentId};request_id:${requestId};ts:${parts.ts};`;
    const expected = createHmac("sha256", secret).update(manifest).digest();
    const received = Buffer.from(parts.v1, "hex");
    return received.length === expected.length && timingSafeEqual(received, expected);
}
export const createDeliverySale = async (req, res, next) => {
    try {
        const sale = deliverySaleSchema.parse(req.body);
        const idempotencyKey = deliveryIdempotencyKeySchema.parse(req.header("Idempotency-Key"));
        const result = await createSale(sale, idempotencyKey);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
export const createDeliveryCheckout = async (req, res, next) => {
    try {
        const sale = deliveryCheckoutSchema.parse(req.body);
        const idempotencyKey = deliveryIdempotencyKeySchema.parse(req.header("Idempotency-Key"));
        const result = await createCheckoutPreference(sale, idempotencyKey);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
export const handleMercadoPagoWebhook = async (req, res, next) => {
    try {
        if (!isValidWebhookSignature(req)) {
            res.status(401).json({ message: "Assinatura do webhook inválida." });
            return;
        }
        const paymentId = req.body?.data?.id ??
            req.body?.id ??
            req.query.id ??
            req.query["data.id"];
        if (!paymentId) {
            res.status(400).json({ message: "ID do pagamento não informado." });
            return;
        }
        const payment = await new Payment((await import("../services/mercado-pago.service.js")).mercadoPagoClient).get({ id: String(paymentId) });
        if (payment.status === "approved") {
            const sale = JSON.parse(String(payment.metadata?.delivery_sale ?? "{}"));
            const idempotencyKey = String(payment.metadata?.idempotency_key ?? "");
            if (!sale.products || !idempotencyKey) {
                res.status(400).json({ message: "Metadados do pedido inválidos." });
                return;
            }
            if (payment.payment_type_id === "debit_card") {
                sale.payment = "CARTAO_DEBITO";
            }
            else if (payment.payment_type_id === "credit_card" ||
                payment.payment_type_id === "prepaid_card") {
                sale.payment = "CARTAO_CREDITO";
            }
            else if (payment.payment_method_id === "pix") {
                sale.payment = "PIX";
            }
            await createSale(sale, idempotencyKey);
        }
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
};
