export type Product = {
  id: number;
  name: string;
  salePrice: number;
  quantity: number;
};

export type ProductsQueryResponse = {
  products: Product[];
};
