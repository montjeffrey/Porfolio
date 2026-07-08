"use client";

import { motion } from "framer-motion";
import { EvervaultBackground } from "@/components/ui/evervault-background";
import { ScrollScene, ParallaxLayer, ProgressReveal } from "@/lib/parallax/scroll-scene";
import { useParallaxEnabled } from "@/lib/parallax/use-parallax-enabled";

const STATEMENT_LINES: { text: string; start: number; end: number }[] = [
  { text: "Most sites describe the work.", start: 0.10, end: 0.25 },
  { text: "This one is the work.", start: 0.25, end: 0.40 },
  { text: "Every plane you just scrolled through", start: 0.40, end: 0.55 },
  { text: "is running the same discipline", start: 0.55, end: 0.70 },
  { text: "I bring to your systems.", start: 0.70, end: 0.85 },
];

export default function BrandStatement() {
  const mode = useParallaxEnabled();

  if (mode !== "full") {
    return (
      <section className="relative h-auto min-h-[60vh] py-20 px-6 overflow-hidden flex items-center justify-center">
        <div className="absolute -inset-[15%] -z-10">
          <EvervaultBackground className="rounded-none" radius={450} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto text-center space-y-4"
        >
          {STATEMENT_LINES.map((line) => (
            <p
              key={line.text}
              className="text-4xl md:text-5xl font-serif"
              style={{ color: "var(--text-primary)" }}
            >
              {line.text}
            </p>
          ))}
        </motion.div>
      </section>
    );
  }

  return (
    <ScrollScene className="h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6">
        <ParallaxLayer depth="far" className="absolute -inset-[15%]">
          <EvervaultBackground className="rounded-none" radius={450} />
        </ParallaxLayer>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          {STATEMENT_LINES.map((line) => (
            <ProgressReveal key={line.text} start={line.start} end={line.end} yFrom={16}>
              <p
                className="text-4xl md:text-5xl font-serif"
                style={{ color: "var(--text-primary)" }}
              >
                {line.text}
              </p>
            </ProgressReveal>
          ))}
        </div>
      </div>
    </ScrollScene>
  );
}
