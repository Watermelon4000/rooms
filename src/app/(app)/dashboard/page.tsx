import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Room } from "@/lib/types";
import { RoomSettingsForm } from "@/components/room/room-settings-form";

type PublicRoom = Room & { owner_name: string | null };

export default async function Dashboard() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/dashboard");
  }

  const { data: myRoom } = await supabase
    .from("rooms")
    .select("*")
    .eq("owner", user.id)
    .maybeSingle();

  const { data: publicRoomsData } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .limit(9);

  const publicRoomsRaw = publicRoomsData ?? [];

  const ownerIds = [
    ...new Set(publicRoomsRaw.map((room) => room.owner).filter(Boolean)),
  ];

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

  const publicRooms: PublicRoom[] = publicRoomsRaw.map((room) => ({
    ...room,
    owner_name: profileMap.get(room.owner) ?? null,
  }));

  const formatDate = (value?: string | null) => {
    if (!value) return "暂无记录";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "暂无记录";
    }
    return date.toLocaleDateString();
  };

  const summaryTiles = [
    {
      label: "公开房间",
      value: publicRooms.length,
      helper: "最近更新数量",
    },
    {
      label: "房间网格",
      value: myRoom ? `${myRoom.grid_size} × ${myRoom.grid_size}` : "未创建",
      helper: myRoom ? "当前尺寸" : "创建后可配置",
    },
    {
      label: "可见性",
      value: myRoom ? (myRoom.is_public ? "公开" : "私密") : "未设置",
      helper: myRoom ? "可随时切换" : "创建房间后可配置",
    },
    {
      label: "编辑器状态",
      value: myRoom ? "就绪" : "待创建",
      helper: myRoom ? "随时可进入编辑器" : "先创建房间",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border bg-gradient-to-br from-primary/5 via-background to-background p-8 shadow-lg">
          <h1 className="text-3xl font-semibold tracking-tight">房间总览</h1>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border bg-background/80 p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">我的状态</p>
              <p className="mt-2 text-2xl font-semibold">{myRoom ? myRoom.title : "尚未创建房间"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {myRoom ? `最后更新：${formatDate(myRoom.updated_at)}` : "点击按钮，自动为你创建房间"}
              </p>
              {myRoom ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link href={`/editor/${myRoom.id}`}>打开编辑器</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/room/${myRoom.id}`}>查看游玩页</Link>
                  </Button>
                </div>
              ) : null}
            </div>
            <div className="rounded-2xl border bg-card p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">房间设置</p>
              {myRoom ? (
                <RoomSettingsForm
                  roomId={myRoom.id}
                  initialTitle={myRoom.title ?? "未命名房间"}
                  initialGridSize={myRoom.grid_size}
                  initialPublic={myRoom.is_public}
                />
              ) : (
                <p className="text-sm text-muted-foreground">创建房间后即可自定义名称、尺寸与可见性。</p>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {summaryTiles.map((tile) => (
            <Card key={tile.label} className="border bg-card/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardDescription className="uppercase text-xs tracking-widest">{tile.label}</CardDescription>
                <CardTitle className="text-2xl">{tile.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tile.helper}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">公开房间目录</h2>
            <p className="text-sm text-muted-foreground">精选最近 9 个公开房间，点击查看布局与互动。</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/rooms">全部房间</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {publicRooms.map((room) => (
            <Link
              key={room.id}
              href={`/room/${room.id}`}
              className="rounded-2xl border bg-card/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{room.title}</p>
                <span className="rounded-full border bg-background/70 px-2 py-1 text-xs text-muted-foreground">
                  {room.is_public ? "公开" : "私密"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">by {room.owner_name ?? "匿名房主"}</p>
              <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                <span>{room.grid_size}×{room.grid_size}</span>
                <span>更新 {formatDate(room.updated_at)}</span>
              </div>
            </Link>
          ))}
          {publicRooms.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              暂无公开房间，快去创建第一个吧！
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
