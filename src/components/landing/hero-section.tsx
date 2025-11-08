"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { HeroContent } from "./hero-content";
import { PulsingCircle } from "./pulsing-circle";
import { RotatingEarthBackground } from "./rotating-earth";

export function HeroSection() {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-background px-4 py-16 sm:px-8 md:p-12"
    >
      <RotatingEarthBackground className="absolute inset-0" />
      <div className="relative z-20 flex min-h-[85vh] items-center justify-center">
        <div className="absolute left-6 top-6 z-30 md:left-10 md:top-10">
          <ThemeToggle />
        </div>
        <div className="relative flex w-full items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-20 flex w-full items-center justify-center"
          >
            <HeroContent />
          </motion.div>
        </div>
      </div>
      <PulsingCircle />
    </section>
  );
}
