export type Product = {
  id: number;
  name: string;
  salePrice: number;
  quantity: number;
  imageUrl?: string | null;
};

export type ProductsQueryResponse = {
  products: Array<
    Omit<Product, "id" | "quantity"> & {
      id: string | number;
      currentQuantity: number;
    }
  >;
};
