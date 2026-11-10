"use client";

import { currency } from "@/utils/currency";

type MobileCartBarProps = {
  itemCount: number;
  total: number;
  onOpen: () => void;
};

export function MobileCartBar({ itemCount, total, onOpen }: MobileCartBarProps) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-in slide-in-from-bottom-4 border-t bg-background/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] backdrop-blur duration-300 lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        className="flex h-14 w-full items-center justify-between rounded-full bg-primary px-5 text-primary-foreground transition-transform active:scale-[0.98]">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-full bg-background/20 text-xs">
            {itemCount}
          </span>
          Ver carrinho
        </span>
        <span className="text-base font-bold">{currency.format(total)}</span>
      </button>
    </div>
  );
}
