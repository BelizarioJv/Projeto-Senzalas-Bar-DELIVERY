"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { storeNavigationLinks } from "./store-navigation";

type StoreHeaderProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
};

export function StoreHeader({ search, onSearchChange }: StoreHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const showSearch = search !== undefined && onSearchChange !== undefined;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-foreground text-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-6 lg:px-8">
        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 md:hidden">
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link href="/home" className="shrink-0" aria-label="SenzalasBar - início">
          <Image
            src="/LogoSenzalasBar.png"
            alt="SenzalasBar"
            width={140}
            height={41}
            priority
            className="h-9 w-auto lg:h-10"
          />
        </Link>

        {showSearch && (
          <div className="relative hidden flex-1 md:block md:max-w-xl">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/50" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              onFocus={() => {
                document.getElementById("produtos")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              placeholder="Buscar cerveja, vinho, destilado..."
              aria-label="Buscar produto"
              className="h-11 rounded-full border-white/15 bg-white/10 pl-11 text-background placeholder:text-white/50 focus-visible:bg-white/15"
            />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-1.5 text-sm text-white/70 xl:flex">
            <MapPin className="size-4 text-primary" />
            <span>Entrega em Santa Luzia e região</span>
          </div>

          <Link
            href="/carrinho"
            aria-label={`Carrinho com ${itemCount} item(ns)`}
            className="relative flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95">
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span
                key={itemCount}
                className="absolute -right-1 -top-1 flex min-w-5 animate-in zoom-in-50 items-center justify-center rounded-full bg-background px-1 text-[11px] font-bold text-foreground duration-200">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {showSearch && (
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/50" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              onFocus={() => {
                document.getElementById("produtos")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              placeholder="Buscar produto"
              aria-label="Buscar produto"
              className="h-11 rounded-full border-white/15 bg-white/10 pl-11 text-background placeholder:text-white/50"
            />
          </div>
        </div>
      )}

      {menuOpen && (
        <nav
          aria-label="Navegação principal"
          className="animate-in slide-in-from-top-2 border-t border-white/10 bg-foreground px-4 py-2 duration-200 md:hidden">
          {storeNavigationLinks.map((link) => (
            <Link
              key={link.target}
              href={`/home#${link.target}`}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 w-full items-center text-left text-base text-white/90 transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
