"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

import { cn } from "@/lib/utils";

type PolygonRing = [number, number][];
type MultiPolygon = PolygonRing[];

type LandGeometry =
  | {
      type: "Polygon";
      coordinates: PolygonRing[];
    }
  | {
      type: "MultiPolygon";
      coordinates: MultiPolygon[];
    };

type LandFeature = {
  type: "Feature";
  properties?: Record<string, unknown>;
  geometry: LandGeometry;
};

type LandCollection = {
  type: "FeatureCollection";
  features: LandFeature[];
};

type DotData = {
  lng: number;
  lat: number;
  visible: boolean;
};

type RotatingEarthProps = {
  className?: string;
  dotSpacing?: number;
};

const DATA_URL =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json";

export function RotatingEarthBackground({ className, dotSpacing = 16 }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let containerWidth = 0;
    let containerHeight = 0;
    let radius = 0;

    const allDots: DotData[] = [];
    const rotation: [number, number] = [0, 0];
    let projection = d3.geoOrthographic().clipAngle(90);
    let path = d3.geoPath().projection(projection).context(context);

    let landFeatures: LandCollection | null = null;

    const pointInPolygon = (point: [number, number], polygon: PolygonRing) => {
      const [x, y] = point;
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) {
          inside = !inside;
        }
      }

      return inside;
    };

    const pointInFeature = (point: [number, number], feature: LandFeature) => {
      const geometry = feature.geometry;

      if (geometry.type === "Polygon") {
        const [outerRing, ...holes] = geometry.coordinates;
        if (!pointInPolygon(point, outerRing)) return false;
        return !holes.some((hole) => pointInPolygon(point, hole));
      }

      if (geometry.type === "MultiPolygon") {
        return geometry.coordinates.some((polygon) => {
          const [outerRing, ...holes] = polygon;
          if (!pointInPolygon(point, outerRing)) return false;
          return !holes.some((hole) => pointInPolygon(point, hole));
        });
      }

      return false;
    };

    const generateDotsInFeature = (feature: LandFeature) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature as d3.GeoPermissibleObjects);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;

      const stepSize = dotSpacing * 0.08;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const candidate: [number, number] = [lng, lat];
          if (pointInFeature(candidate, feature)) {
            dots.push(candidate);
          }
        }
      }

      return dots;
    };

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);

      if (!landFeatures) return;

      context.beginPath();
      path({ type: "Sphere" } as d3.GeoPermissibleObjects);
      context.fillStyle = "#040713";
      context.fill();

      context.beginPath();
      path({ type: "FeatureCollection", features: landFeatures.features } as d3.GeoPermissibleObjects);
      context.fillStyle = "rgba(255, 255, 255, 0.08)";
      context.fill();

      allDots.forEach((dot) => {
        const projected = projection([dot.lng, dot.lat]);
        if (!projected) return;

        const [x, y] = projected;
        const visible = x >= 0 && x <= containerWidth && y >= 0 && y <= containerHeight;
        if (!visible) return;

        const [rotLng] = projection.rotate() as [number, number, number];
        const relativeLng = ((dot.lng + rotLng + 180) % 360) - 180;
        const isFront = Math.abs(relativeLng) <= 90;

        context.beginPath();
        context.arc(x, y, 1.2, 0, 2 * Math.PI);
        context.fillStyle = isFront ? "#D9D6FF" : "rgba(217, 214, 255, 0.3)";
        context.fill();
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const rect = parent?.getBoundingClientRect();
      containerWidth = rect?.width ?? window.innerWidth;
      containerHeight = rect?.height ?? window.innerHeight;
      radius = Math.min(containerWidth, containerHeight) / 2.6;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      projection = projection.scale(radius).translate([containerWidth / 2, containerHeight / 2]);
      path = d3.geoPath().projection(projection).context(context);
      render();
    };

    const loadData = async () => {
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error("Failed to load land data");
      }

      const collection: LandCollection = await response.json();
      landFeatures = collection;

      collection.features.forEach((feature) => {
        const dots = generateDotsInFeature(feature);
        dots.forEach(([lng, lat]) => {
          allDots.push({ lng, lat, visible: true });
        });
      });

      render();
    };


    const rotate = () => {
      rotation[0] += 0.4;
      projection.rotate(rotation);
      render();
    };

    const rotationTimer = d3.timer(rotate);

    window.addEventListener("resize", resize);

    resize();
    loadData().catch(() => {
      // ignore error: background will just remain empty
    });

    return () => {
      rotationTimer.stop();
      window.removeEventListener("resize", resize);
    };
  }, [dotSpacing]);

  return (
    <div className={cn("h-full w-full", className)}>
      <div className="relative h-full w-full">
        <canvas ref={canvasRef} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0f172acc]/30 via-transparent to-[#020617]/80" />
      </div>
    </div>
  );
}
