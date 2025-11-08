"use client"

import { useState } from "react";
import type { TileWithItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InspectPanelProps = {
  tile?: TileWithItem;
  className?: string;
  onSave?: (meta: Record<string, unknown>) => Promise<void> | void;
  onRemove?: () => Promise<void> | void;
  onClose?: () => void;
  busy?: boolean;
};

export function InspectPanel({
  tile,
  className,
  onSave,
  onRemove,
  onClose,
  busy,
}: InspectPanelProps) {
  const [title, setTitle] = useState(
    (tile?.meta?.title as string | undefined) ?? ""
  );
  const [description, setDescription] = useState(
    (tile?.meta?.description as string | undefined) ?? ""
  );
  const [link, setLink] = useState(
    (tile?.meta?.link as string | undefined) ?? ""
  );

  if (!tile) return null;

  const handleSave = () => {
    onSave?.({
      title: title || undefined,
      description: description || undefined,
      link: link || undefined,
    });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white/80 p-4 shadow-lg dark:bg-zinc-900/70",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            选择格子
          </p>
          <p className="text-lg font-semibold">
            ({tile.x}, {tile.y}) · {tile.item?.label ?? tile.item_id}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          关闭
        </Button>
      </div>
      <div className="mt-4 space-y-3">
        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">
            标题
          </span>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例如：欢迎来到客厅"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">
            描述
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-24 w-full rounded-md border border-border bg-transparent p-3 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-transparent"
            placeholder="告诉访客这个物件的故事..."
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">
            链接
          </span>
          <Input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://example.com"
          />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={busy}
          onClick={handleSave}
          className="flex-1"
        >
          保存
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={onRemove}
        >
          删除
        </Button>
      </div>
    </div>
  );
}
