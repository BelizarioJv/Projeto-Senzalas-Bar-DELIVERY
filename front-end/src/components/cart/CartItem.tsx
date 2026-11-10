"use client";

import { Beer, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { currency } from "@/utils/currency";

type CartItemProps = {
  product: Product;
  compact?: boolean;
  canIncrement?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
};

export function CartItem({
  product,
  compact = false,
  canIncrement = true,
  onDecrement,
  onIncrement,
  onRemove,
}: CartItemProps) {
  return (
    <div
      className={`flex gap-4 ${
        compact
          ? "border-b pb-4 last:border-b-0"
          : "flex-col py-5 sm:flex-row sm:items-center sm:justify-between"
      }`}>
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div
          className={`relative shrink-0 overflow-hidden rounded-xl bg-primary/10 ${
            compact ? "size-14" : "size-20"
          }`}>
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Beer className="size-7 text-primary/60" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {currency.format(product.salePrice)} cada
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="flex items-center gap-1 rounded-full border p-1">
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Remover uma unidade de ${product.name}`}
            className={`rounded-full ${compact ? "size-8" : "size-9"}`}
            onClick={onDecrement}>
            <Minus className="size-3" />
          </Button>
          <span
            className="min-w-8 text-center text-sm font-semibold"
            aria-live="polite">
            {product.quantity}
          </span>
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Adicionar uma unidade de ${product.name}`}
            className={`rounded-full ${compact ? "size-8" : "size-9"}`}
            disabled={!canIncrement}
            onClick={onIncrement}>
            <Plus className="size-3" />
          </Button>
        </div>

        <span
          className={`shrink-0 text-right font-semibold ${
            compact ? "text-sm" : "w-28"
          }`}>
          {currency.format(product.salePrice * product.quantity)}
        </span>

        <Button
          size="icon"
          variant="ghost"
          aria-label={`Remover ${product.name} do carrinho`}
          className="size-9 rounded-full text-destructive hover:text-destructive"
          onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
