import { Product } from "./product";

export interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearProductCompletely?: (id: number) => void;
}
