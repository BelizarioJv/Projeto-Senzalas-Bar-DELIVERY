export type DeliveryPaymentMethod =
  | "DINHEIRO"
  | "PIX"
  | "CARTAO_CREDITO"
  | "CARTAO_DEBITO";

export interface CreateDeliverySaleData {
  payment: DeliveryPaymentMethod;
  customerId?: number | null;
  observation?: string;
  products: Array<{
    productId: number;
    quantity: number;
  }>;
}
