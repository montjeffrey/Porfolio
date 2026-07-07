import type { BlueprintGraph, BlueprintNode } from "./types";

export const CELL_W = 220;
export const CELL_H = 140;
export const NODE_W = 176;
export const NODE_H = 88;

export function nodeRect(n: BlueprintNode): { x: number; y: number; w: number; h: number } {
  const { col, row } = n.position;
  return {
    x: (col - 1) * CELL_W + (CELL_W - NODE_W) / 2,
    y: (row - 1) * CELL_H + (CELL_H - NODE_H) / 2,
    w: NODE_W,
    h: NODE_H,
  };
}

export function edgePath(from: BlueprintNode, to: BlueprintNode): string {
  const fromRect = nodeRect(from);
  const toRect = nodeRect(to);

  const x1 = fromRect.x + fromRect.w;
  const y1 = fromRect.y + fromRect.h / 2;
  const x2 = toRect.x;
  const y2 = toRect.y + toRect.h / 2;

  const offset = CELL_W * 0.4;

  return `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
}

export function canvasSize(g: BlueprintGraph): { w: number; h: number } {
  const maxCol = g.nodes.reduce((max, n) => Math.max(max, n.position.col), 0);
  const maxRow = g.nodes.reduce((max, n) => Math.max(max, n.position.row), 0);
  return { w: maxCol * CELL_W, h: maxRow * CELL_H };
}
