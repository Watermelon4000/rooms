import { notFound, redirect } from "next/navigation";
import { RoomClient } from "./room-client";
import { createServerSupabaseClient } from "@/lib/supabase-server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoomPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !room) {
    notFound();
  }

  if (!room.is_public && room.owner !== user?.id) {
    redirect("/dashboard");
  }

  const { data: tiles = [] } = await supabase
    .from("room_tiles")
    .select("*")
    .eq("room_id", room.id);

  const { data: catalog = [] } = await supabase
    .from("item_catalog")
    .select("*")
    .order("label");

  let username: string | null = user?.email ?? null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();
    username = profile?.username ?? username;
  }

  const viewer = user
    ? {
        id: user.id,
        username,
      }
    : null;

  return (
    <RoomClient
      room={room}
      catalog={catalog}
      initialTiles={tiles}
      viewer={viewer}
    />
  );
}
