import { z } from "zod";
export const deliveryIdempotencyKeySchema = z
    .string()
    .uuid({ message: "Idempotency-Key deve ser um UUID válido." });
export const deliverySaleSchema = z.object({
    payment: z.enum(["DINHEIRO", "PIX", "CARTAO_CREDITO", "CARTAO_DEBITO"]),
    customerId: z.number().int().positive().nullable().optional(),
    observation: z.string().trim().max(500).optional(),
    products: z
        .array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
    }))
        .min(1),
});
export const deliveryCheckoutSchema = deliverySaleSchema.extend({
    payment: z.enum(["PIX", "CARTAO_CREDITO"]),
});
