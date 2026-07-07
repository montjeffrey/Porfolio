import type { BlueprintGraph } from "./types";

export function validateGraph(g: BlueprintGraph): string[] {
  const problems: string[] = [];

  const ids = g.nodes.map((n) => n.id);
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      problems.push(`duplicate node id: "${id}"`);
    }
    seen.add(id);
  }

  for (const edge of g.edges) {
    if (!seen.has(edge.from)) {
      problems.push(`edge references unknown node id: "${edge.from}"`);
    }
    if (!seen.has(edge.to)) {
      problems.push(`edge references unknown node id: "${edge.to}"`);
    }
    if (edge.from === edge.to) {
      problems.push(`edge is self-referential: "${edge.from}"`);
    }
  }

  for (const node of g.nodes) {
    const { col, row } = node.position;
    if (col < 1 || col > 6) {
      problems.push(`node "${node.id}" has out-of-range column: ${col}`);
    }
    if (row < 1 || row > 4) {
      problems.push(`node "${node.id}" has out-of-range row: ${row}`);
    }
  }

  return problems;
}
