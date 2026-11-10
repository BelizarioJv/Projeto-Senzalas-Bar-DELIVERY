"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  QrCode,
  ShoppingBag,
} from "lucide-react";
import { CartItem } from "@/components/cart";
import { StoreFooter, StoreHeader } from "@/components/layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeliveryAddressDialog from "@/components/DeliveryAddressDialog";
import { useCreateSale } from "@/hooks/useCreateSale";
import { toast } from "sonner";
import { useDeliveryCheckout } from "@/hooks/useDeliveryCheckout";
import { currency } from "@/utils/currency";

export default function CartPage() {
  // Contexto do Carrinho e Checkout
  const { cart, addToCart, removeFromCart, clearProductCompletely } = useCart();
  const clearCart = () => {
    cart.forEach((item) => clearProductCompletely(item.id));
  };
  const {
    paymentMethod,
    setPaymentMethod,
    addresses,
    selectedAddressId,
    address,
    addressDialogOpen,
    setAddressDialogOpen,
    loadingAddresses,
    addressError,
    savingAddress,
    selectAddress,
    addAddress,
  } = useDeliveryCheckout();

  // Hook para criar a venda
  const createSale = useCreateSale({ onSuccess: clearCart });

  // Cálculos financeiros e totais do pedido por enquanto usando frete fixo para depois ver como calcular por area e fora de area de entrega
  const subtotal = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0,
  );
  const deliveryFee = cart.length > 0 ? 7.0 : 0.0; // Exemplo de taxa de entrega fixa
  const total = subtotal + deliveryFee;

  // Função para finalizar o pedido
  const handleFinishOrder = async () => {
    if (createSale.isPending) return;

    if (cart.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }

    const invalidProduct = cart.find(
      (item) =>
        !Number.isInteger(item.id) ||
        item.id <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0,
    );

    if (invalidProduct) {
      toast.error("Existem itens inválidos no carrinho.");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Selecione um endereço de entrega.");
      return;
    }

    const requiredAddressFields = [
      address.postalCode,
      address.street,
      address.number,
      address.neighborhood,
      address.city,
      address.state,
    ];

    if (requiredAddressFields.some((value) => !value.trim())) {
      toast.error("O endereço selecionado está incompleto.");
      return;
    }

    const paymentByDeliveryMethod = {
      pix: "PIX",
      online_card: "CARTAO_CREDITO",
      delivery_card: "CARTAO_CREDITO",
      cash: "DINHEIRO",
    } as const;

    const deliveryAddress = [
      `${address.street}, ${address.number}`,
      address.complement ? `Complemento: ${address.complement}` : null,
      `Bairro: ${address.neighborhood}`,
      `${address.city} - ${address.state}`,
      `CEP: ${address.postalCode}`,
    ]
      .filter(Boolean)
      .join(" | ");

    createSale.mutate({
      checkoutOnline:
        paymentMethod === "pix" || paymentMethod === "online_card",
      data: {
        payment: paymentByDeliveryMethod[paymentMethod],
        observation: `Delivery: ${deliveryAddress}`,
        products: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      },
    });
  };

  return (
    <main className="min-h-screen bg-background pb-12">
      <StoreHeader />

      <section
        aria-labelledby="cart-title"
        className="relative overflow-hidden bg-foreground text-background">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:py-14 lg:px-8">
          <Link
            href="/home"
            className="inline-flex w-fit items-center gap-2 text-sm text-white/70 transition-colors hover:text-primary">
            <ArrowLeft className="size-4" />
            Voltar ao cardápio
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <ShoppingBag className="size-7" />
            </div>
            <div>
              <h1
                id="cart-title"
                className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Meu carrinho
              </h1>
              <p className="mt-1 text-sm text-white/70 sm:text-base">
                Confira seu pedido e escolha como receber.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {cart.length === 0 ? (
          /* Estado carrinho vazio */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card p-12 text-center shadow-sm">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="size-9 text-primary" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">
              Seu carrinho está vazio
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Você ainda não adicionou nenhum item do nosso cardápio.
            </p>
            <Link
              href="/home"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Ver cardápio
            </Link>
          </div>
        ) : (
          /* Conteúdo do Carrinho com Itens */
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Lista de Produtos + Formulários */}
            <div className="space-y-6">
              {/* Card de Produtos Escolhidos */}
              <Card className="rounded-2xl border-0 shadow-sm ring-1 ring-foreground/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="size-5 text-primary" />
                    Itens do pedido
                    <span className="text-sm font-normal text-muted-foreground">
                      ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      product={item}
                      onDecrement={() => removeFromCart(item.id, 1)}
                      onIncrement={() =>
                        addToCart({ ...item, quantity: item.quantity + 1 })
                      }
                      onRemove={() => clearProductCompletely(item.id)}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Endereço de Entrega */}
              <Card className="rounded-2xl border-0 shadow-sm ring-1 ring-foreground/10">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">
                      Endereço de Entrega
                    </CardTitle>
                    {selectedAddressId && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {address.street}, {address.number}
                        {address.complement ? `, ${address.complement}` : ""}
                        {" - "}
                        {address.neighborhood}
                      </p>
                    )}
                  </div>
                  <DeliveryAddressDialog
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    loading={loadingAddresses}
                    saving={savingAddress}
                    error={addressError}
                    open={addressDialogOpen}
                    onOpenChange={setAddressDialogOpen}
                    onSelect={(item) => {
                      selectAddress(item);
                      setAddressDialogOpen(false);
                    }}
                    onSave={addAddress}
                  />
                </CardHeader>
                <CardContent>
                  {selectedAddressId ? (
                    <p className="text-sm text-muted-foreground">
                      {address.city} - {address.state} · CEP{" "}
                      {address.postalCode}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Selecione ou cadastre o endereço onde o pedido será
                      entregue.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Pagamento */}
              <Card className="rounded-2xl border-0 shadow-sm ring-1 ring-foreground/10">
                <CardHeader>
                  <CardTitle className="text-lg">Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("pix")}
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-colors ${
                        paymentMethod === "pix" ||
                        paymentMethod === "online_card"
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-input hover:bg-accent"
                      }`}>
                      <CreditCard className="size-6" />
                      <span className="text-sm">Pagar online</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("delivery_card")}
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-colors ${
                        paymentMethod === "delivery_card" ||
                        paymentMethod === "cash"
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-input hover:bg-accent"
                      }`}>
                      <DollarSign className="size-6" />
                      <span className="text-sm">Pagar na entrega</span>
                    </button>
                  </div>

                  {(paymentMethod === "pix" ||
                    paymentMethod === "online_card") && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 ${
                          paymentMethod === "pix"
                            ? "border-primary bg-primary/10 font-semibold text-primary"
                            : "border-input hover:bg-accent"
                        }`}>
                        <QrCode className="size-6" />
                        <span className="text-sm">PIX</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("online_card")}
                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 ${
                          paymentMethod === "online_card"
                            ? "border-primary bg-primary/10 font-semibold text-primary"
                            : "border-input hover:bg-accent"
                        }`}>
                        <CreditCard className="size-6" />
                        <span className="text-sm">Cartão online</span>
                      </button>
                    </div>
                  )}

                  {(paymentMethod === "delivery_card" ||
                    paymentMethod === "cash") && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("delivery_card")}
                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 ${
                          paymentMethod === "delivery_card"
                            ? "border-primary bg-primary/10 font-semibold text-primary"
                            : "border-input hover:bg-accent"
                        }`}>
                        <CreditCard className="size-6" />
                        <span className="text-sm">Cartão na entrega</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 ${
                          paymentMethod === "cash"
                            ? "border-primary bg-primary/10 font-semibold text-primary"
                            : "border-input hover:bg-accent"
                        }`}>
                        <DollarSign className="size-6" />
                        <span className="text-sm">Dinheiro</span>
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar de Resumo do Pedido */}
            <aside>
              <Card className="sticky top-24 rounded-2xl border-0 shadow-md ring-1 ring-foreground/10">
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
                    className="h-12 w-full rounded-full text-base"
                    disabled={createSale.isPending}
                    onClick={handleFinishOrder}>
                    {createSale.isPending
                      ? "Enviando pedido..."
                      : "Finalizar Pedido"}
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </div>
      <StoreFooter />
    </main>
  );
}
