"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface EvervaultBackgroundProps {
  className?: string;
  radius?: number;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export function EvervaultBackground({
  className,
  radius = 300,
}: EvervaultBackgroundProps) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  // Use spring for smooth, natural movement
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const [randomString, setRandomString] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Generate enough text to cover the entire section (more characters)
  useEffect(() => {
    // Generate significantly more text for better coverage
    // Use more characters per line and more lines to cover full width and height
    // Increased significantly to ensure full coverage with no gaps
    let charsPerLine = 800; // Further increased for ultra-wide screens
    let numLines = 500; // Increased for taller sections - more lines
    let fullString = "";
    for (let i = 0; i < numLines; i++) {
      fullString += generateRandomString(charsPerLine) + "\n";
    }
    setRandomString(fullString);
  }, []);

  // Track mouse globally to work even when hovering over cards/header
  useEffect(() => {
    let animationFrame: number;
    let lastUpdateTime = 0;
    const updateInterval = 50; // Update text every 50ms max
    let rafId: number;

    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if mouse is within or near container bounds (with buffer for smooth transitions)
        const buffer = 100; // Buffer zone for smooth transitions
        const isNearContainer =
          x >= -buffer && x <= rect.width + buffer &&
          y >= -buffer && y <= rect.height + buffer;

        if (isNearContainer) {
          // Always update position for smooth tracking, even slightly outside bounds
          const clampedX = Math.max(0, Math.min(rect.width, x));
          const clampedY = Math.max(0, Math.min(rect.height, y));

          setIsHovered(true);

          // Use requestAnimationFrame for smooth updates
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            mouseX.set(clampedX);
            mouseY.set(clampedY);
          });

          // Regenerate text periodically for dynamic feel (throttled)
          const now = Date.now();
          if (now - lastUpdateTime > updateInterval) {
            lastUpdateTime = now;
            animationFrame = requestAnimationFrame(() => {
              // Regenerate with line breaks for better coverage
              let charsPerLine = 800;
              let numLines = 500;
              let fullString = "";
              for (let i = 0; i < numLines; i++) {
                fullString += generateRandomString(charsPerLine) + "\n";
              }
              setRandomString(fullString);
            });
          }
        } else {
          setIsHovered(false);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    // Use document-level listener to catch all mouse movements
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    if (containerRef.current) {
      containerRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group/evervault absolute inset-0 overflow-hidden rounded-lg pointer-events-none m-0 p-0",
        className
      )}
      style={{ margin: 0, padding: 0 }}
    >
      <EvervaultPattern mouseX={smoothMouseX} mouseY={smoothMouseY} randomString={randomString} radius={radius} isHovered={isHovered} />
    </div>
  );
}

function EvervaultPattern({
  mouseX,
  mouseY,
  randomString,
  radius,
  isHovered,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  randomString: string;
  radius: number;
  isHovered: boolean;
}) {
  let maskImage = useMotionTemplate`radial-gradient(${radius}px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none m-0 p-0" style={{ margin: 0, padding: 0 }}>
      {/* Base gradient fade */}
      <div className="absolute inset-0 [mask-image:linear-gradient(white,transparent)] opacity-30 transition-opacity duration-500" />

      {/* Vibrant gradient layer - mixing theme colors for an "alive" feel */}
      <motion.div
        className={`absolute inset-0 backdrop-blur-xl transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
          }`}
        style={{
          ...style,
          background: `radial-gradient(circle at center, 
            rgba(231, 125, 34, 0.8) 0%,
            rgba(231, 125, 34, 0.6) 25%,
            rgba(240, 237, 228, 0.4) 50%,
            rgba(231, 125, 34, 0.3) 75%,
            transparent 100%)`,
        }}
      />

      {/* Animated text layer - using secondary color, always visible but masked */}
      <motion.div
        className={`absolute inset-0 mix-blend-overlay transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
          }`}
        style={style}
      >
        <p
          className="absolute inset-y-0 text-[11px] md:text-[12px] lg:text-[13px] leading-none whitespace-pre-wrap text-secondary/80 font-mono font-bold overflow-hidden"
          style={{
            padding: 0,
            margin: 0,
            top: 0,
            bottom: 0,
            left: "-15%",
            right: "-15%",
            width: "130%",
            height: "100%",
            maxWidth: "130%",
            maxHeight: "100%",
            boxSizing: "border-box",
            lineHeight: 1,
            letterSpacing: "-0.08em",
          }}
        >
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}
