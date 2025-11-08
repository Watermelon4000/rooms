"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroContent() {
  return (
    <div className="text-center text-balance space-y-4">
      <p className="font-pixel text-xs tracking-[0.6em] text-white/70">ROOMS · SUPABASE GRID</p>
      <h1 className="text-pixel-lg pixel-outline text-white drop-shadow-lg">Realtime Rooms</h1>
      <p className="font-pixel text-sm uppercase tracking-[0.35em] text-white/80">
        设计、编辑、分享你的 20×20 世界
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button
          asChild
          size="lg"
          className="rounded-full px-8 font-pixel text-sm tracking-[0.3em] bg-black/80 text-white hover:bg-black dark:bg-white/10 dark:text-white dark:hover:bg-white/20 border border-white/40"
        >
          <Link href="/dashboard">进入控制台</Link>
        </Button>
      </div>
    </div>
  );
}
