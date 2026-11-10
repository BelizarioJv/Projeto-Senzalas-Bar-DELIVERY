"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/product";
import { CartItem } from "./CartItem";
import { currency } from "@/utils/currency";

type CartSummaryProps = {
  stockById: Map<Product["id"], number>;
  onContinue: () => void;
};

export function CartSummary({ stockById, onContinue }: CartSummaryProps) {
  const { cart, addToCart, removeFromCart, clearProductCompletely } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0,
  );

  return (
    <Card className="sticky top-24 rounded-2xl border-0 shadow-md ring-1 ring-foreground/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="size-5 text-primary" />
          Seu pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="size-6 text-primary" />
            </div>
            <p className="font-medium">Seu carrinho está vazio</p>
            <p className="text-sm text-muted-foreground">
              Adicione produtos para montar o pedido.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-[50vh] space-y-4 overflow-y-auto pr-1">
              {cart.map((item) => {
                const stock = stockById.get(item.id);
                const reachedStock =
                  stock !== undefined && item.quantity >= stock;

                return (
                  <CartItem
                    key={item.id}
                    product={item}
                    compact
                    canIncrement={!reachedStock}
                    onDecrement={() => removeFromCart(item.id, 1)}
                    onIncrement={() =>
                      addToCart({ ...item, quantity: item.quantity + 1 })
                    }
                    onRemove={() => clearProductCompletely(item.id)}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{currency.format(total)}</span>
            </div>
            <Button
              className="h-12 w-full rounded-full text-base"
              size="lg"
              onClick={onContinue}>
              Continuar pedido
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
