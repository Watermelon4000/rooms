"use client"

import { memo, useMemo } from "react";
import { DEFAULT_GRID_SIZE, TILE_SIZE, type TileWithItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/material-icon";

export type RoomGridProps = {
  tiles: TileWithItem[];
  gridSize?: number;
  tileSize?: number;
  disabled?: boolean;
  highlight?: { x: number; y: number } | null;
  onTileClick?: (coord: { x: number; y: number }, tile?: TileWithItem) => void;
  onTileContextMenu?: (
    coord: { x: number; y: number },
    tile?: TileWithItem
  ) => void;
};

function BaseRoomGrid({
  tiles,
  gridSize = DEFAULT_GRID_SIZE,
  tileSize = TILE_SIZE,
  disabled,
  highlight,
  onTileClick,
  onTileContextMenu,
}: RoomGridProps) {
  const tileMap = useMemo(() => {
    const map = new Map<string, TileWithItem>();
    for (const tile of tiles) {
      map.set(`${tile.x},${tile.y}`, tile);
    }
    return map;
  }, [tiles]);

  const cells = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const key = `${x},${y}`;
      const tile = tileMap.get(key);
      const isHighlight = highlight?.x === x && highlight?.y === y;
      cells.push(
        <div
          key={key}
          data-x={x}
          data-y={y}
          aria-label={`tile-${x}-${y}`}
          onClick={() => {
            if (disabled) return;
            onTileClick?.({ x, y }, tile);
          }}
          onContextMenu={(event) => {
            if (disabled) return;
            if (!onTileContextMenu) return;
            event.preventDefault();
            onTileContextMenu({ x, y }, tile);
          }}
          className={cn(
            "border border-zinc-200/60 bg-gradient-to-br from-white to-zinc-50 text-base transition-colors dark:border-white/10 dark:from-zinc-900 dark:to-zinc-950",
            "flex items-center justify-center select-none",
            "hover:bg-zinc-100 dark:hover:bg-zinc-900/70",
            isHighlight &&
              "ring-2 ring-primary ring-offset-2 ring-offset-zinc-100 dark:ring-offset-zinc-900",
            disabled && "cursor-default opacity-70",
            !disabled && "cursor-pointer"
          )}
          style={{
            width: tileSize,
            height: tileSize,
          }}
        >
          {tile?.item ? (
            <MaterialIcon
              name={tile.item.icon}
              className="text-2xl text-foreground/80"
            />
          ) : tile ? (
            <span className="text-xs text-muted-foreground">
              {tile.item_id}
            </span>
          ) : null}
        </div>
      );
    }
  }

  return (
    <div
      className="grid bg-zinc-100 shadow-inner dark:bg-zinc-900"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(${tileSize}px, 1fr))`,
        width: gridSize * tileSize,
      }}
    >
      {cells}
    </div>
  );
}

export const RoomGrid = memo(BaseRoomGrid);
