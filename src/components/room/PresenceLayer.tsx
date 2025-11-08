"use client"

import { memo } from "react";
import { TILE_SIZE } from "@/lib/types";

export type RemotePlayer = {
  id: string;
  username?: string | null;
  x: number;
  y: number;
  color: string;
  avatar: string;
};

type PresenceLayerProps = {
  players: RemotePlayer[];
  tileSize?: number;
};

function BasePresenceLayer({
  players,
  tileSize = TILE_SIZE,
}: PresenceLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {players.map((player) => (
        <div
          key={player.id}
          className="absolute flex flex-col items-center text-xl transition-transform"
          style={{
            transform: `translate(${player.x * tileSize}px, ${
              player.y * tileSize
            }px)`,
          }}
        >
          <span className="text-lg font-medium text-white drop-shadow">
            {player.avatar}
          </span>
          <span
            className="mt-1 rounded-full border border-white/30 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-700"
            style={{ color: player.color }}
          >
            {player.username ?? "访客"}
          </span>
        </div>
      ))}
    </div>
  );
}

export const PresenceLayer = memo(BasePresenceLayer);
