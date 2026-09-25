"use client";

import { useState } from "react";
import { Minus, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type CartItem = Product & { quantity: number };

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Home() {
  const { data, isLoading, isError, refetch } = useProducts();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const products = (data?.products ?? []).filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.currentQuantity),
              }
            : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(id: string, amount: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + amount,
                  item.currentQuantity,
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0,
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div>
            <p className="font-heading text-2xl font-semibold text-primary">
              Senzala&apos;s
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-background/60">
              Delivery
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-background/80">
            <ShoppingBag className="size-5 text-primary" />
            <span>{itemCount} item(ns)</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px] lg:px-8">
        <section>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
                Cardápio
              </p>
              <h1 className="font-heading text-4xl font-semibold tracking-tight">
                Escolha seus produtos
              </h1>
              <p className="mt-2 text-muted-foreground">
                Monte seu pedido com os favoritos da casa.
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar produto"
                className="pl-9"
              />
            </div>
          </div>

          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-48" />
              ))}
            </div>
          )}
          {isError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-destructive">
              Não foi possível carregar os produtos.{" "}
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="ml-2">
                Tentar novamente
              </Button>
            </div>
          )}
          {!isLoading && !isError && products.length === 0 && (
            <p className="text-muted-foreground">Nenhum produto encontrado.</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="flex h-28 items-center justify-center bg-primary/10 text-4xl">
                  Produto
                </div>
                <CardContent className="p-4">
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="mt-1 text-lg font-bold text-primary">
                    {currency.format(product.salePrice)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {product.currentQuantity} disponível(is)
                  </p>
                  <Button
                    className="mt-4 w-full"
                    disabled={product.currentQuantity === 0}
                    onClick={() => addToCart(product)}>
                    <Plus className="size-4" />
                    Adicionar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <aside>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="size-5 text-primary" />
                Seu pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Seu carrinho está vazio.
                </p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="border-b pb-4">
                      <div className="flex justify-between gap-3">
                        <span className="font-medium">{item.name}</span>
                        <span>
                          {currency.format(item.salePrice * item.quantity)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => changeQuantity(item.id, -1)}>
                            <Minus className="size-4" />
                          </Button>
                          <span className="w-5 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            disabled={item.quantity >= item.currentQuantity}
                            onClick={() => changeQuantity(item.id, 1)}>
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() =>
                            setCart((current) =>
                              current.filter(
                                (cartItem) => cartItem.id !== item.id,
                              ),
                            )
                          }>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {currency.format(total)}
                    </span>
                  </div>
                  <Button className="w-full" size="lg">
                    Continuar pedido
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
