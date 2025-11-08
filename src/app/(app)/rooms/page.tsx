import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function RoomsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: roomsData } = await supabase
    .from("rooms")
    .select("id, title, owner, grid_size, updated_at")
    .eq("is_public", true)
    .order("updated_at", { ascending: false });
  const rooms = roomsData ?? [];

  const ownerIds = [...new Set(rooms.map((room) => room.owner))];

  const profileMap = new Map<string, string | null>();
  if (ownerIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", ownerIds);
    if (profiles) {
      profiles.forEach((profile) =>
        profileMap.set(profile.id, profile.username ?? null)
      );
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">浏览</p>
        <h1 className="text-3xl font-semibold">公开房间</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          最新创建或更新的房间会展示在这里，点击即可进入游玩页面。
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Link
            key={room.id}
            href={`/room/${room.id}`}
            className="group rounded-2xl border bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:bg-zinc-950/70"
          >
            <p className="text-lg font-semibold">{room.title}</p>
            <p className="text-xs text-muted-foreground">
              by {profileMap.get(room.owner) ?? "匿名房主"}
            </p>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{room.grid_size}×{room.grid_size}</span>
              <span>
                {room.updated_at
                  ? new Date(room.updated_at).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </Link>
        ))}
        {rooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            暂无公开房间。创建一个房间并设置为公开即可在此展示。
          </div>
        ) : null}
      </div>
    </section>
  );
}
