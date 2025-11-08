import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase-server";
import type { TileOperation } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createRouteHandlerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await request.json();
  const roomId = body.roomId as string | undefined;
  const rawOps = body.ops;

  if (!roomId || !Array.isArray(rawOps)) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  const { data: room } = await supabase
    .from("rooms")
    .select("id, owner, grid_size")
    .eq("id", roomId)
    .maybeSingle();

  if (!room) {
    return NextResponse.json({ error: "房间不存在" }, { status: 404 });
  }

  if (room.owner !== user.id) {
    return NextResponse.json({ error: "无权操作" }, { status: 403 });
  }

  const normalized = normalizeOps(rawOps, room.grid_size);
  if (normalized.length === 0) {
    return NextResponse.json({ success: true });
  }

  const upserts = normalized.filter(
    (op): op is Extract<TileOperation, { itemId: string }> =>
      "itemId" in op && typeof op.itemId === "string"
  );
  const removals = normalized.filter((op) => "remove" in op && op.remove);

  if (upserts.length) {
    const payload = upserts.map((op) => ({
      room_id: roomId,
      x: op.x,
      y: op.y,
      item_id: op.itemId,
      meta: op.meta ?? {},
    }));

    const { error } = await supabase.from("room_tiles").upsert(payload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  if (removals.length) {
    for (const op of removals) {
      const { error } = await supabase
        .from("room_tiles")
        .delete()
        .match({ room_id: roomId, x: op.x, y: op.y });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
  }

  return NextResponse.json({ success: true });
}

function normalizeOps(payload: unknown[], gridSize: number): TileOperation[] {
  const ops: TileOperation[] = [];
  for (const raw of payload) {
    if (typeof raw !== "object" || raw === null) continue;
    const x = Number((raw as Record<string, unknown>).x);
    const y = Number((raw as Record<string, unknown>).y);
    if (!Number.isInteger(x) || !Number.isInteger(y)) continue;
    if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) continue;

    if ("remove" in (raw as Record<string, unknown>)) {
      ops.push({ x, y, remove: true });
      continue;
    }

    const itemId = (raw as Record<string, unknown>).itemId;
    if (typeof itemId !== "string" || itemId.length === 0) continue;
    const meta = (raw as Record<string, unknown>).meta;
    ops.push({
      x,
      y,
      itemId,
      meta: isPojo(meta) ? (meta as Record<string, unknown>) : undefined,
    });
  }
  return ops;
}

function isPojo(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
