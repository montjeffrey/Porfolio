"use client";

import { useReducedMotion } from "framer-motion";
import { usePerformanceTier } from "@/hooks/use-performance-tier";

export type ParallaxMode = "full" | "reduced" | "off";

export function useParallaxEnabled(): ParallaxMode {
  const reducedMotion = useReducedMotion();
  const tier = usePerformanceTier();

  if (reducedMotion) return "off";

  switch (tier) {
    case "high":
    case "flagship":
      return "full";
    case "medium":
      return "reduced";
    case "low":
    default:
      return "off";
  }
}
