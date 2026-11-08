import { MercadoPagoConfig, Preference } from "mercadopago";
import { fetchProductById } from "./erp-product.service.js";
import type { SaleInput } from "../types/sale.js";

export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const DELIVERY_FEE = 7;

function normalizePublicUrl(value: string | undefined, variableName: string) {
  if (!value) {
    throw new Error(`${variableName} não configurada.`);
  }

  try {
    const url = new URL(value.trim());

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error();
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    throw new Error(`${variableName} deve ser uma URL válida.`);
  }
}

//Preferencias de checkout do Mercado Pago para vendas de delivery
export async function createCheckoutPreference(
  saleData: SaleInput,
  idempotencyKey: string,
) {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado.");
  }

  const frontendUrl = normalizePublicUrl(
    process.env.FRONTEND_URL,
    "FRONTEND_URL",
  );
  const backendUrl = normalizePublicUrl(
    process.env.BACKEND_URL,
    "BACKEND_URL",
  );

  const itemProducts = await Promise.all(
    saleData.products.map(async (product) => {
      const productData = await fetchProductById(String(product.productId));

      if (!productData) {
        throw new Error(`Produto ${product.productId} não encontrado.`);
      }

      if (product.quantity > productData.currentQuantity) {
        throw new Error(`Estoque insuficiente para o produto ${product.productId}.`);
      }

      return {
        id: String(product.productId),
        title: productData.name,
        quantity: product.quantity,
        unit_price: productData.salePrice,
      };
    }),
  );

  const preference = new Preference(mercadoPagoClient);
  const result = await preference.create({
    body: {
      items: [
        ...itemProducts,
        {
          id: "delivery-fee",
          title: "Taxa de entrega",
          quantity: 1,
          unit_price: DELIVERY_FEE,
        },
      ],
      external_reference: idempotencyKey,
      payment_methods:
        saleData.payment === "PIX"
          ? {
              excluded_payment_types: [
                { id: "credit_card" },
                { id: "debit_card" },
                { id: "ticket" },
                { id: "atm" },
              ],
            }
          : {
              excluded_payment_types: [
                { id: "bank_transfer" },
                { id: "ticket" },
                { id: "atm" },
              ],
            },
      metadata: {
        delivery_sale: JSON.stringify(saleData),
        idempotency_key: idempotencyKey,
      },
      back_urls: {
        success: `${frontendUrl}/pagamento/aprovado`,
        failure: `${frontendUrl}/pagamento/falhou`,
        pending: `${frontendUrl}/pagamento/pendente`,
      },
      ...(frontendUrl.startsWith("https://")
        ? { auto_return: "approved" }
        : {}),
      notification_url: `${backendUrl}/delivery/sales/payments/webhooks/mercado-pago`,
    },
  });

  if (!result.init_point) {
    throw new Error("Mercado Pago não retornou o link do checkout.");
  }

  return {
    checkoutUrl: result.init_point,
  };
}
