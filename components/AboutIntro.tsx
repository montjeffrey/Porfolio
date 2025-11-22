"use client";

import { motion } from "framer-motion";

export default function AboutIntro() {
  return (
    <section className="py-20 px-6 bg-bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden group">
              {/* Glassmorphism backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm rounded-lg" />
              
              {/* Border with glow effect on hover */}
              <div className="absolute inset-0 rounded-lg border-2 border-primary/20 group-hover:border-primary transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(231,125,34,0.4)]" />
              
              {/* Image placeholder - Replace with actual image */}
              <div className="relative w-full h-full bg-bg-elevated/50 flex items-center justify-center">
                {/* Placeholder content */}
                <div className="text-center space-y-4 p-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-primary/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-secondary/60 text-sm">
                    Professional Photo
                  </p>
                </div>
              </div>

              {/* Optional: Add a subtle scale effect on hover */}
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

