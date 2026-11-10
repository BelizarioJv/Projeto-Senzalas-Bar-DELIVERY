import {
  Beer,
  CupSoda,
  GlassWater,
  Martini,
  Tag,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Product } from "@/types/product";

export const ALL = "__all__";
export const FEATURED_LIMIT = 4;

/**
 * ATENÇÃO: ajuste esta função ao formato real da API.
 * Eu não tinha o tipo `Product` completo, então ela lê `category`
 * (string ou objeto com `name`) de forma defensiva. Se a sua API usa outro
 * campo (ex.: `categoryName`, `type`), troque apenas aqui.
 */
export function getProductCategory(product: Product): string | null {
  const raw = (product as unknown as { category?: unknown }).category;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (raw && typeof raw === "object" && "name" in raw) {
    const name = (raw as { name?: unknown }).name;
    if (typeof name === "string" && name.trim()) return name.trim();
  }
  return null;
}

export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Ícone puramente decorativo, escolhido pelo nome da categoria.
export function getCategoryIcon(name: string): LucideIcon {
  const n = normalize(name);
  if (n.includes("cerveja")) return Beer;
  if (n.includes("vinho")) return Wine;
  if (n.includes("destilado") || n.includes("drink")) return Martini;
  if (n.includes("refri")) return CupSoda;
  if (n.includes("suco") || n.includes("agua")) return GlassWater;
  return Tag;
}

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
