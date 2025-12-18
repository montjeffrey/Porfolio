"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

<<<<<<< HEAD
  // Use spring for smooth, natural movement - slightly stiffer on mobile for responsiveness
  const springConfig = { damping: 25, stiffness: isMobile ? 300 : 200 };
=======
  // Use spring for smooth, natural movement
  const springConfig = { damping: 25, stiffness: 200 };
>>>>>>> Main
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const [randomString, setRandomString] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

<<<<<<< HEAD
  useEffect(() => {
    // Generate text based on device capability
    // Mobile: Less dense, static generation
    // Desktop: High density, dynamic regeneration
    let charsPerLine = isMobile ? 40 : 800;
    let numLines = isMobile ? 30 : 500;
    let fullString = "";
    for (let i = 0; i < numLines; i++) {
      fullString += generateRandomString(charsPerLine) + "\n";
    }
    setRandomString(fullString);
  }, [isMobile]);
=======
  // Generate enough text to cover the entire section
  useEffect(() => {
    const updateGrid = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const charsPerLine = Math.ceil(width / 6) + 10;
      const numLines = Math.ceil(height / 10) + 10;

      let fullString = "";
      for (let i = 0; i < numLines; i++) {
        fullString += generateRandomString(charsPerLine) + "\n";
      }
      setRandomString(fullString);
    };

    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);
>>>>>>> Main

  // Track mouse/touch globally
  useEffect(() => {
    let animationFrame: number;
    let lastUpdateTime = 0;
    const updateInterval = 50;
    let rafId: number;

    const handleMove = (x: number, y: number) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = x - rect.left;
        const clientY = y - rect.top;

<<<<<<< HEAD
        const buffer = 100;
        const isNearContainer =
          clientX >= -buffer && clientX <= rect.width + buffer &&
          clientY >= -buffer && clientY <= rect.height + buffer;

        if (isNearContainer) {
          const clampedX = Math.max(0, Math.min(rect.width, clientX));
          const clampedY = Math.max(0, Math.min(rect.height, clientY));

          setIsHovered(true);

=======
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
>>>>>>> Main
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            mouseX.set(clampedX);
            mouseY.set(clampedY);
          });

<<<<<<< HEAD
          // Only regenerate text on Desktop
          if (!isMobile) {
            const now = Date.now();
            if (now - lastUpdateTime > updateInterval) {
              lastUpdateTime = now;
              animationFrame = requestAnimationFrame(() => {
                let charsPerLine = 800;
                let numLines = 500;
                let fullString = "";
                for (let i = 0; i < numLines; i++) {
                  fullString += generateRandomString(charsPerLine) + "\n";
                }
                setRandomString(fullString);
              });
            }
=======
          // Regenerate text periodically for dynamic feel (throttled)
          const now = Date.now();
          if (now - lastUpdateTime > 100) { // Increased to 100ms for better performance
            lastUpdateTime = now;
            animationFrame = requestAnimationFrame(() => {
              if (!containerRef.current) return;

              const { width, height } = containerRef.current.getBoundingClientRect();

              // Dynamic grid calculation:
              // Font is approx 7px width, 10px height at standard density
              // We add a buffer to ensure coverage
              const charsPerLine = Math.ceil(width / 6) + 10;
              const numLines = Math.ceil(height / 10) + 10;

              let fullString = "";
              for (let i = 0; i < numLines; i++) {
                fullString += generateRandomString(charsPerLine) + "\n";
              }
              setRandomString(fullString);
            });
>>>>>>> Main
          }
        } else {
          setIsHovered(false);
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      handleMove(event.clientX, event.clientY);
    };

    // Add touch support for mobile interaction
    const handleTouchMove = (event: TouchEvent) => {
      // Prevent default only if inside container to avoid blocking scroll elsewhere 
      // but here we want the 'flashlight' to follow finger
      const touch = event.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Add passive touch listener
    if (containerRef.current) {
      containerRef.current.addEventListener("mouseleave", handleMouseLeave);
      containerRef.current.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave);
        containerRef.current.removeEventListener("touchmove", handleTouchMove);
      }
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY, isMobile]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group/evervault absolute inset-0 overflow-hidden rounded-lg pointer-events-none m-0 p-0",
        className
      )}
      style={{ margin: 0, padding: 0 }}
    >
      <EvervaultPattern
        mouseX={smoothMouseX}
        mouseY={smoothMouseY}
        randomString={randomString}
        radius={radius}
        isHovered={isHovered}
        isMobile={isMobile}
      />
    </div>
  );
}

function EvervaultPattern({
  mouseX,
  mouseY,
  randomString,
  radius,
  isHovered,
  isMobile
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  randomString: string;
  radius: number;
  isHovered: boolean;
  isMobile: boolean;
}) {
  let maskImage = useMotionTemplate`radial-gradient(${radius}px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none m-0 p-0" style={{ margin: 0, padding: 0 }}>
      {/* Base gradient fade */}
      <div className="absolute inset-0 [mask-image:linear-gradient(white,transparent)] opacity-30 transition-opacity duration-500" />

<<<<<<< HEAD
      {/* Vibrant gradient layer */}
=======
      {/* Vibrant gradient layer - mixing theme colors for an "alive" feel */}
>>>>>>> Main
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

      {/* Animated text layer */}
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
            // Optimized text rendering for mobile
            textRendering: isMobile ? "optimizeSpeed" : "optimizeLegibility",
          }}
        >
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}
