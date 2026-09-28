"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Minus,
  Plus,
  QrCode,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearProductCompletely } = useCart();

  // Estados locais do formulário de finalização
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "cash">(
    "pix",
  );
  const [address, setAddress] = useState({
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
  });

  // Cálculos financeiros
  const subtotal = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0,
  );
  const deliveryFee = cart.length > 0 ? 7.0 : 0.0; // Exemplo de taxa de entrega fixa
  const total = subtotal + deliveryFee;

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Lógica para enviar o pedido (ex: integração com backend ou WhatsApp)
    alert("Pedido enviado com sucesso!");
  };

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header simples */}
      <header className="border-b bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm transition-colors hover:text-primary">
            <ArrowLeft className="size-4" />
            Voltar ao cardápio
          </Link>
          <p className="font-heading text-xl font-semibold text-primary">
            Senzala&apos;s
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Meu Carrinho
        </h1>

        {cart.length === 0 ? (
          /* Estado Vazio */
          <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <ShoppingBag className="size-16 text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-semibold">
              Seu carrinho está vazio
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Você ainda não adicionou nenhum item do nosso cardápio.
            </p>
            <Button className="mt-6">
              <Link href="/">Ver cardápio</Link>
            </Button>
          </div>
        ) : (
          /* Conteúdo do Carrinho com Itens */
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Lista de Produtos + Formulários */}
            <div className="space-y-6">
              {/* Card de Produtos Escolhidos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm font-semibold text-primary">
                          {currency.format(item.salePrice)} un.
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        {/* Controles de Quantidade */}
                        <div className="flex items-center gap-1 rounded-md border p-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            onClick={() => removeFromCart(item.id, 1)}>
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={item.quantity >= item.quantity}
                            onClick={() =>
                              addToCart({
                                ...item,
                                quantity: item.quantity + 1,
                              })
                            }>
                            <Plus className="size-3" />
                          </Button>
                        </div>

                        {/* Subtotal do Item */}
                        <span className="w-24 text-right font-semibold">
                          {currency.format(item.salePrice * item.quantity)}
                        </span>

                        {/* Botão Deletar */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => clearProductCompletely(item.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Endereço de Entrega */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="street">Rua / Avenida</Label>
                      <Input
                        id="street"
                        placeholder="Ex: Rua das Flores"
                        value={address.street}
                        onChange={(e) =>
                          setAddress({ ...address, street: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        placeholder="Ex: 123"
                        value={address.number}
                        onChange={(e) =>
                          setAddress({ ...address, number: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        placeholder="Ex: Centro"
                        value={address.neighborhood}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            neighborhood: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="complement">Complemento (opcional)</Label>
                      <Input
                        id="complement"
                        placeholder="Ex: Apto 101, Bloco B"
                        value={address.complement}
                        onChange={(e) =>
                          setAddress({ ...address, complement: e.target.value })
                        }
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("pix")}
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors ${
                        paymentMethod === "pix"
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-input hover:bg-accent"
                      }`}>
                      <QrCode className="size-6" />
                      <span className="text-sm">PIX</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-input hover:bg-accent"
                      }`}>
                      <CreditCard className="size-6" />
                      <span className="text-sm">Cartão na entrega</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cash")}
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors ${
                        paymentMethod === "cash"
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-input hover:bg-accent"
                      }`}>
                      <DollarSign className="size-6" />
                      <span className="text-sm">Dinheiro</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar de Resumo do Pedido */}
            <aside>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{currency.format(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Taxa de entrega
                    </span>
                    <span>{currency.format(deliveryFee)}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        {currency.format(total)}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleFinishOrder}>
                    Finalizar Pedido
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
