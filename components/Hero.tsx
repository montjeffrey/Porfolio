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
import { useIsMobile } from '@/hooks/use-mobile';

interface BeamBackgroundProps {
  isMobile: boolean;
}

const BeamBackground: React.FC<BeamBackgroundProps> = ({ isMobile }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp', // Lower precision for mobile
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0d0d0d, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);

    const camera = new THREE.OrthographicCamera();

    // Setup Post-Processing only for Desktop
    let composer: EffectComposer | null = null;
    let rgbShift: ShaderPass | null = null;
    let bloom: UnrealBloomPass | null = null;

    if (!isMobile) {
      const renderPass = new RenderPass(scene, camera);
      bloom = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        0.5,
        0.9,
        0.2
      );
      rgbShift = new ShaderPass(RGBShiftShader);
      rgbShift.uniforms['amount'].value = 0.002;
      rgbShift.uniforms['angle'].value = Math.PI / 4;

      composer = new EffectComposer(renderer);
      composer.addPass(renderPass);
      composer.addPass(bloom);
      composer.addPass(rgbShift);
    }

    // Adjust grid density based on device
    const GRID = {
      cols: isMobile ? 50 : 100, // Reduced density for mobile
      rows: isMobile ? 50 : 100, // Reduced density for mobile
      jitter: 0.25,
      hexOffset: 0.5,
      dotRadius: isMobile ? 0.04 : 0.025, // Slightly larger dots on mobile to compensate for lower density
      spacing: isMobile ? 1.1 : 0.55 // Increased spacing for mobile
    };

    const total = GRID.cols * GRID.rows;
    const geometry = new THREE.CircleGeometry(GRID.dotRadius, isMobile ? 4 : 8); // Lower geometry detail on mobile

    // Use additive blending on mobile to simulate glow without heavy post-processing
    const material = new THREE.MeshBasicMaterial({
      color: 0xe77d22,
      blending: isMobile ? THREE.AdditiveBlending : THREE.NoBlending,
      opacity: isMobile ? 0.8 : 1.0,
      transparent: isMobile
    });

    const dots = new THREE.InstancedMesh(geometry, material, total);
    dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(dots);

    const basePos = new Float32Array(total * 2);
    const distArr = new Float32Array(total);

    let xOffset = (GRID.cols - 1) * GRID.spacing * 0.5;
    let yOffset = (GRID.rows - 1) * GRID.spacing * 0.5;

    let idx = 0;
    const dummy = new THREE.Object3D();

    for (let r = 0; r < GRID.rows; r++) {
      for (let c = 0; c < GRID.cols; c++, idx++) {
        let x = c * GRID.spacing - xOffset;
        let y = r * GRID.spacing - yOffset;
        y += (c % 2) * GRID.hexOffset * GRID.spacing;
        x += (Math.random() - 0.5) * GRID.jitter;
        y += (Math.random() - 0.5) * GRID.jitter;
        basePos[idx * 2 + 0] = x;
        basePos[idx * 2 + 1] = y;
        const len = Math.hypot(x, y);
        const ang = Math.atan2(y, x);
        const oct = 0.5 * Math.cos(ang * 8.0);
        distArr[idx] = len + oct * 0.75;
        dummy.position.set(x, y, 0);
        dummy.updateMatrix();
        dots.setMatrixAt(idx, dummy.matrix);
      }
    }

    function roundedSquareWave(t: number, delta: number, a: number, f: number) {
      return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
    }

    const clock = new THREE.Clock();
    let animationFrameId: number;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      // Limit FPS on mobile if needed, but the scene is now light enough to run full speed
      const t = clock.getElapsedTime();
      const speed = 0.4;
      const amp = 0.8;
      const freq = 0.25;
      const falloff = 0.04;

      const phase = (Math.sin(2 * Math.PI * t * freq) + 1) * 0.5;

      if (!isMobile && rgbShift) {
        rgbShift.uniforms['amount'].value = 0.0015 + phase * 0.003;
      }

      const mat = new THREE.Matrix4();
      const pos = new THREE.Vector3();

      for (let i = 0; i < total; i++) {
        const x0 = basePos[i * 2 + 0];
        const y0 = basePos[i * 2 + 1];
        const dist = distArr[i];
        const localDelta = THREE.MathUtils.lerp(0.05, 0.2, Math.min(1.0, dist / 70.0));
        const tt = t * speed - dist * falloff;
        const k = 1 + roundedSquareWave(tt, localDelta, amp, freq);
        pos.set(x0 * k, y0 * k, 0);
        mat.set(1, 0, 0, pos.x, 0, 1, 0, pos.y, 0, 0, 1, 0, 0, 0, 0, 1);
        dots.setMatrixAt(i, mat);
      }
      dots.instanceMatrix.needsUpdate = true;

      if (isMobile) {
        renderer.render(scene, camera);
      } else if (composer) {
        composer.render();
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
  }, [isMobile]);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const isMobile = useIsMobile();

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
  }, [displayText, isDeleting, textIndex, skills]);

  return (
<<<<<<< HEAD
    <div className="relative w-full min-h-screen bg-bg-dark overflow-hidden">
      <BeamBackground isMobile={isMobile} />
=======
    <div className="relative w-full min-h-[100dvh] bg-bg-dark overflow-hidden">
      <BeamBackground />
>>>>>>> Main

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
<<<<<<< HEAD
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-secondary leading-tight">
              Solutions Engineer: Where Operations Meet Innovation
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-secondary/80 font-light leading-relaxed max-w-4xl mx-auto">
              Bridging the gap between business operations and technical implementation through full-stack development, cloud infrastructure, and data-driven solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-8">
              <span className="text-secondary">Specializing in</span>
              <span className="text-primary min-w-[200px] sm:min-w-[300px] text-center sm:text-left whitespace-nowrap">
=======
            <h1 className="text-[clamp(2.5rem,5vw,6rem)] font-serif text-secondary leading-tight">
              Solutions Engineer: Where Operations Meet Innovation
            </h1>
            <p className="text-[clamp(1.1rem,2vw,1.875rem)] text-secondary/80 font-light leading-relaxed max-w-4xl mx-auto">
              Bridging the gap between business operations and technical implementation through full-stack development, cloud infrastructure, and data-driven solutions.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-[clamp(3rem,4vw,3.5rem)] font-serif mt-8">
              <span className="text-secondary">Specializing in</span>
              <span className="text-primary min-w-[300px] text-center">
>>>>>>> Main
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12 w-full sm:w-auto"
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

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}

