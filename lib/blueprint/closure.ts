import type { BlueprintGraph } from "./types";

export function connectedClosure(g: BlueprintGraph, nodeId: string): Set<string> {
  const visited = new Set<string>();
  if (!g.nodes.some((n) => n.id === nodeId)) {
    return visited;
  }

  const queue: string[] = [nodeId];
  visited.add(nodeId);

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const edge of g.edges) {
      if (edge.from === current && !visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push(edge.to);
      }
      if (edge.to === current && !visited.has(edge.from)) {
        visited.add(edge.from);
        queue.push(edge.from);
      }
    }
  }

  return visited;
}
