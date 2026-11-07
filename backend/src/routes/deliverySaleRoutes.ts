import express from "express";
import { createDeliverySale } from "../controller/DeliverySaleController.js";

export const deliverySaleRouter = express.Router();

deliverySaleRouter.post("/", createDeliverySale);
