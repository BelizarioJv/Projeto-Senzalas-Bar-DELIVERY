"use client";

import { Beer, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/product";
import { currency } from "@/utils/currency";

type ProductCardProps = {
  product: Product;
  selectedQty: number;
  justAdded: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onAdd: () => void;
};

export function ProductCard({
  product,
  selectedQty,
  justAdded,
  onIncrement,
  onDecrement,
  onAdd,
}: ProductCardProps) {
  const isOutOfStock = product.quantity === 0;

  return (
    <Card
      className={`group flex flex-col overflow-hidden rounded-2xl border-0 shadow-sm ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isOutOfStock ? "opacity-70" : ""
      }`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-primary/10">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? "grayscale" : ""
            }`}
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Beer className="size-10 text-primary/60" />
            <span className="text-xs font-medium">Sem imagem</span>
          </div>
        )}
        {isOutOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
            Esgotado
          </span>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug sm:text-base">
          {product.name}
        </h3>
        <p className="mt-2 text-xl font-bold text-primary">
          {currency.format(product.salePrice)}
        </p>
        {!isOutOfStock && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {product.quantity} disponível(is)
          </p>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <div className="flex items-center justify-between rounded-full border p-1">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Diminuir quantidade"
              className="size-9 rounded-full"
              disabled={isOutOfStock || selectedQty <= 1}
              onClick={onDecrement}>
              <Minus className="size-4" />
            </Button>
            <span
              className="min-w-8 text-center text-sm font-semibold"
              aria-live="polite">
              {selectedQty}
            </span>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Aumentar quantidade"
              className="size-9 rounded-full"
              disabled={isOutOfStock || selectedQty >= product.quantity}
              onClick={onIncrement}>
              <Plus className="size-4" />
            </Button>
          </div>

          <Button
            className={`h-11 w-full rounded-full text-sm font-semibold transition-all active:scale-95 ${
              justAdded ? "bg-green-600 hover:bg-green-600" : ""
            }`}
            disabled={isOutOfStock}
            onClick={onAdd}>
            {isOutOfStock ? (
              "Esgotado"
            ) : justAdded ? (
              <>
                <Check className="mr-1.5 size-4" />
                Adicionado
              </>
            ) : (
              <>
                <Plus className="mr-1.5 size-4" />
                Adicionar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Seção de produtos (destaques + catálogo)                                   */
/* -------------------------------------------------------------------------- */
