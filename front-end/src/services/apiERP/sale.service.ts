import type { CreateDeliverySaleData } from "@/types/sale";
import { deliveryApi } from "./api";

export async function createDeliverySale(data: CreateDeliverySaleData) {
  const response = await deliveryApi.post("/delivery/sales", data);
  return response.data;
}
