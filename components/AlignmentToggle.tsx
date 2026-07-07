"use client";

import { motion } from "framer-motion";
import { useAlignmentStore, type AlignmentId } from "@/lib/alignment/store";

// Swatch preview values — hard-coded to match each alignment's --accent-primary
// token (see lib/alignment/alignments.json). These are the only literal hex
// values in this file.
const SWATCH_COLORS: Record<AlignmentId, string> = {
  ember: "#E77D22",
  meridian: "#4C8DFF",
  atelier: "#D9A441",
};

const OPTIONS: { id: AlignmentId; label: string }[] = [
  { id: "ember", label: "Ember" },
  { id: "meridian", label: "Meridian" },
  { id: "atelier", label: "Atelier" },
];

export default function AlignmentToggle() {
  const alignment = useAlignmentStore((state) => state.alignment);
  const setAlignment = useAlignmentStore((state) => state.setAlignment);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + delta + OPTIONS.length) % OPTIONS.length;
    setAlignment(OPTIONS[nextIndex].id);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Site alignment"
      className="bg-[var(--glass-fill)] border border-[var(--stroke-glass)] backdrop-blur-md rounded-full p-1 flex gap-1"
    >
      {OPTIONS.map((option, index) => {
        const isActive = alignment === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.label}
            tabIndex={isActive ? 0 : -1}
            onClick={() => setAlignment(option.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={{ color: isActive ? "var(--surface-0)" : "var(--text-muted)" }}
          >
            {isActive && (
              <motion.span
                layoutId="alignment-pill"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: "var(--accent-primary)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              aria-hidden="true"
              className="relative z-10 w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: SWATCH_COLORS[option.id] }}
            />
            <span className="relative z-10 hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
