import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry.js";
import "./paths/delivery-sales.docs.js";
const generator = new OpenApiGeneratorV3(registry.definitions);
export const openApiDocument = generator.generateDocument({
    openapi: "3.0.0",
    info: {
        title: "Senzalas Delivery API",
        version: "1.0.0",
        description: "Documentação das rotas REST de vendas e pagamentos. O schema GraphQL é servido separadamente no endpoint /graphql.",
    },
    servers: [
        {
            url: process.env.API_BASE_URL ?? "http://localhost:8081",
            description: "Servidor da API",
        },
    ],
});
