"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useParallaxEnabled } from "@/lib/parallax/use-parallax-enabled";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const mode = useParallaxEnabled();

  if (mode === "off") return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{ scaleX, backgroundColor: "var(--accent-primary)" }}
    />
  );
}
