"use client";

import Link from "next/link";
import type { BlueprintNode } from "@/lib/blueprint/types";

interface NodeInspectorProps {
  node: BlueprintNode | null;
  onClose: () => void;
}

export default function NodeInspector({ node, onClose }: NodeInspectorProps) {
  if (!node) return null;

  return (
    <div
      className="absolute inset-x-0 bottom-0 md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:w-80
        bg-[var(--glass-fill)] border border-[var(--stroke-glass)] backdrop-blur-md
        rounded-t-2xl md:rounded-2xl p-6 z-20"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-xl font-serif" style={{ color: "var(--text-primary)" }}>
          {node.label}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close inspector"
          className="text-lg leading-none opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: "var(--text-primary)" }}
        >
          ×
        </button>
      </div>

      {node.detail && (
        <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {node.detail}
        </p>
      )}

      {node.metrics && (
        <dl className="font-mono text-sm space-y-1 mb-6">
          {Object.entries(node.metrics).map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <dt style={{ color: "var(--text-muted)" }}>{key}</dt>
              <dd style={{ color: "var(--text-primary)" }}>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <Link
        href="/#roi"
        className="inline-flex items-center gap-2 font-semibold"
        style={{ color: "var(--accent-primary)" }}
      >
        Model your version →
      </Link>
    </div>
  );
}
