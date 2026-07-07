"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollCue() {
  const prefersReduced = useReducedMotion();

  const handleClick = () => {
    document.getElementById("act-2")?.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Descend into the work"
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-secondary/70 hover:text-secondary transition-colors"
    >
      <motion.span
        className="block"
        animate={prefersReduced ? undefined : { y: [0, 8, 0] }}
        transition={prefersReduced ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-8 h-8" />
      </motion.span>
    </button>
  );
}
