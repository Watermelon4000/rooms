"use client"

import { useEffect, useMemo, useRef, useState, useId } from "react";
import type {
  ItemCatalogEntry,
  Room,
  RoomTile,
  TileWithItem,
} from "@/lib/types";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { RoomGrid } from "@/components/room/RoomGrid";
import { Player, type PlayerPosition } from "@/components/room/Player";
import {
  PresenceLayer,
  type RemotePlayer,
} from "@/components/room/PresenceLayer";
import { TILE_SIZE } from "@/lib/types";

type Viewer = {
  id: string;
  username?: string | null;
};

type RoomClientProps = {
  room: Room;
  catalog: ItemCatalogEntry[];
  initialTiles: RoomTile[];
  viewer: Viewer | null;
};

type InspectState = TileWithItem & { meta: Record<string, unknown> };

export function RoomClient({
  room,
  catalog,
  initialTiles,
  viewer,
}: RoomClientProps) {
  const [tiles, setTiles] = useState(() => attachItems(initialTiles, catalog));
  const [inspectTile, setInspectTile] = useState<InspectState | null>(null);
  const [peers, setPeers] = useState<RemotePlayer[]>([]);
  const presenceRef = useRef<ReturnType<
    ReturnType<typeof getBrowserSupabaseClient>["channel"]
  > | null>(null);

  const guestId = useId().replace(/:/g, "");
  const presenceKey = viewer?.id ?? `guest-${guestId}`;

  const accentColor = useMemo(
    () => pickColor(presenceKey),
    [presenceKey]
  );
  const avatar = useMemo(() => pickAvatar(presenceKey), [presenceKey]);

  useEffect(() => {
    setTiles(attachItems(initialTiles, catalog));
  }, [initialTiles, catalog]);

  // Postgres realtime for tiles
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
                (tile) =>
                  !(
                    tile.x === payload.old.x &&
                    tile.y === payload.old.y &&
                    tile.room_id === payload.old.room_id
                  )
              );
            }
            const updated = {
              ...payload.new,
              meta: payload.new.meta ?? {},
            } as RoomTile;
            const withItem: TileWithItem = {
              ...updated,
              item: catalog.find((it) => it.id === updated.item_id),
            };
            const others = current.filter(
              (tile) => !(tile.x === updated.x && tile.y === updated.y)
            );
            return [...others, withItem];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room.id, catalog]);

  // Presence channel
  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    const channel = supabase.channel(`presence:${room.id}`, {
      config: { presence: { key: presenceKey } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState() as Record<
          string,
          RemotePlayer[]
        >;
        const flattened = Object.entries(state).flatMap(([key, value]) =>
          value.map((entry) => ({
            ...entry,
            id: key,
          }))
        );
        setPeers(flattened);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            username: viewer?.username ?? "访客",
            color: accentColor,
            avatar,
            x: 0,
            y: 0,
          });
        }
      });

    presenceRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [room.id, viewer?.username, accentColor, avatar, presenceKey]);

  const solids = useMemo(
    () =>
      new Set(
        tiles
          .filter((tile) => tile.item?.solid)
          .map((tile) => `${tile.x},${tile.y}`)
      ),
    [tiles]
  );

  const handleInspect = (coord: PlayerPosition) => {
    const neighbours = [
      { x: coord.x, y: coord.y },
      { x: coord.x + 1, y: coord.y },
      { x: coord.x - 1, y: coord.y },
      { x: coord.x, y: coord.y + 1 },
      { x: coord.x, y: coord.y - 1 },
    ];
    for (const cell of neighbours) {
      const tile = tiles.find((t) => t.x === cell.x && t.y === cell.y);
      if (tile) {
        setInspectTile(tile as InspectState);
        return;
      }
    }
  };

  const handleTileClick = (
    coord: { x: number; y: number },
    tile?: TileWithItem
  ) => {
    if (tile) setInspectTile(tile);
  };

  const filteredPeers = peers.filter((peer) => peer.id !== presenceKey);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 rounded-3xl border bg-white/80 p-6 shadow-xl dark:bg-zinc-950/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">房间</p>
            <h1 className="text-2xl font-semibold">{room.title}</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            网格：{room.grid_size} × {room.grid_size}
          </p>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="overflow-auto rounded-2xl border bg-zinc-50 p-4 dark:bg-zinc-900/70">
            <div
              className="relative inline-block"
              style={{
                width: room.grid_size * TILE_SIZE,
                height: room.grid_size * TILE_SIZE,
              }}
            >
              <RoomGrid
                tiles={tiles}
                gridSize={room.grid_size}
                tileSize={TILE_SIZE}
                onTileClick={handleTileClick}
              />
              <Player
                solids={solids}
                gridSize={room.grid_size}
                tileSize={TILE_SIZE}
                onInteract={handleInspect}
                onPositionChange={(pos) => {
                  presenceRef.current?.track({
                    username: viewer?.username ?? "访客",
                    color: accentColor,
                    avatar,
                    x: pos.x,
                    y: pos.y,
                  });
                }}
              />
              <PresenceLayer players={filteredPeers} tileSize={TILE_SIZE} />
            </div>
          </div>
          <div className="rounded-2xl border bg-white/90 p-4 text-sm text-muted-foreground shadow-sm dark:bg-zinc-900/70 lg:w-64 lg:shrink-0">
            <p className="text-base font-semibold text-foreground">
              操作说明
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">WASD</span>
                <span>或方向键控制角色移动</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">Enter</span>
                <span>与正面/邻近的物件互动</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground">点击格子</span>
                <span>查看该物件的详细信息</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {inspectTile ? (
        <div className="rounded-3xl border bg-white/90 p-5 shadow-lg dark:bg-zinc-900/80">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">物件</p>
              <p className="text-lg font-semibold">
                {inspectTile.item?.label ?? inspectTile.item_id} · (
                {inspectTile.x}, {inspectTile.y})
              </p>
            </div>
            <button
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={() => setInspectTile(null)}
            >
              关闭
            </button>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            {Object.entries(inspectTile.meta ?? {}).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <dt className="w-20 text-muted-foreground">{key}</dt>
                <dd className="flex-1 break-all">
                  {typeof value === "string"
                    ? value
                    : JSON.stringify(value ?? "")}
                </dd>
              </div>
            ))}
            {!inspectTile.meta ||
            Object.keys(inspectTile.meta ?? {}).length === 0 ? (
              <p className="text-muted-foreground">暂无描述，按 Enter 互动。</p>
            ) : null}
          </dl>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed p-6 text-sm text-muted-foreground">
          点击任意格子或按 Enter 贴近物件，即可查看它的说明。
        </div>
      )}
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

const colors = [
  "#2563eb",
  "#db2777",
  "#f97316",
  "#0ea5e9",
  "#10b981",
  "#a855f7",
  "#facc15",
  "#ec4899",
];

const avatars = ["🧑‍🚀", "🧝‍♀️", "🧙‍♂️", "🧚", "🧟", "🐱", "🐸", "🐼"];

function pickColor(seed: string) {
  const index = hash(seed) % colors.length;
  return colors[index];
}

function pickAvatar(seed: string) {
  const index = hash(seed) % avatars.length;
  return avatars[index];
}

function hash(value: string) {
  return value
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
}
