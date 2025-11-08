import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { EditorClient } from "./editor-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: PageProps) {
  const { id: routeId } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/dashboard");
  }

  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", routeId)
    .eq("owner", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`加载房间失败: ${error.message}`);
  }

  if (!room) {
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

  return <EditorClient room={room} catalog={catalog} initialTiles={tiles} />;
}
