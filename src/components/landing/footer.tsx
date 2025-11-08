"use client";

import Link from "next/link";

import { WaterShaderBackground } from "@/components/ui/water-shader-background";

export function LandingFooter() {
  const nav = [
    {
      title: "产品",
      links: [
        { href: "/dashboard", label: "控制台" },
        { href: "/rooms", label: "公共房间" },
      ],
    },
    {
      title: "社区",
      links: [
        { href: "https://pathunfold.com", label: "Pathunfold", external: true },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 opacity-20">
        <WaterShaderBackground />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-center sm:px-10">
        <div className="mb-12 text-center">
          <p className="instrument text-8xl font-light tracking-[-0.08em] text-muted-foreground md:text-9xl">
            rooms
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-left text-sm text-muted-foreground sm:grid-cols-4">
          {nav.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="font-medium text-foreground">{group.title}</p>
              <div className="space-y-2">
                {group.links.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block transition hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link key={item.label} href={item.href} className="block transition hover:text-foreground">
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Rooms · Supabase Grid. Crafted for realtime creativity.
        </div>
      </div>
    </footer>
  );
}
