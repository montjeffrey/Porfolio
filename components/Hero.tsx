"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ResumeModal } from '@/components/ui/resume-modal';
import { MobileScrollIndicator } from '@/components/ui/mobile-scroll-indicator';
import { usePerformanceTier } from '@/hooks/use-performance-tier';

// Lazy-load the WebGL renderers so three.js (and its post-processing stack) stays out
// of the critical first-load bundle. Both beams fade in from opacity 0 anyway, and the
// tier hook already delays mounting, so deferred loading is visually indistinguishable.
const BeamBackground = dynamic(() => import('./hero/BeamBackground'), { ssr: false });
const MobileBeam = dynamic(
  () => import('./hero/MobileBeam').then((mod) => mod.MobileBeam),
  { ssr: false }
);

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
    const contentTimer = setTimeout(() => {
      setContentVisible(true);
    }, 3750); // 3.75s syncs with the shortened burst settling

    return () => {
      clearTimeout(contentTimer);
    };
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
      {/* Background Layer - wait for the resolved tier before mounting any renderer so
          phones never spin up (and then leak) the desktop-class WebGL scene. The dark
          container background covers this sub-second detection window. */}
      {tier === null ? null : showHeavyBeam ? (
        <BeamBackground
          isMobile={tier === 'flagship'}
          tier={tier as 'flagship' | 'high'}
        />
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

      {contentVisible && (
        <div className="block sm:hidden">
          <MobileScrollIndicator />
        </div>
      )}

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}
