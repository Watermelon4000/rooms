import type { ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();
    username = profile?.username ?? null;
  }

  const userSummary = user
    ? {
        id: user.id,
        email: user.email ?? undefined,
        username,
      }
    : null;

  return (
    <div className="flex min-h-screen bg-muted/10">
      <Sidebar user={userSummary} />
      <div className="flex flex-1 flex-col" style={{ marginLeft: "var(--sidebar-width, 0px)" }}>
        <TopNav user={userSummary} />
        <main className="flex-1 px-4 py-6 lg:px-10">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
