import { RequestHandler } from "express";
import {
  deliveryIdempotencyKeySchema,
  deliverySaleSchema,
} from "../docs/Schemas/DeliverySaleRequestSchema.js";
import { createSale } from "../services/erp-sale.service.js";

export const createDeliverySale: RequestHandler = async (req, res, next) => {
  try {
    const sale = deliverySaleSchema.parse(req.body);
    const idempotencyKey = deliveryIdempotencyKeySchema.parse(
      req.header("Idempotency-Key"),
    );
    const result = await createSale(sale, idempotencyKey);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
