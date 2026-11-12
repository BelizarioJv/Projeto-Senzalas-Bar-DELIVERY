import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { ZodError } from "zod";
import { deliverySaleRouter } from "../routes/deliverySaleRoutes.js";
import { openApiDocument } from "../docs/openapi.js";
// Error handler middleware
const errorHandler = (error, _req, res, _next) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            message: "Requisição inválida.",
            errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
        return;
    }
    console.error("Erro não tratado na API de delivery:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
};
//Criaçao e configuração do app express
export function createApp(graphqlMiddleware) {
    const app = express();
    app.use(express.json({ limit: "1mb" }));
    app.use(cors());
    if (graphqlMiddleware) {
        app.use("/graphql", graphqlMiddleware);
    }
    app.get("/api-docs.json", (_req, res) => {
        res.json(openApiDocument);
    });
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
    app.use("/delivery/sales", deliverySaleRouter);
    app.use(errorHandler);
    return app;
}
