"use client";

import { useEffect, useState } from "react";
import { Water } from "@paper-design/shaders-react";

export function WaterShaderBackground() {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden">
      <div className="flex h-full w-full items-center justify-center">
        <Water
          width={dimensions.width}
          height={dimensions.height}
          colorBack="#020617"
          colorHighlight="#2563EB"
          highlights={0.35}
          layering={0.55}
          edges={0.4}
          waves={0.65}
          caustic={0.7}
          effectScale={1.4}
          scale={1}
          speed={0.18}
          fit="cover"
        />
      </div>
    </div>
  );
}
