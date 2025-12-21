"use client";

import { useMotionValue, useSpring, useMotionTemplate, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Optimized spring config for fluid cursor follow
  const springConfig = { damping: 30, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Radius spring for smooth sizing
  const radiusValue = useMotionValue(radius);
  const smoothRadius = useSpring(radiusValue, springConfig);

  useEffect(() => {
    // Reset radius when prop changes
    radiusValue.set(radius);
  }, [radius, radiusValue]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Cache bounds to avoid layout thrashing
  const boundsRef = useRef<DOMRect | null>(null);

  // Bounds Caching with scroll listener for accurate cursor tracking
  useEffect(() => {
    if (!containerRef.current) return;

    const updateBounds = () => {
      if (containerRef.current) {
        boundsRef.current = containerRef.current.getBoundingClientRect();
      }
    };

    updateBounds();

    // Update bounds on resize
    const resizeObserver = new ResizeObserver(() => updateBounds());
    resizeObserver.observe(containerRef.current);

    // Update bounds when element enters/exits viewport
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          updateBounds();
        }
      },
      { threshold: [0, 0.1, 0.5, 0.9, 1] } // More granular thresholds
    );
    intersectionObserver.observe(containerRef.current);

    // Throttled scroll listener to keep bounds fresh during scroll
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateBounds();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Optimized Mouse Handling
  const [isHovered, setIsHovered] = useState(false);

  // Mobile Scroll Driver
  useEffect(() => {
    if (!isMobile) return;

    // Set initial position to center if no anchors found yet
    if (boundsRef.current) {
      mouseX.set(boundsRef.current.width / 2);
      mouseY.set(boundsRef.current.height / 2);
    }

    // Always show on mobile when in view (managed by opacity transitions)
    setIsHovered(true);

    let activeAnchor: Element | null = null;
    let observer: IntersectionObserver;
    let timeoutId: NodeJS.Timeout;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the most visible anchor
      const visibleEntries = entries.filter(e => e.isIntersecting);

      if (visibleEntries.length === 0) return;

      // Sort by intersection ratio and closeness to center
      const bestEntry = visibleEntries.reduce((prev, current) => {
        return (prev.intersectionRatio > current.intersectionRatio) ? prev : current;
      });

      const anchor = bestEntry.target;

      // Debounce logic to prevent jitters
      if (activeAnchor !== anchor) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          activeAnchor = anchor;
          updateSpotlight(anchor);
        }, 120); // 120ms debounce "settle"
      } else {
        // Immediate update if it's the same anchor but moving (scrolling)
        // We actually rely on the loop or just update when ratio changes significantly?
        // Actually, we want to track it. simple way: update on every significant ratio change 
        // OR better: just calculated target once when it becomes active?
        // Requirement: "Spotlight center should be slightly above the anchor’s center"
        // Since anchors scroll WITH the page, and the Spotlight is likely fixed/absolute within a container that MIGHT be scrolling?
        // Wait, Evervault is absolute in the section. The section scrolls. 
        // So the relative position of the anchor in the section is CONSTANT.
        // HENCE we only need to update the target ONE TIME when the anchor becomes active!
        // The spotlight is inside the same scrolling container (Skills Section).
        updateSpotlight(anchor);
      }
    };

    const updateSpotlight = (anchor: Element) => {
      if (!boundsRef.current) return;
      const anchorRect = anchor.getBoundingClientRect();
      const containerRect = boundsRef.current; // This might be stale if we don't update it. 
      // But boundsRef is updated on scroll in the other effect.

      // We need accurate relative coordinates. 
      // Since both move together in the document flow, their relative distance is constant.
      // relativeX = anchorRect.left - containerRect.left
      // relativeY = anchorRect.top - containerRect.top

      const relLeft = anchorRect.left - containerRect.left;
      const relTop = anchorRect.top - containerRect.top;

      const targetX = relLeft + anchorRect.width * 0.5;
      const targetY = relTop + anchorRect.height * 0.35; // Bias slightly up

      mouseX.set(targetX);
      mouseY.set(targetY);

      // Adapt Layout
      const size = Math.max(anchorRect.width, anchorRect.height);
      const newRadius = Math.max(Math.min(size * 0.75, 400), 150); // Clamp
      radiusValue.set(newRadius);
    };

    observer = new IntersectionObserver(handleIntersection, {
      threshold: [0.2, 0.5, 0.8],
      rootMargin: "-10% 0px -10% 0px" // Focus on center area
    });

    const anchors = document.querySelectorAll('[data-spotlight-anchor]');
    anchors.forEach(a => observer.observe(a));

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [isMobile, mouseX, mouseY, radiusValue]);

  // Desktop Mouse & Touch Handling
  useEffect(() => {
    if (isMobile) return; // Disable on mobile

    const handleMouseMove = (event: MouseEvent) => {
      if (!boundsRef.current) return;
      const { left, top, width, height } = boundsRef.current;
      const clientX = event.clientX - left;
      const clientY = event.clientY - top;

      // Small buffer to keep cursor active near edges
      const buffer = 50;
      if (
        clientX >= -buffer &&
        clientX <= width + buffer &&
        clientY >= -buffer &&
        clientY <= height + buffer
      ) {
        mouseX.set(clientX);
        mouseY.set(clientY);
        if (!isHovered) setIsHovered(true);
      } else {
        if (isHovered) setIsHovered(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered, mouseX, mouseY, isMobile]);

  // Separate effect for container-scoped events (Touch)
  useEffect(() => {
    if (isMobile) return; // Disable on mobile

    const container = containerRef.current;
    if (!container) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!boundsRef.current) return;
      const touch = e.touches[0];
      const x = touch.clientX - boundsRef.current.left;
      const y = touch.clientY - boundsRef.current.top;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    }
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
        radius={smoothRadius}
        isHovered={isHovered}
        isMobile={isMobile}
      />
    </div>
  );
}

// Canvas-based Pattern Component
const EvervaultPattern = React.memo(function EvervaultPattern({
  mouseX,
  mouseY,
  radius,
  isHovered,
  isMobile
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  radius: any; // Allow MotionValue or number
  isHovered: boolean;
  isMobile: boolean;
}) {
  let maskImage = useMotionTemplate`radial-gradient(${radius}px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration
    const fontSize = isMobile ? 12 : 15;
    const font = `${fontSize}px monospace`;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // Throttling frames for scramble effect
    let lastTime = 0;
    const interval = 50;
    let animationFrameId: number;

    const draw = (time: number) => {
      // Logic for automatic resizing
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const width = rect.width * dpr;
      const height = rect.height * dpr;

      // Efficient resize check
      const needsResize = Math.abs(canvas.width - width) > 1 || Math.abs(canvas.height - height) > 1;

      if (needsResize) {
        canvas.width = width;
        canvas.height = height;

        ctx.scale(dpr, dpr);
      }

      if (time - lastTime > interval || needsResize) {
        lastTime = time;

        ctx.clearRect(0, 0, rect.width, rect.height);

        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillStyle = "rgba(240, 237, 228, 0.8)"; // text-secondary/80
        ctx.textBaseline = "top";

        const charMetrics = ctx.measureText("M");
        const charWidth = charMetrics.width;

        if (charWidth > 0 && rect.width > 0 && rect.height > 0) {
          const columns = Math.ceil(rect.width / charWidth) + 2;
          const rows = Math.ceil(rect.height / fontSize) + 1;

          // Draw the grid
          for (let i = 0; i < rows; i++) {
            let line = "";
            const safeColumns = Math.min(columns, 500);
            for (let j = 0; j < safeColumns; j++) {
              line += chars[Math.floor(Math.random() * chars.length)];
            }
            ctx.fillText(line, 0, i * fontSize);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  return (
    <div className="pointer-events-none m-0 p-0" style={{ margin: 0, padding: 0 }}>
      {/* Base gradient fade */}
      <div className="absolute inset-0 [mask-image:linear-gradient(white,transparent)] opacity-30 transition-opacity duration-500" />

      {/* Vibrant gradient layer */}
      <motion.div
        className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
          }`}
        style={{
          ...style,
          background: `radial-gradient(circle at center, 
            rgba(231, 125, 34, 0.8) 0%,
            rgba(231, 125, 34, 0.6) 25%,
            rgba(240, 237, 228, 0.4) 50%,
            rgba(231, 125, 34, 0.3) 75%,
            transparent 100%)`,
          willChange: "mask-image"
        }}
      />

      {/* Canvas Text Layer - masked by the same motion template */}
      <motion.div
        className={`absolute inset-0 mix-blend-overlay transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
          }`}
        style={style}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </motion.div>
    </div>
  );
});
