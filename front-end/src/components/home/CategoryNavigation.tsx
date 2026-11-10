"use client";

import { Tag } from "lucide-react";
import { getCategoryIcon, ALL, scrollToSection } from "./home-utils";

type CategoryNavigationProps = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

export function CategoryNavigation({
  categories,
  selected,
  onSelect,
}: CategoryNavigationProps) {
  if (categories.length === 0) return null;

  const items = [{ id: ALL, label: "Todos", Icon: Tag }].concat(
    categories.map((name) => ({
      id: name,
      label: name,
      Icon: getCategoryIcon(name),
    })),
  );

  return (
    <section
      id="categorias"
      aria-label="Categorias"
      className="scroll-mt-32 border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
        <div
          role="tablist"
          aria-label="Filtrar por categoria"
          className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
          {items.map(({ id, label, Icon }) => {
            const active = selected === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  onSelect(id);
                  scrollToSection("produtos");
                }}
                className={`flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all active:scale-95 ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"
                }`}>
                <Icon className="size-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Card de produto                                                            */
/* -------------------------------------------------------------------------- */
