"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  getSelectedQuantity: (id: Product["id"]) => number;
  incrementQuantity: (id: Product["id"], max: number) => void;
  decrementQuantity: (id: Product["id"]) => void;
  addedId: Product["id"] | null;
  onAdd: (product: Product) => void;
};

export function ProductGrid({
  products,
  getSelectedQuantity,
  incrementQuantity,
  decrementQuantity,
  addedId,
  onAdd,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selectedQty={getSelectedQuantity(product.id)}
          justAdded={addedId === product.id}
          onIncrement={() => incrementQuantity(product.id, product.quantity)}
          onDecrement={() => decrementQuantity(product.id)}
          onAdd={() => onAdd(product)}
        />
      ))}
    </div>
  );
}

export function ProductSkeletons() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <Skeleton key={item} className="h-72 rounded-2xl" />
      ))}
    </div>
  );
}
