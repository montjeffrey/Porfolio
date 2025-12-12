"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function AboutIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Blur increases as section exits viewport (when scrollYProgress > 0.5)
  const blur = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0, 8, 16]);

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.1, 0.25, 1],
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-secondary">
              Beyond the Code
            </h2>
            <p className="text-lg md:text-xl text-secondary/80 leading-relaxed">
              I transform complex business challenges into scalable technical solutions. With a foundation in Electrical Engineering and years of operational management experience, I bring a unique perspective to development—understanding not just how to build, but why it matters to the bottom line.
            </p>
          </motion.div>

          {/* Image Container - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.15,
              ease: [0.25, 0.1, 0.25, 1],
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-visible group p-4">
              {/* Double shadow effect - extends beyond frame on hover */}
              {/* Outer shadow layer - larger, softer glow that extends far */}
              <div className="absolute -inset-2 rounded-lg transition-all duration-500 pointer-events-none opacity-0 group-hover:opacity-100" 
                style={{
                  boxShadow: '0 20px 80px rgba(231,125,34,0.4), 0 40px 120px rgba(231,125,34,0.25), 0 60px 160px rgba(231,125,34,0.15)',
                }}
              />
              
              {/* Inner shadow layer - tighter, brighter glow */}
              <div className="absolute -inset-1 rounded-lg transition-all duration-500 pointer-events-none opacity-0 group-hover:opacity-100"
                style={{
                  boxShadow: '0 10px 40px rgba(231,125,34,0.6), inset 0 0 30px rgba(231,125,34,0.2)',
                }}
              />
              
              {/* Image container with overflow hidden for clean edges */}
              <motion.div 
                className="relative w-full h-full rounded-lg overflow-hidden"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ filter: `blur(${blur}px)` }}
              >
                {/* Glassmorphism backdrop overlay - no blur, just gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg z-10 pointer-events-none" />
                
                {/* Border with glow effect on hover */}
                <div className="absolute inset-0 rounded-lg border-2 border-primary/20 group-hover:border-primary/60 transition-all duration-300 z-20 pointer-events-none" />
                
                        {/* Actual Image - positioned to show top half */}
                        <Image
                          src="/Photos/Portfolio-picture.jpg"
                          alt="Jeffrey Montoya - Solutions Engineer"
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          priority
                          quality={90}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

