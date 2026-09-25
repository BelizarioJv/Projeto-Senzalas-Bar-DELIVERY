export type Product = {
  id: string;
  name: string;
  salePrice: number;
  currentQuantity: number;
};

export type ProductsQueryResponse = {
  products: Product[];
};
