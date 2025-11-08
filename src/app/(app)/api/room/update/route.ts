import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase-server";

export async function PATCH(request: Request) {
  const supabase = await createRouteHandlerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { roomId, title, gridSize, isPublic } =
    (payload as {
      roomId?: string;
      title?: string;
      gridSize?: number;
      isPublic?: boolean;
    }) ?? {};

  if (!roomId) {
    return NextResponse.json({ error: "缺少 roomId" }, { status: 400 });
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "房间标题必填" }, { status: 400 });
  }

  if (
    typeof gridSize !== "number" ||
    Number.isNaN(gridSize) ||
    gridSize < 10 ||
    gridSize > 40
  ) {
    return NextResponse.json({ error: "网格大小需在 10-40 之间" }, { status: 400 });
  }

  if (typeof isPublic !== "boolean") {
    return NextResponse.json({ error: "缺少公开设置" }, { status: 400 });
  }

  const { data: room, error: fetchError } = await supabase
    .from("rooms")
    .select("id")
    .eq("id", roomId)
    .eq("owner", user.id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 400 });
  }

  if (!room) {
    return NextResponse.json({ error: "房间不存在" }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("rooms")
    .update({
      title: title.trim(),
      grid_size: gridSize,
      is_public: isPublic,
    })
    .eq("id", roomId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
