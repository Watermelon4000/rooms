"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getBrowserSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type UserSummary = {
  id: string;
  email?: string;
  username?: string | null;
};

type TopNavProps = {
  user?: UserSummary | null;
};

export function TopNav({ user }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const segments = pathname.split("/").filter(Boolean);

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const initials = (user?.username ?? user?.email ?? "R")
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((str) => str[0]?.toUpperCase())
    .join("");

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const supabase = getBrowserSupabaseClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success("已退出登录");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "退出失败");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <nav className="hidden items-center text-sm font-medium text-muted-foreground lg:flex">
          <Link href="/" className="flex items-center gap-1 text-foreground">
            <Home className="h-4 w-4" />
            首页
          </Link>
          {segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            const label = segment === "dashboard" ? "控制台" : segment === "rooms" ? "公共房间" : segment === "my-room" ? "我的房间" : segment;
            return (
              <span key={href} className="flex items-center">
                <ChevronRight className="mx-2 h-4 w-4" />
                <Link href={href} className={cn("capitalize", index === segments.length - 1 && "text-foreground")}>
                  {label}
                </Link>
              </span>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                  <Avatar>
                    <AvatarFallback>{initials || "R"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem disabled className="flex-col items-start gap-1">
                  <span className="text-sm font-medium">{user.username ?? "房主"}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(event) => (event.preventDefault(), handleNavigate("/dashboard"))}>控制台</DropdownMenuItem>
                <DropdownMenuItem onSelect={(event) => (event.preventDefault(), handleNavigate("/my-room"))}>我的房间</DropdownMenuItem>
                <DropdownMenuItem onSelect={(event) => (event.preventDefault(), handleNavigate("/rooms"))}>公共房间</DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    handleSignOut();
                  }}
                >
                  {signingOut ? "正在退出..." : "退出登录"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">登录</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">注册</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
