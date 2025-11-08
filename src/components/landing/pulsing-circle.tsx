"use client";

import { PulsingBorder } from "@paper-design/shaders-react";
import { motion } from "framer-motion";

export function PulsingCircle() {
  return (
    <div className="pointer-events-none absolute bottom-8 right-8 z-30 hidden md:block">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <PulsingBorder
          colors={["#60A5FA", "#E879F9", "#FACC15", "#34D399", "#F472B6"]}
          colorBack="#00000000"
          speed={1.2}
          roundness={1}
          thickness={0.1}
          softness={0.2}
          intensity={4}
          spots-per-color={4}
          spot-size={0.15}
          pulse={0.12}
          smoke={0.5}
          smokeSize={4}
          scale={0.65}
          rotation={0}
          style={{ width: 60, height: 60, borderRadius: "50%" }}
        />

        <motion.svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ transform: "scale(1.6)" }}
        >
          <defs>
            <path id="rooms-circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text className="fill-white/80 text-sm instrument">
            <textPath href="#rooms-circle" startOffset="0%">
              Rooms Live Rooms Grid Rooms Live Rooms Grid
            </textPath>
          </text>
        </motion.svg>
      </div>
    </div>
  );
}
