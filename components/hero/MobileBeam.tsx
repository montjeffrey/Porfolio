"use client";
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

interface MobileBeamProps {
    performanceTier: 'medium' | 'low';
}

/**
 * MobileBeam — CSS/WAAPI beam tuned for mobile
 *
 * Why this refactor:
 * - Removes WebGL/Three.js from mobile entirely to avoid GPU driver overhead and fill‑rate costs.
 * - Uses transform‑only animations (translate/rotate) which stay on the compositor thread for smoothness.
 * - Minimizes JavaScript per frame: WAAPI handles interpolation; we only pause/resume and do light housekeeping.
 */
export const MobileBeam = React.memo<MobileBeamProps>(({ performanceTier }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const beamRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<Animation | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        const beam = beamRef.current;

        if (!container || !beam) return;

        // Respect reduced motion preferences — disable animation entirely.
        const reducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Ensure the compositor can plan ahead: transforms and opacity only.
        beam.style.willChange = 'transform, opacity';
        if (glowRef.current) glowRef.current.style.willChange = 'transform, opacity';

        // Hardware acceleration hint: allocate a layer and avoid main-thread layout.
        beam.style.transform = 'translate3d(0,0,0)';
        if (glowRef.current) glowRef.current.style.transform = 'translate3d(0,0,0)';

        // Create a transform-only WAAPI animation (no JS per frame updates).
        // Keyframes intentionally simple to keep the compositor happy on mid-range phones.
        const durationMs = performanceTier === 'medium' ? 7000 : 9000; // slightly slower for low tier
        const wobble = performanceTier === 'medium' ? 6 : 4; // degrees of rotation

        if (!reducedMotion) {
            const anim = beam.animate(
                [
                    { transform: 'translate3d(-60%, -50%, 0) rotate(-' + wobble + 'deg)', opacity: 0.65 },
                    { transform: 'translate3d(0%, -50%, 0) rotate(0deg)', opacity: 0.85 },
                    { transform: 'translate3d(60%, -50%, 0) rotate(' + wobble + 'deg)', opacity: 0.65 },
                ],
                {
                    duration: durationMs,
                    iterations: Infinity,
                    easing: 'linear', // compositor-friendly
                }
            );
            animationRef.current = anim;

            // Battery-aware throttling: after ~12s, reduce playback rate
            const slowDownTimer = window.setTimeout(() => {
                try {
                    // Reduce energy while keeping motion alive
                    anim.updatePlaybackRate(0.6);
                } catch (_) {
                    // Some browsers may not support updatePlaybackRate; ignore gracefully.
                }
            }, 12000);

            // Pause when tab is hidden; resume when visible.
            const onVis = () => {
                if (document.hidden) anim.pause();
                else anim.play();
            };
            document.addEventListener('visibilitychange', onVis, { passive: true });

            // Pause when not on screen using IntersectionObserver.
            const io = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    if (!entry) return;
                    if (entry.isIntersecting) anim.play();
                    else anim.pause();
                },
                { root: null, threshold: 0.05 }
            );
            io.observe(container);
            observerRef.current = io;

            // Clean up listeners/timers on unmount.
            return () => {
                window.clearTimeout(slowDownTimer);
                document.removeEventListener('visibilitychange', onVis);
                if (observerRef.current) {
                    observerRef.current.disconnect();
                    observerRef.current = null;
                }
                try {
                    anim.cancel(); // release animation resources
                } catch (_) {}
                animationRef.current = null;
            };
        }

        // If reduced motion, ensure a pleasing static beam.
        // No animation loop; single paint only.
        return () => {};
    }, [performanceTier]);

    // Layout: simple layered DOM, transform-only styling.
    // Avoids filters/blur to reduce paint cost on mobile GPUs.
    const beamThickness = performanceTier === 'medium' ? 'h-2' : 'h-[6px]';
    const glowThickness = performanceTier === 'medium' ? 'h-12' : 'h-10';

    return (
        <div
            ref={containerRef}
            className={clsx(
                'absolute inset-0 z-0 pointer-events-none overflow-hidden',
                'bg-gradient-to-b from-bg-elevated via-bg-elevated to-bg-dark'
            )}
        >
            {/* Glow layer (wide, faint). Pure transform/opacity; no filter blur. */}
            <div
                ref={glowRef}
                className={clsx(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-[180%]',
                    glowThickness,
                    // Use theme tokens for color — lighter opacity for subtlety
                    'bg-gradient-to-r from-primary/20 via-primary/35 to-transparent'
                )}
                style={{ transform: 'translate3d(-60%, -50%, 0)', opacity: 0.35 }}
            />

            {/* Beam core (thin, bright). Transform-only WAAPI animates this element. */}
            <div
                ref={beamRef}
                className={clsx(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-[160%]',
                    beamThickness,
                    'bg-gradient-to-r from-primary via-primary/90 to-transparent'
                )}
                style={{ transform: 'translate3d(-60%, -50%, 0)', opacity: 0.85 }}
            />
        </div>
    );
});

MobileBeam.displayName = 'MobileBeam';

/*
====================================================
Performance Improvements Summary (Mobile specific)
====================================================
- Removed WebGL/Three.js: Eliminates GPU driver overhead, shader compilation, and fill-rate pressure.
- Transform-only animation via WAAPI: Runs on compositor thread; no JS per frame → targets 60fps on modern phones.
- Reduced motion support: Honours prefers-reduced-motion; zero animation work in that case.
- IntersectionObserver + visibility pause: Animation pauses when offscreen or tab is hidden → battery and CPU savings.
- will-change hints: Pre-allocates layers for transform/opacity to prevent layout thrash.
- translate3d(0,0,0): Forces hardware acceleration to avoid software compositing.
- No filters/blur: Avoids expensive paint/composite ops common on mobile.
- Tier-based tuning: Slower duration and smaller wobble on low tier to reduce perceived jank.
- Battery-aware throttling: Playback rate is lowered after ~12s to reduce energy while maintaining motion.

Metrics / Techniques
- JS re-renders during animation: 0 (no setState; refs + WAAPI only).
- DOM writes per frame: 0 (compositor handles frames; we only create the animation once).
- Target frame rate: 60fps (compositor-managed); practical on mid-range devices.
- Animation properties: transform, opacity (GPU-friendly).
- Cleanup: cancel() + disconnect() + remove listeners → prevents memory leaks.

Side-by-side comparison to original
- Original: WebGL point cloud with custom shaders, continuous rAF render loop.
    New: DOM/CSS layers with WAAPI; no render loop, minimal JS.
- Original: Additive blending and fragment shader feathering.
    New: Gradient-based glow using theme tokens; avoids filter/blur and heavy blending.
- Original: ResizeObserver + camera updates + render() per frame.
    New: No canvas/camera; pure transform layers sized via CSS; observer only for pause/resume.
- Original: Potential battery drain due to constant GPU activity even when offscreen.
    New: Automatic pause when offscreen/hidden and playback-rate slow down.

Testing considerations
- Verify on low-tier Android (~2019) and mid-tier iPhone: animation should be smooth with minor wobble.
- Check reduced motion: beam remains static without animation.
- Ensure no layout thrash in DevTools (Performance): only composite layer updates.
- Validate that pausing/resuming via visibility/intersection works without leaks.
*/
