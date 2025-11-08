"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Compass, Home, LayoutDashboard, Menu } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type UserSummary = {
  id: string;
  email?: string;
  username?: string | null;
};

type SidebarProps = {
  user?: UserSummary | null;
};

const navigation = [
  { label: "控制台", href: "/dashboard", icon: LayoutDashboard },
  { label: "公共房间", href: "/rooms", icon: Compass },
  { label: "我的房间", href: "/my-room", icon: Home },
];

const secondaryNavigation: Array<{ label: string; href: string; icon: typeof LayoutDashboard }> = [];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const width = isDesktop ? (collapsed ? "80px" : "288px") : "0px";
    document.documentElement.style.setProperty("--sidebar-width", width);
    return () => {
      document.documentElement.style.removeProperty("--sidebar-width");
    };
  }, [collapsed, isDesktop]);
  const isActive = (href: string) => {
    if (href === "/my-room") {
      return pathname === "/my-room" || pathname.startsWith("/editor");
    }
    if (href === "/rooms") {
      return pathname === "/rooms" || pathname.startsWith("/room/");
    }
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href;
  };

  const NavItem = ({ label, href, icon: Icon }: (typeof navigation)[number]) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition",
            isActive(href)
              ? "bg-secondary text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
            collapsed && "justify-center px-2",
          )}
          onClick={() => setMobileOpen(false)}
        >
          <Icon className={cn(collapsed ? "h-4 w-4" : "h-5 w-5", !collapsed && "mr-3")} />
          {!collapsed && <span>{label}</span>}
        </Link>
      </TooltipTrigger>
      {collapsed ? <TooltipContent side="right">{label}</TooltipContent> : null}
    </Tooltip>
  );

  const Container = (
    <div
      className={cn(
        "fixed inset-y-0 z-40 flex min-h-screen flex-col border-r bg-card/95 p-4 shadow-lg backdrop-blur transition-all lg:fixed lg:inset-y-0",
        collapsed ? "w-[80px]" : "w-72",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed ? (
          <Link href="/" className="text-2xl font-semibold tracking-tight transition">
            ROOMS
          </Link>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", collapsed && "mx-auto")}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          <span className="sr-only">{collapsed ? "展开侧边栏" : "折叠侧边栏"}</span>
        </Button>
      </div>
      <div className="mt-8 flex-1 overflow-y-auto pb-6">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
        {secondaryNavigation.length ? (
          <div className="space-y-2 border-t pt-4">
            {secondaryNavigation.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        ) : null}
      </div>
      {!collapsed ? (
        <div className="rounded-xl border bg-muted/30 p-4">
          {user ? (
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{user.username ?? user.email ?? "已登录"}</p>
              <p className="text-muted-foreground text-xs">{user.email}</p>
              <div className="pt-2">
                <SignOutButton />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full" size="sm">
                <Link href="/sign-in">登录</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/sign-up">注册</Link>
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed left-4 top-4 z-50 rounded-md border bg-background/80 p-2 shadow"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">切换侧边栏</span>
      </button>
      {Container}
    </>
  );
}
