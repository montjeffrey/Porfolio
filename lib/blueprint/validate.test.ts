import { describe, expect, it } from "vitest";
import { fieldServiceCrm } from "./graphs/field-service-crm";
import type { BlueprintGraph } from "./types";
import { validateGraph } from "./validate";

describe("validateGraph", () => {
  it("validates the field-service graph clean", () => {
    expect(validateGraph(fieldServiceCrm)).toEqual([]);
  });

  it("reports exactly one problem for a dangling edge", () => {
    const graph: BlueprintGraph = {
      id: "dangling",
      title: "Dangling edge graph",
      nodes: [
        { id: "a", kind: "source", label: "A", position: { col: 1, row: 1 } },
        { id: "b", kind: "sink", label: "B", position: { col: 2, row: 1 } },
      ],
      edges: [
        { from: "a", to: "b", label: "ok", pulse: "steady" },
        { from: "a", to: "ghost", label: "broken", pulse: "steady" },
      ],
    };

    const problems = validateGraph(graph);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain("ghost");
  });
});
