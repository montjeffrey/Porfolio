"use client";

import { nodeRect } from "@/lib/blueprint/layout";
import type { BlueprintNode, NodeKind } from "@/lib/blueprint/types";

const KIND_ACCENT: Record<NodeKind, string> = {
  source: "var(--accent-info)",
  process: "var(--text-muted)",
  store: "var(--accent-data)",
  decision: "var(--accent-primary)",
  sink: "var(--accent-success)",
};

interface NodeGlyphProps {
  node: BlueprintNode;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string) => void;
}

export default function NodeGlyph({ node, selected, dimmed, onSelect }: NodeGlyphProps) {
  const rect = nodeRect(node);
  const accent = KIND_ACCENT[node.kind];

  const handleKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter") {
      onSelect(node.id);
    }
  };

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={node.label}
      onClick={() => onSelect(node.id)}
      onKeyDown={handleKeyDown}
      opacity={dimmed ? 0.25 : 1}
      style={{ cursor: "pointer" }}
    >
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.w}
        height={rect.h}
        rx={12}
        fill="var(--surface-1)"
        stroke={accent}
        strokeWidth={selected ? 2.5 : 1.25}
      />
      <text
        x={rect.x + rect.w / 2}
        y={rect.y + rect.h / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="monospace"
        fontSize={12}
        fill="var(--text-primary)"
      >
        {node.label}
      </text>
    </g>
  );
}
