"use client"

import { useEffect, useMemo, useState } from "react";
import type {
  ItemCatalogEntry,
  Room,
  RoomTile,
  TileOperation,
  TileWithItem,
} from "@/lib/types";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { RoomGrid } from "@/components/room/RoomGrid";
import { ItemPalette } from "@/components/room/ItemPalette";
import { InspectPanel } from "@/components/room/InspectPanel";
import { useEditorStore } from "@/lib/store";
import { toast } from "sonner";
import { TILE_SIZE } from "@/lib/types";

type EditorClientProps = {
  room: Room;
  catalog: ItemCatalogEntry[];
  initialTiles: RoomTile[];
};

export function EditorClient({
  room,
  catalog,
  initialTiles,
}: EditorClientProps) {
  const [tiles, setTiles] = useState(() => attachItems(initialTiles, catalog));
  const [saving, setSaving] = useState(false);
  const { selectedItemId, setSelectedItemId, inspectorTile, setInspectorTile } =
    useEditorStore();

  useEffect(() => {
    setTiles(attachItems(initialTiles, catalog));
  }, [initialTiles, catalog]);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    const channel = supabase
      .channel(`room:${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_tiles",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          setTiles((current) => {
            if (payload.eventType === "DELETE") {
              return current.filter(
                (tile) => !(tile.x === payload.old.x && tile.y === payload.old.y)
              );
            }
            const updated: TileWithItem = {
              ...(payload.new as RoomTile),
              meta: payload.new.meta ?? {},
              item: catalog.find((item) => item.id === payload.new.item_id),
            };
            const other = current.filter(
              (tile) => !(tile.x === updated.x && tile.y === updated.y)
            );
            return [...other, updated];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room.id, catalog]);

  const highlight = inspectorTile;

  const handleTileClick = (
    coord: { x: number; y: number },
    tile?: TileWithItem
  ) => {
    if (selectedItemId) {
      applyOps([
        {
          x: coord.x,
          y: coord.y,
          itemId: selectedItemId,
          meta: tile?.meta ?? {},
        },
      ]);
      return;
    }
    if (tile) {
      setInspectorTile({ x: tile.x, y: tile.y });
    } else {
      setInspectorTile(null);
    }
  };

  const handleRightClick = (coord: { x: number; y: number }, tile?: TileWithItem) => {
    if (!tile) return;
    applyOps([{ x: coord.x, y: coord.y, remove: true }]);
  };

  const applyOps = async (ops: TileOperation[]) => {
    setSaving(true);
    const response = await fetch("/api/tiles/upsert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: room.id, ops }),
    });
    setSaving(false);
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.error ?? "更新失败");
      return;
    }
    toast.success("已保存");
    setTiles((current) => applyLocal(current, ops, catalog, room.id));
  };

  const currentInspectorTile = useMemo(() => {
    if (!inspectorTile) return null;
    return tiles.find(
      (tile) => tile.x === inspectorTile.x && tile.y === inspectorTile.y
    );
  }, [inspectorTile, tiles]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">编辑器</p>
        <h1 className="text-3xl font-semibold">{room.title}</h1>
        <p className="text-sm text-muted-foreground">
          当前网格 {room.grid_size}×{room.grid_size} ·
          {selectedItemId
            ? ` 正在放置 ${selectedItemId}`
            : " 点击任意格子以选中物件"}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <section className="rounded-2xl border bg-white/70 p-4 dark:bg-zinc-900/70">
          <ItemPalette
            items={catalog}
            selectedId={selectedItemId}
            onSelect={setSelectedItemId}
          />
        </section>

        <section className="rounded-2xl border bg-white/80 p-4 shadow-inner dark:bg-zinc-950/70">
          <div className="overflow-auto rounded-xl border">
            <div className="relative inline-block">
              <RoomGrid
                tiles={tiles}
                gridSize={room.grid_size}
                tileSize={TILE_SIZE}
                highlight={highlight}
                onTileClick={handleTileClick}
                onTileContextMenu={handleRightClick}
              />
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm dark:bg-zinc-900/80">
                {room.grid_size}×{room.grid_size}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            左键放置 / 选中 · 右键删除 · 网格始终为 {room.grid_size}×
            {room.grid_size}
          </p>
        </section>

        <section className="rounded-2xl border bg-white/80 p-4 dark:bg-zinc-900/70">
          <p className="text-sm font-semibold">属性面板</p>
          <p className="text-xs text-muted-foreground">
            {saving ? "保存中..." : "实时保存"}
          </p>
          <div className="mt-4">
            <InspectPanel
              key={
                currentInspectorTile
                  ? `${currentInspectorTile.x}-${currentInspectorTile.y}`
                  : "empty"
              }
              tile={currentInspectorTile ?? undefined}
              busy={saving}
              onClose={() => setInspectorTile(null)}
              onRemove={
                currentInspectorTile
                  ? () =>
                      applyOps([
                        {
                          x: currentInspectorTile.x,
                          y: currentInspectorTile.y,
                          remove: true,
                        },
                      ])
                  : undefined
              }
              onSave={(meta) =>
                currentInspectorTile
                  ? applyOps([
                      {
                        x: currentInspectorTile.x,
                        y: currentInspectorTile.y,
                        itemId: currentInspectorTile.item_id,
                        meta,
                      },
                    ])
                  : undefined
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function attachItems(tiles: RoomTile[], catalog: ItemCatalogEntry[]) {
  const map = new Map(catalog.map((item) => [item.id, item]));
  return tiles.map((tile) => ({
    ...tile,
    meta: tile.meta ?? {},
    item: map.get(tile.item_id),
  }));
}

function applyLocal(
  tiles: TileWithItem[],
  ops: TileOperation[],
  catalog: ItemCatalogEntry[],
  roomId: string
) {
  let next = [...tiles];
  for (const op of ops) {
    if ("remove" in op) {
      next = next.filter((tile) => !(tile.x === op.x && tile.y === op.y));
      continue;
    }
    const item = catalog.find((entry) => entry.id === op.itemId);
    const tile = {
      room_id: roomId,
      x: op.x,
      y: op.y,
      item_id: op.itemId,
      meta: op.meta ?? {},
      item,
    } satisfies TileWithItem;
    next = next.filter((entry) => !(entry.x === op.x && entry.y === op.y));
    next.push(tile);
  }
  return next;
}
