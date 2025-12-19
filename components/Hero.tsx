"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ResumeModal } from '@/components/ui/resume-modal';
import { MobileScrollIndicator } from '@/components/ui/mobile-scroll-indicator';
import { usePerformanceTier } from '@/hooks/use-performance-tier';
import { MobileBeam } from './hero/MobileBeam';

interface BeamBackgroundProps {
  isMobile: boolean;
  tier: 'flagship' | 'high';
}

const BeamBackground: React.FC<BeamBackgroundProps> = ({ isMobile, tier }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  // Lazy initialization - only render when component is visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          observer.disconnect(); // Only initialize once
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !shouldRender) return;

    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      precision: 'highp', // Both tiers can handle highp
    });

    // Aggressive pixel ratio optimization for mobile
    const pixelRatio = tier === 'flagship' ?
      Math.min(window.devicePixelRatio, 1.5) : // Reduced from 2.0 to 1.5 for 30% performance boost
      Math.min(window.devicePixelRatio, 2.0);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0d0d0d, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);

    const camera = new THREE.OrthographicCamera();

    // Aggressively optimized configuration for mobile Safari
    const TIER_CONFIG = {
      flagship: {
        grid: { cols: 50, rows: 50, dotRadius: 0.03, spacing: 0.65, segments: 4 }, // Reduced to 50x50 for perfect mobile smoothnes
        bloom: { strength: 0.25, radius: 0.4, threshold: 0.4, enabled: true }, // Ultra-light bloom
        rgbShift: { amount: 0, enabled: false }, // Disabled for mobile - expensive multi-pass
        pixelRatio: 1.5
      },
      high: {
        grid: { cols: 100, rows: 100, dotRadius: 0.025, spacing: 0.55, segments: 8 },
        bloom: { strength: 0.5, radius: 0.9, threshold: 0.2, enabled: true },
        rgbShift: { amount: 0.002, enabled: true },
        pixelRatio: 2.0
      }
    };

    const config = TIER_CONFIG[tier];

    // Setup Post-Processing with tiered settings
    let composer: EffectComposer | null = null;
    let rgbShift: ShaderPass | null = null;
    let bloom: UnrealBloomPass | null = null;

    const renderPass = new RenderPass(scene, camera);

    // Only enable bloom if configured
    if (config.bloom.enabled) {
      bloom = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        config.bloom.strength,
        config.bloom.radius,
        config.bloom.threshold
      );
    }

    // Only enable RGB shift if configured (disabled for flagship mobile)
    if (config.rgbShift.enabled) {
      rgbShift = new ShaderPass(RGBShiftShader);
      rgbShift.uniforms['amount'].value = config.rgbShift.amount;
      rgbShift.uniforms['angle'].value = Math.PI / 4;
    }

    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    if (bloom) composer.addPass(bloom);
    if (rgbShift) composer.addPass(rgbShift);

    // Grid configuration based on tier
    const GRID = {
      cols: config.grid.cols,
      rows: config.grid.rows,
      jitter: 0.25,
      hexOffset: 0.5,
      dotRadius: config.grid.dotRadius,
      spacing: config.grid.spacing
    };

    const total = GRID.cols * GRID.rows;
    const geometry = new THREE.CircleGeometry(GRID.dotRadius, config.grid.segments);

    // Use additive blending for glowing beam aesthetic
    const material = new THREE.MeshBasicMaterial({
      color: 0xe77d22,
      blending: THREE.AdditiveBlending,
      opacity: tier === 'flagship' ? 0.85 : 1.0, // Slightly lower for better mobile perf
      transparent: tier === 'flagship',
      depthWrite: false // Optimization: skip depth buffer writes for transparent objects
    });

    const dots = new THREE.InstancedMesh(geometry, material, total);
    dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(dots);

    const basePos = new Float32Array(total * 2);
    const distArr = new Float32Array(total);

    let xOffset = (GRID.cols - 1) * GRID.spacing * 0.5;
    let yOffset = (GRID.rows - 1) * GRID.spacing * 0.5;

    const dummy = new THREE.Object3D();

    // Progressive loading to prevent chunked appearance
    const CHUNK_SIZE = 500; // Load 500 dots at a time
    let loadedDots = 0;

    const loadDotsChunk = () => {
      const start = loadedDots;
      const end = Math.min(start + CHUNK_SIZE, total);

      for (let idx = start; idx < end; idx++) {
        const r = Math.floor(idx / GRID.cols);
        const c = idx % GRID.cols;

        let x = c * GRID.spacing - xOffset;
        let y = r * GRID.spacing - yOffset;
        y += (c % 2) * GRID.hexOffset * GRID.spacing;
        x += (Math.random() - 0.5) * GRID.jitter;
        y += (Math.random() - 0.5) * GRID.jitter;
        basePos[idx * 2 + 0] = x;
        basePos[idx * 2 + 1] = y;
        const len = Math.hypot(x, y);
        const ang = Math.atan2(y, x);
        distArr[idx] = len;
        dummy.position.set(x, y, 0);
        dummy.updateMatrix();
        dots.setMatrixAt(idx, dummy.matrix);
      }

      dots.instanceMatrix.needsUpdate = true;
      loadedDots = end;

      // Continue loading if there are more dots
      if (loadedDots < total) {
        requestAnimationFrame(loadDotsChunk);
      }
    };

    // Start progressive loading
    loadDotsChunk();



    const clock = new THREE.Clock();
    let animationFrameId: number;
    let lastFrameTime = performance.now();
    const targetFrameTime = tier === 'flagship' ? 1000 / 60 : 1000 / 120; // 60fps for mobile, 120fps for desktop

    // Pre-allocated objects to avoid GC pressure (hoisted outside animation loop)
    const mat = new THREE.Matrix4();
    const pos = new THREE.Vector3();

    // Pre-computed constants
    const TWO_PI = Math.PI * 2;
    const speed = 0.4;
    const amp = 0.8;
    const freq = 0.25;
    const falloff = 0.04;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      // Throttle frame rate for mobile to reduce CPU load
      const now = performance.now();
      const delta = now - lastFrameTime;

      if (delta < targetFrameTime) {
        return; // Skip this frame
      }

      lastFrameTime = now - (delta % targetFrameTime);

      const t = clock.getElapsedTime();
      const phase = (Math.sin(TWO_PI * t * freq) + 1) * 0.5;

      if (rgbShift) {
        rgbShift.uniforms['amount'].value = 0.0015 + phase * 0.003;
      }

      // Update instance matrices - reusing pre-allocated objects
      for (let i = 0; i < total; i++) {
        const x0 = basePos[i * 2 + 0];
        const y0 = basePos[i * 2 + 1];
        const dist = distArr[i];
        const tt = t * speed - dist * falloff;
        const k = 1 + Math.sin(TWO_PI * tt * freq) * amp;
        pos.set(x0 * k, y0 * k, 0);
        mat.set(1, 0, 0, pos.x, 0, 1, 0, pos.y, 0, 0, 1, 0, 0, 0, 0, 1);
        dots.setMatrixAt(i, mat);
      }
      dots.instanceMatrix.needsUpdate = true;

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    }

    const resizeCamera = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const aspect = w / h;
      const worldHeight = 10;
      const worldWidth = worldHeight * aspect;

      camera.left = -worldWidth / 2;
      camera.right = worldWidth / 2;
      camera.top = worldHeight / 2;
      camera.bottom = -worldHeight / 2;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(0, 0, 10);
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);

      if (composer) {
        composer.setSize(w, h);
      }
      if (rgbShift && rgbShift.uniforms['resolution']) {
        rgbShift.uniforms['resolution'].value.set(w, h);
      }
      if (bloom) {
        bloom.setSize(w, h);
      }
    };

    const observer = new ResizeObserver(() => {
      resizeCamera();
    });
    observer.observe(container);

    resizeCamera();
    animate();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameId);
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
      geometry.dispose();
      material.dispose();
      if (composer) composer.dispose();
    };
  }, [isMobile, tier, shouldRender]);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

