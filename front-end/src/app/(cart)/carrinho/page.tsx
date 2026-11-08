"use client";

import Image from "next/image";
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
import DeliveryAddressDialog from "@/components/DeliveryAddressDialog";
import { useCreateSale } from "@/hooks/useCreateSale";
import { toast } from "sonner";
import { useDeliveryCheckout } from "@/hooks/useDeliveryCheckout";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearProductCompletely } = useCart();
  const clearCart = () => {
    cart.forEach((item) => clearProductCompletely(item.id));
  };
  const createSale = useCreateSale({ onSuccess: clearCart });
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

  // Cálculos financeiros
  const subtotal = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0,
  );
  const deliveryFee = cart.length > 0 ? 7.0 : 0.0; // Exemplo de taxa de entrega fixa
  const total = subtotal + deliveryFee;

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
      card: "CARTAO_CREDITO",
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
      payment: paymentByDeliveryMethod[paymentMethod],
      observation: `Delivery: ${deliveryAddress}`,
      products: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header simples */}
      <header className="border-b bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link
            href="/home"
            className="flex items-center gap-2 text-sm transition-colors hover:text-primary">
            <ArrowLeft className="size-4" />
            Voltar ao cardápio
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/LogoSenzalasBar.png"
              alt="SenzalasBar"
              width={150}
              height={44}
              priority
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Meu Carrinho
        </h1>

        {cart.length === 0 ? (
          /* Estado carrinho vazio */
          <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <ShoppingBag className="size-16 text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-semibold">
              Seu carrinho está vazio
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Você ainda não adicionou nenhum item do nosso cardápio.
            </p>
            <Button className="mt-6">
              <Link href="/home">Ver cardápio</Link>
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
    </main>
  );
}
