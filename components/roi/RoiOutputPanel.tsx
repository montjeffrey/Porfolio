"use client";

import { useRoiStore } from "@/lib/roi/store";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function RoiOutputPanel() {
  const outputs = useRoiStore((state) => state.outputs);
  const isNegative = outputs.netAnnualSavings < 0;

  return (
    <div>
      <p className="text-sm text-[var(--text-muted)] mb-2">Projected net savings, year one</p>
      <p
        className="font-mono text-5xl md:text-6xl font-bold"
        style={{ color: isNegative ? "var(--accent-primary)" : "var(--accent-success)" }}
      >
        {usdFormatter.format(outputs.netAnnualSavings)}
      </p>
      <p className="text-sm text-[var(--text-muted)] mt-2">
        {isNegative
          ? "At this scale, automation may not pay for itself yet — move the sliders to find your threshold."
          : "Based on your current inputs, after implementation cost."}
      </p>

      <div className="mt-8 space-y-4 border-t border-[var(--stroke-glass)] pt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">Hours reclaimed / yr</span>
          <span className="font-mono text-sm text-[var(--text-primary)]">
            {outputs.recoverableHoursPerYear}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">Gross savings</span>
          <span className="font-mono text-sm text-[var(--text-primary)]">
            {usdFormatter.format(outputs.grossAnnualSavings)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">Payback</span>
          <span className="font-mono text-sm text-[var(--text-primary)]">
            {outputs.paybackMonths === Infinity ? "—" : `${outputs.paybackMonths} mo`}
          </span>
        </div>
      </div>
    </div>
  );
}
