import express from "express";
import { createDeliverySale, createDeliveryCheckout, handleMercadoPagoWebhook, } from "../controller/DeliverySaleController.js";
export const deliverySaleRouter = express.Router();
//Rotas para vendas de delivery
deliverySaleRouter.post("/", createDeliverySale);
//Rota para criar uma preferência de checkout do Mercado Pago para vendas de delivery
deliverySaleRouter.post("/checkout", createDeliveryCheckout);
//Rota para receber webhooks do Mercado Pago sobre pagamentos de vendas de delivery
deliverySaleRouter.post("/payments/webhooks/mercado-pago", handleMercadoPagoWebhook);
