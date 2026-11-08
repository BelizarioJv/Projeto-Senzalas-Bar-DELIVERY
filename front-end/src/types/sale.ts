export type DeliveryPaymentMethod =
  | "DINHEIRO"
  | "PIX"
  | "CARTAO_CREDITO"
  | "CARTAO_DEBITO";

//tipo de dados para criar uma venda de delivery
export interface CreateDeliverySaleData {
  payment: DeliveryPaymentMethod;
  customerId?: number | null;
  observation?: string;
  products: Array<{
    productId: number;
    quantity: number;
  }>;
}
