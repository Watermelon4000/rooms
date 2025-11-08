"use client";

import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ChatPill() {
  const { scrollYProgress } = useScroll();

  const width = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["64px", "140px", "320px", "360px"]);
  const height = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["64px", "64px", "54px", "54px"]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["32px", "32px", "28px", "28px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 0.75, 0.9, 1]);

  const openDocs = () => {
    if (typeof window === "undefined") return;
    window.open("https://supabase.com/docs", "_blank", "noopener,noreferrer");
  };

  return (
    <motion.button
      type="button"
      aria-label="查看 Rooms 文档"
      className="fixed bottom-6 left-1/2 z-50 flex min-h-[44px] max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center justify-start border border-border bg-secondary/90 px-2 text-left text-sm text-foreground shadow-2xl backdrop-blur-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:bottom-8 sm:px-4"
      style={{ width, height, borderRadius, opacity }}
      onClick={openDocs}
    >
      <motion.div className="relative flex h-full w-full items-center overflow-hidden">
        <motion.span
          className="absolute left-1/2 -translate-x-1/2 text-foreground"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.35], [1, 0]) }}
        >
          <MessageCircle className="h-5 w-5" />
        </motion.span>
        <motion.div
          className="flex w-full items-center justify-between px-2 sm:px-3"
          style={{ opacity: useTransform(scrollYProgress, [0.35, 0.65], [0, 1]) }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden />
            <span className="truncate text-xs font-medium text-foreground/80 sm:text-sm">了解 Rooms 实时网格</span>
          </div>
          <motion.span style={{ opacity: useTransform(scrollYProgress, [0.55, 0.8], [0, 1]) }}>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
