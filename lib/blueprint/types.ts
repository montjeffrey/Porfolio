export type NodeKind = "source" | "process" | "store" | "decision" | "sink";

export type PulseKind = "steady" | "burst" | "rare";

export interface BlueprintNode {
  id: string;
  kind: NodeKind;
  label: string;
  detail?: string;
  metrics?: Record<string, string>;
  position: { col: number; row: number };
}

export interface BlueprintEdge {
  from: string;
  to: string;
  label: string;
  pulse: PulseKind;
}

export interface BlueprintGraph {
  id: string;
  title: string;
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
}
