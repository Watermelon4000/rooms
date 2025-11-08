"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_GRID_SIZE, TILE_SIZE } from "@/lib/types";

const STEP_INTERVAL = 90;

export type PlayerPosition = { x: number; y: number };

type PlayerProps = {
  gridSize?: number;
  tileSize?: number;
  solids: Set<string>;
  avatar?: string;
  spawn?: PlayerPosition;
  color?: string;
  onInteract?: (coord: PlayerPosition) => void;
  onPositionChange?: (pos: PlayerPosition) => void;
};

export function Player({
  gridSize = DEFAULT_GRID_SIZE,
  tileSize = TILE_SIZE,
  solids,
  avatar = "🧑‍🚀",
  spawn = { x: 0, y: 0 },
  color = "#2563eb",
  onInteract,
  onPositionChange,
}: PlayerProps) {
  const [position, setPosition] = useState<PlayerPosition>(spawn);
  const busy = useRef(false);

  useEffect(() => {
    onPositionChange?.(position);
  }, [position, onPositionChange]);

  const clamp = useCallback(
    (value: number) => Math.max(0, Math.min(gridSize - 1, value)),
    [gridSize]
  );

  const move = useCallback(
    (dx: number, dy: number) => {
      setPosition((prev) => {
        const next = { x: clamp(prev.x + dx), y: clamp(prev.y + dy) };
        if (solids.has(`${next.x},${next.y}`)) return prev;
        return next;
      });
    },
    [clamp, solids]
  );

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (busy.current) return;
      let dx = 0;
      let dy = 0;
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") dy -= 1;
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") dy += 1;
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") dx -= 1;
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") dx += 1;

      if (dx !== 0 || dy !== 0) {
        event.preventDefault();
        busy.current = true;
        move(dx, dy);
        window.setTimeout(() => {
          busy.current = false;
        }, STEP_INTERVAL);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        onInteract?.(position);
      }
    },
    [move, onInteract, position]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const style = useMemo(
    () => ({
      transform: `translate(${position.x * tileSize}px, ${
        position.y * tileSize
      }px)`,
      width: tileSize,
      height: tileSize,
    }),
    [position.x, position.y, tileSize]
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute flex items-center justify-center text-2xl transition-transform"
        style={style}
      >
        <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">{avatar}</span>
        <span
          className="absolute -bottom-1 h-1.5 w-5 rounded-full opacity-60 blur-sm"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}
