"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  CategoryNavigation,
  HeroBanner,
  ProductGrid,
  ProductSkeletons,
} from "@/components/home";
import { CartSummary, MobileCartBar } from "@/components/cart";
import { StoreFooter, StoreHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductQuantities } from "@/hooks/useProductQuantities";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/product";
import { ALL, FEATURED_LIMIT, getProductCategory, normalize } from "@/components/home/home-utils";

export default function Home() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useProducts();
  const { cart, addToCart } = useCart();
  const { getSelectedQuantity, incrementQuantity, decrementQuantity } =
    useProductQuantities();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [addedId, setAddedId] = useState<Product["id"] | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const allProducts = useMemo<Product[]>(
    () => data?.products ?? [],
    [data?.products],
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((product) => {
      const name = getProductCategory(product);
      if (name) set.add(name);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [allProducts]);

  const stockById = useMemo(
    () => new Map(allProducts.map((product) => [product.id, product.quantity])),
    [allProducts],
  );

  const filteredProducts = useMemo(() => {
    const term = normalize(search.trim());
    return allProducts.filter((product) => {
      const matchesSearch = normalize(product.name).includes(term);
      const matchesCategory =
        category === ALL || getProductCategory(product) === category;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, search, category]);

  const featuredProducts = useMemo(
    () =>
      allProducts
        .filter((product) => product.quantity > 0 && product.imageUrl)
        .slice(0, FEATURED_LIMIT),
    [allProducts],
  );

  const total = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0,
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const handleAddToCart = (product: Product) => {
    const qty = getSelectedQuantity(product.id);
    addToCart({ ...product, quantity: qty });

    setAddedId(product.id);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAddedId(null), 1500);
  };

  const gridProps = {
    getSelectedQuantity,
    incrementQuantity,
    decrementQuantity,
    addedId,
    onAdd: handleAddToCart,
  };

  const showFeatured =
    !isLoading && !isError && featuredProducts.length > 0 && !search;

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0">
      <StoreHeader search={search} onSearchChange={setSearch} />
      <HeroBanner />
      <CategoryNavigation
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="min-w-0 space-y-12">
          {/* Destaques */}
          {showFeatured && (
            <section id="destaques" className="scroll-mt-28">
              <div className="mb-5">
                <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  Escolhidos para você
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Uma seleção de produtos disponíveis agora.
                </p>
              </div>
              <ProductGrid products={featuredProducts} {...gridProps} />
            </section>
          )}

          {/* Todos os produtos */}
          <section id="produtos" className="scroll-mt-28">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  Todos os produtos
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category === ALL
                    ? "Todo o cardápio da casa em um só lugar."
                    : `Mostrando: ${category}`}
                </p>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar produto"
                  aria-label="Buscar produto no catálogo"
                  className="h-11 rounded-full pl-11"
                />
              </div>
            </div>

            {isLoading && <ProductSkeletons />}

            {isError && (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
                <span>Não foi possível carregar os produtos.</span>
                <Button variant="outline" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
              </div>
            )}

            {!isLoading && !isError && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-14 text-center">
                <Search className="size-8 text-muted-foreground" />
                <p className="font-medium">Nenhum produto encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Tente outro nome ou limpe os filtros.
                </p>
                {(search || category !== ALL) && (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setSearch("");
                      setCategory(ALL);
                    }}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}

            {!isLoading && !isError && filteredProducts.length > 0 && (
              <ProductGrid products={filteredProducts} {...gridProps} />
            )}
          </section>
        </div>

        {/* Carrinho (desktop) */}
        <aside className="hidden lg:block" aria-label="Resumo do pedido">
          <CartSummary
            stockById={stockById}
            onContinue={() => router.push("/carrinho")}
          />
        </aside>
      </div>

      <StoreFooter />

      {/* Carrinho (mobile) */}
      <MobileCartBar
        itemCount={itemCount}
        total={total}
        onOpen={() => router.push("/carrinho")}
      />
    </main>
  );
}
