import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createRouteHandlerSupabaseClient();
  const payload = await request.json();
  const event = payload.event;
  const session = payload.session;

  if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
    await supabase.auth.setSession(session);
  }

  if (event === "SIGNED_OUT") {
    await supabase.auth.signOut();
  }

  return NextResponse.json({ received: true });
}
