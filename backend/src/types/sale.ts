//Tipagem da para busca de vendas no ERP
export interface ISale {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// Tipagem para criação de venda no ERP
export interface SaleInput {
  payment: string;
  customerId?: string | null;
  observation?: string;
  products: {
    productId: string;
    quantity: number;
  }[];
}
