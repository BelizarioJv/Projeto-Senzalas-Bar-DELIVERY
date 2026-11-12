import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);
export const deliveryIdempotencyKeySchema = z
    .string()
    .uuid({ message: "Idempotency-Key deve ser um UUID válido." })
    .openapi({
    description: "UUID único usado para evitar a criação duplicada de vendas.",
    example: "077bb654-4edf-4ac4-9cfc-a0f6c18f4432",
});
const deliverySaleProductSchema = z
    .object({
    productId: z.number().int().positive().openapi({
        description: "ID do produto no ERP.",
        example: 10,
    }),
    quantity: z.number().int().positive().openapi({
        description: "Quantidade solicitada.",
        example: 2,
    }),
})
    .openapi("DeliverySaleProduct");
export const deliverySaleSchema = z
    .object({
    payment: z
        .enum(["DINHEIRO", "PIX", "CARTAO_CREDITO", "CARTAO_DEBITO"])
        .openapi({
        description: "Forma de pagamento da venda.",
        example: "PIX",
    }),
    customerId: z.number().int().positive().nullable().optional().openapi({
        description: "ID do cliente no ERP, quando informado.",
        example: 25,
    }),
    observation: z.string().trim().max(500).optional().openapi({
        description: "Observação da venda (máximo de 500 caracteres).",
        example: "Entregar na portaria.",
    }),
    products: z.array(deliverySaleProductSchema).min(1).openapi({
        description: "Produtos e quantidades da venda.",
    }),
})
    .openapi("DeliverySaleRequest");
export const deliveryCheckoutSchema = deliverySaleSchema
    .extend({
    payment: z.enum(["PIX", "CARTAO_CREDITO"]).openapi({
        description: "Forma de pagamento online.",
        example: "PIX",
    }),
})
    .openapi("DeliveryCheckoutRequest");
export const deliverySaleResponseSchema = z
    .object({
    id: z.number().int().positive().openapi({ example: 12 }),
})
    .passthrough()
    .openapi("DeliverySaleResponse");
export const checkoutPreferenceResponseSchema = z
    .object({
    checkoutUrl: z.string().url().openapi({
        description: "URL para redirecionar o cliente ao checkout do Mercado Pago.",
        example: "https://www.mercadopago.com/checkout/v1/redirect?pref_id=example",
    }),
})
    .openapi("DeliveryCheckoutResponse");
export const webhookRequestSchema = z
    .object({
    data: z
        .object({
        id: z.union([z.string(), z.number()]),
    })
        .optional(),
    id: z.union([z.string(), z.number()]).optional(),
})
    .openapi("MercadoPagoWebhookRequest");
