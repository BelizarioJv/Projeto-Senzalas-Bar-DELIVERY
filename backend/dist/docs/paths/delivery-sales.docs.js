import { z } from "zod";
import { checkoutPreferenceResponseSchema, deliveryCheckoutSchema, deliveryIdempotencyKeySchema, deliverySaleResponseSchema, deliverySaleSchema, webhookRequestSchema, } from "../Schemas/DeliverySaleRequestSchema.js";
import { registry } from "../registry.js";
const idempotencyHeadersSchema = z.object({
    "Idempotency-Key": deliveryIdempotencyKeySchema,
});
const webhookHeadersSchema = z.object({
    "x-signature": z.string().openapi({
        description: "Assinatura HMAC SHA-256 enviada pelo Mercado Pago.",
        example: "ts=1700000000,v1=0123456789abcdef",
    }),
    "x-request-id": z.string().openapi({
        description: "Identificador da requisição enviado pelo Mercado Pago.",
        example: "request-123",
    }),
});
const validationErrorSchema = z
    .object({
    message: z.string().openapi({ example: "Requisição inválida." }),
    errors: z.array(z.object({
        field: z.string(),
        message: z.string(),
    })),
})
    .openapi("ValidationError");
registry.registerPath({
    method: "post",
    path: "/delivery/sales",
    tags: ["Vendas de delivery"],
    summary: "Criar venda",
    description: "Valida a venda e encaminha a solicitação ao ERP. Requer chave de idempotência UUID.",
    request: {
        headers: idempotencyHeadersSchema,
        body: {
            content: {
                "application/json": {
                    schema: deliverySaleSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Venda criada no ERP.",
            content: {
                "application/json": {
                    schema: deliverySaleResponseSchema,
                },
            },
        },
        400: {
            description: "Corpo inválido ou chave de idempotência ausente/inválida.",
            content: {
                "application/json": { schema: validationErrorSchema },
            },
        },
        500: { description: "Falha ao criar a venda no ERP." },
    },
});
registry.registerPath({
    method: "post",
    path: "/delivery/sales/checkout",
    tags: ["Vendas de delivery"],
    summary: "Criar preferência de checkout",
    description: "Cria uma preferência de pagamento online. A forma de pagamento deve ser PIX ou cartão de crédito.",
    request: {
        headers: idempotencyHeadersSchema,
        body: {
            content: {
                "application/json": {
                    schema: deliveryCheckoutSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Preferência de checkout criada.",
            content: {
                "application/json": {
                    schema: checkoutPreferenceResponseSchema,
                },
            },
        },
        400: {
            description: "Corpo inválido ou chave de idempotência ausente/inválida.",
            content: {
                "application/json": { schema: validationErrorSchema },
            },
        },
        500: { description: "Falha ao criar checkout." },
    },
});
registry.registerPath({
    method: "post",
    path: "/delivery/sales/payments/webhooks/mercado-pago",
    tags: ["Pagamentos"],
    summary: "Receber webhook do Mercado Pago",
    description: "Processa notificações de pagamento. A assinatura é validada usando MERCADO_PAGO_WEBHOOK_SECRET.",
    request: {
        headers: webhookHeadersSchema,
        body: {
            content: {
                "application/json": {
                    schema: webhookRequestSchema,
                },
            },
        },
    },
    responses: {
        200: { description: "Notificação recebida e processada." },
        400: { description: "ID do pagamento ou metadados inválidos." },
        401: { description: "Assinatura inválida ou segredo não configurado." },
        500: { description: "Falha ao consultar o pagamento ou registrar a venda." },
    },
});