const MemoizedBeamBackground = React.memo(BeamBackground);

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const tier = usePerformanceTier(); // Use our new hook

  // Desktop (high) and flagship mobile get BeamBackground with post-processing
  // Medium/Low tier gets shader-based MobileBeam
  const showHeavyBeam = tier === 'high' || tier === 'flagship';

  // Splash screen effect - show content after beam fully loads and settles
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 5000); // Extended delay for smoother animation loading and immersive splash
    return () => clearTimeout(timer);
  }, []);

  const skills = ['Python', 'AWS', 'Security', 'Operations'];

  useEffect(() => {
    const fullText = skills[textIndex];

    const handleTyping = () => {
      if (isDeleting) {
        setDisplayText((prev: string) => prev.substring(0, prev.length - 1));
      } else {
        setDisplayText((prev: string) => fullText.substring(0, prev.length + 1));
      }
    };

    const typingSpeed = isDeleting ? 75 : 150;
    const typeInterval = setInterval(handleTyping, typingSpeed);

    if (!isDeleting && displayText === fullText) {
      setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTextIndex((prev: number) => (prev + 1) % skills.length);
    }

    return () => clearInterval(typeInterval);
  }, [displayText, isDeleting, textIndex, skills, tier]); // Add tier to deps

  return (
    <div className="relative w-full min-h-[100dvh] h-auto bg-bg-dark overflow-hidden pb-20 sm:pb-10">
      {/* Background Layer */}
      {showHeavyBeam ? (
        <MemoizedBeamBackground isMobile={tier === 'flagship'} tier={tier as 'flagship' | 'high'} />
      ) : (
        <MobileBeam performanceTier={tier as 'medium' | 'low'} />
      )}

      {/* Content Layer - Immersive Splash Screen Effect */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-10rem)] px-8 sm:px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="space-y-8 sm:space-y-6"
          >
            <h1 className="text-[clamp(2rem,5vw,6rem)] font-serif text-secondary leading-tight px-4 sm:px-2">
              Solutions Engineer: Where Operations Meet Innovation
            </h1>
            <p className="text-[clamp(1rem,2vw,1.875rem)] text-secondary/80 font-light leading-relaxed max-w-4xl mx-auto px-4">
              Bridging the gap between business operations and technical implementation through full-stack development, cloud infrastructure, and data-driven solutions.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4 text-[clamp(2.5rem,4vw,3.5rem)] font-serif mt-8 sm:mt-12 min-h-[4rem]">
              <span className="text-secondary">Specializing in</span>
              <span className="relative min-w-[280px] sm:min-w-[300px] text-center">
                <span className="relative z-10 text-primary px-4 py-2 rounded-md bg-secondary/95 backdrop-blur-sm inline-block">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 sm:gap-4 justify-center mt-16 sm:mt-12 w-full max-w-md sm:max-w-none mx-auto"
          >
            <Link
              href="/projects"
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 w-full sm:w-auto"
            >
              View My Projects
            </Link>
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-8 py-4 bg-transparent border-2 border-primary/30 hover:border-primary text-secondary rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm w-full sm:w-auto"
              aria-label="Download resume - opens resume selection modal"
            >
              Download Resume
            </button>
          </motion.div>
        </div>
      </div>

      <div className="block sm:hidden">
        <MobileScrollIndicator />
      </div>

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}
