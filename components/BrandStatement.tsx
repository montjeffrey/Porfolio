"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";

export default function BrandStatement() {
  return (
    <section className="py-20 px-6 bg-bg-dark">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="w-8 h-8 text-primary" />
            <h2 className="text-4xl md:text-5xl font-serif text-secondary">
              Engineering Solutions for Real-World Impact
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-secondary/80 leading-relaxed">
            My journey from Electrical Engineering to Operations Management to Software Development isn't just a career path—it's my competitive advantage. I understand the technical constraints engineers face, the operational challenges managers navigate, and the customer needs that drive business decisions.
          </p>

          <p className="text-lg text-secondary/70 leading-relaxed">
            Today, I leverage this multifaceted experience to build secure, scalable, and business-focused technical solutions that don't just work—they deliver measurable results.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

