import type { CreateDeliverySaleData } from "@/types/sale";
import { deliveryApi } from "./api";

// Função para criar uma venda de delivery
export async function createDeliverySale(
  data: CreateDeliverySaleData,
  idempotencyKey: string,
) {
  const response = await deliveryApi.post("/delivery/sales", data, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return response.data;
}
