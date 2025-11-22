"use client";

import { useMotionValue } from "framer-motion";
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
  const [randomString, setRandomString] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Generate enough text to cover the entire section (more characters)
  useEffect(() => {
    // Generate significantly more text for better coverage
    // Use more characters per line and more lines to cover full width and height
    // Increased significantly to ensure full coverage with no gaps
    let charsPerLine = 400; // Increased for wider screens - more chars per line
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

    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Only update if mouse is within the container bounds
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          setIsHovered(true);
          mouseX.set(x);
          mouseY.set(y);

          // Regenerate text periodically for dynamic feel (throttled)
          const now = Date.now();
          if (now - lastUpdateTime > updateInterval) {
            lastUpdateTime = now;
            animationFrame = requestAnimationFrame(() => {
              // Regenerate with line breaks for better coverage
              let charsPerLine = 400;
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
    document.addEventListener("mousemove", handleMouseMove);
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
      <EvervaultPattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} radius={radius} isHovered={isHovered} />
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
        className={`absolute inset-0 backdrop-blur-xl transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
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
        className={`absolute inset-0 mix-blend-overlay transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={style}
      >
        <p 
          className="absolute inset-0 text-[8px] leading-[1.1] whitespace-pre-wrap text-secondary/80 font-mono font-bold overflow-hidden"
          style={{ 
            padding: 0,
            margin: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            boxSizing: 'border-box'
          }}
        >
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}
