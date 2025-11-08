"use client"

import type { ItemCatalogEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ItemPaletteProps = {
  items: ItemCatalogEntry[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export function ItemPalette({
  items,
  selectedId,
  onSelect,
}: ItemPaletteProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          物件
        </h3>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onSelect(null)}
        >
          取消
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              onSelect(selectedId === item.id ? null : item.id)
            }
            className={cn(
              "flex h-16 items-center justify-center rounded-lg border text-2xl shadow-sm transition hover:bg-zinc-50 dark:hover:bg-zinc-900/60",
              selectedId === item.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-border"
            )}
          >
            <span>{item.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
