"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type FeatureSectionProps = {
  title: string;
  description: string;
  index?: number;
};

export function FeatureSection({ title, description, index = 0 }: FeatureSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [36, 0, 0, -36]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      <div className="rounded-3xl border border-border/60 bg-background/70 p-6 backdrop-blur-xl transition hover:border-border">
        <div className="mb-5 flex items-start justify-between">
          <h3 className="text-lg font-mono text-foreground">{title}</h3>
          <span className="text-xs font-mono text-muted-foreground">0{index + 1}</span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
