export interface IProduct {
  id: string;
  name: string;
  salePrice: number;
  currentQuantity: number;
  imageUrl?: string | null;
}
