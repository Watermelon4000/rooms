import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function MyRoomPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/my-room");
  }

  const { data: existing } = await supabase
    .from("rooms")
    .select("id")
    .eq("owner", user.id)
    .maybeSingle();

  if (existing) {
    redirect(`/editor/${existing.id}`);
  }

  const { data: created, error } = await supabase
    .from("rooms")
    .insert({ owner: user.id })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "创建房间失败");
  }

  redirect(`/editor/${created.id}`);
}
