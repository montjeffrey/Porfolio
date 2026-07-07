"use client";

import { useEffect, useState } from "react";
import { connectedClosure } from "@/lib/blueprint/closure";
import { canvasSize, edgePath, nodeRect } from "@/lib/blueprint/layout";
import type { BlueprintGraph } from "@/lib/blueprint/types";
import NodeGlyph from "./NodeGlyph";
import NodeInspector from "./NodeInspector";

interface BlueprintCanvasProps {
  graph: BlueprintGraph;
}

export default function BlueprintCanvas({ graph }: BlueprintCanvasProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { w, h } = canvasSize(graph);
  const nodesById = new Map(graph.nodes.map((n) => [n.id, n]));
  const closure = selectedId ? connectedClosure(graph, selectedId) : null;

  return (
    <div className="relative overflow-x-auto">
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        onClick={() => setSelectedId(null)}
      >
        {graph.edges.map((edge) => {
          const from = nodesById.get(edge.from);
          const to = nodesById.get(edge.to);
          if (!from || !to) return null;

          const fromRect = nodeRect(from);
          const toRect = nodeRect(to);
          const midX = (fromRect.x + fromRect.w + toRect.x) / 2;
          const midY = (fromRect.y + fromRect.h / 2 + toRect.y + toRect.h / 2) / 2;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <path
                d={edgePath(from, to)}
                stroke="var(--stroke-glass)"
                strokeWidth={1.5}
                fill="none"
              />
              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                fontFamily="monospace"
                fontSize={10}
                fill="var(--text-muted)"
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {graph.nodes.map((node) => (
          <NodeGlyph
            key={node.id}
            node={node}
            selected={selectedId === node.id}
            dimmed={closure !== null && !closure.has(node.id)}
            onSelect={(id) => setSelectedId(id)}
          />
        ))}
      </svg>

      <NodeInspector
        node={selectedId ? nodesById.get(selectedId) ?? null : null}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
