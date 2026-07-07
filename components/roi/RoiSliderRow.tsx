"use client";

import { useRoiStore } from "@/lib/roi/store";
import { ROI_BOUNDS, type RoiInputs } from "@/lib/roi/types";

interface RoiSliderRowProps {
  inputKey: keyof RoiInputs;
  label: string;
  unit: string;
  format?: (v: number) => string;
}

export default function RoiSliderRow({ inputKey, label, unit, format }: RoiSliderRowProps) {
  const value = useRoiStore((state) => state.inputs[inputKey]);
  const setInput = useRoiStore((state) => state.setInput);
  const bounds = ROI_BOUNDS[inputKey];

  const formatted = format ? format(value) : String(value);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={`roi-${inputKey}`} className="text-sm text-[var(--text-muted)]">
          {label}
        </label>
        <span className="font-mono text-sm text-[var(--text-primary)]">
          {formatted}
          {unit}
        </span>
      </div>
      <input
        id={`roi-${inputKey}`}
        type="range"
        min={bounds.min}
        max={bounds.max}
        step={bounds.step}
        value={value}
        onChange={(e) => setInput(inputKey, Number(e.target.value))}
        aria-valuetext={`${formatted}${unit}`}
        className="w-full accent-[var(--accent-primary)]"
      />
    </div>
  );
}
