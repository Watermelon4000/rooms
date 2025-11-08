"use client";

import { useEffect, useState } from "react";
import { Heatmap } from "@paper-design/shaders-react";

export function HeatmapShaderBackground() {
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window === "undefined" ? 1280 : window.innerWidth,
    height: typeof window === "undefined" ? 720 : window.innerHeight,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (typeof window === "undefined") {
    return <div className="absolute inset-0 h-full w-full bg-muted" />;
  }

  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-muted">
      <Heatmap
        width={dimensions.width}
        height={dimensions.height}
        image="/globe.svg"
        colors={["#3B82F6", "#7C3AED", "#F97316", "#FDE047", "#F9A8D4"]}
        colorBack="#020617"
        contour={0.6}
        angle={0}
        noise={0.65}
        innerGlow={0.5}
        outerGlow={0.4}
        speed={0.4}
        scale={1.3}
        rotation={0}
        offsetX={0}
        offsetY={0}
      />
    </div>
  );
}
