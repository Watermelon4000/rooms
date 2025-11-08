"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

type UserSummary = {
  id: string;
  email?: string;
  username?: string | null;
};

type SidebarNavProps = {
  user?: UserSummary | null;
};

const navItems = [
  { label: "控制台", href: "/dashboard" },
  { label: "公共房间", href: "/rooms" },
  { label: "我的房间", href: "/my-room" },
];

export function SidebarNav({ user }: SidebarNavProps) {
  const pathname = usePathname() ?? "/";

  return (
    <aside className="w-full rounded-2xl border bg-white/90 p-4 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950/80 dark:ring-white/5 md:max-w-[240px]">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Rooms
        </p>
        <p className="text-lg font-semibold text-foreground">导览</p>
      </div>
      <nav className="mt-6 space-y-1">
        {navItems.map((item) => {
          const active = (() => {
            if (item.href === "/my-room") {
              return (
                pathname === "/my-room" ||
                pathname.startsWith("/editor")
              );
            }
            if (item.href === "/rooms") {
              return pathname === "/rooms" || pathname.startsWith("/room/");
            }
            if (item.href === "/dashboard") {
              return pathname === "/dashboard";
            }
            return pathname === item.href;
          })();
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border-t pt-4">
        {user ? (
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-foreground">
                {user.username ?? user.email ?? "已登录"}
              </p>
              <p className="text-muted-foreground">欢迎回来</p>
            </div>
            <SignOutButton />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/sign-in">登录</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">注册</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
