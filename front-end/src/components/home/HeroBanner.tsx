"use client";

import { Beer, GlassWater, Martini, Truck, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "./home-utils";

export function HeroBanner() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-foreground text-background">
      <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:py-16">
        <div>
          <h1
            id="hero-title"
            className="font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Sua bebida gelada, do Senzalas até a sua porta.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/70 sm:text-lg">
            Monte o pedido em poucos toques: cervejas, vinhos, destilados e
            muito mais, prontos para pedir.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-12 rounded-full px-7 text-base shadow-lg shadow-primary/30 transition-transform hover:scale-[1.03] active:scale-95"
              onClick={() => scrollToSection("produtos")}>
              Ver cardápio
            </Button>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Truck className="size-4 text-primary" />
              Peça pelo site e receba em casa
            </div>
          </div>
        </div>

        {/* Composição visual com ícones, sem depender de imagens externas */}
        <div
          aria-hidden="true"
          className="relative mx-auto hidden h-56 w-full max-w-sm sm:block lg:h-64">
          <div className="absolute left-4 top-6 flex size-28 rotate-[-8deg] items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-xl">
            <Beer className="size-14" />
          </div>
          <div className="absolute right-6 top-0 flex size-24 rotate-6 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <Wine className="size-11 text-primary" />
          </div>
          <div className="absolute bottom-2 left-24 flex size-24 rotate-3 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <Martini className="size-11 text-primary" />
          </div>
          <div className="absolute bottom-6 right-4 flex size-20 rotate-[-4deg] items-center justify-center rounded-3xl bg-white/5 ring-1 ring-white/15">
            <GlassWater className="size-9 text-white/70" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Categorias                                                                 */
/* -------------------------------------------------------------------------- */
