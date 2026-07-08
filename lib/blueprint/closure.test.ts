import { describe, expect, it } from "vitest";
import { connectedClosure } from "./closure";
import { fieldServiceCrm } from "./graphs/field-service-crm";
import type { BlueprintGraph } from "./types";

const ALL_FIELD_SERVICE_IDS = [
  "tech-mobile",
  "ingest-api",
  "crm-core",
  "routing-engine",
  "admin-dash",
];

describe("connectedClosure", () => {
  it("closure of crm-core contains all 5 ids", () => {
    const closure = connectedClosure(fieldServiceCrm, "crm-core");
    expect([...closure].sort()).toEqual([...ALL_FIELD_SERVICE_IDS].sort());
  });

  it("closure of tech-mobile contains all 5 ids", () => {
    const closure = connectedClosure(fieldServiceCrm, "tech-mobile");
    expect([...closure].sort()).toEqual([...ALL_FIELD_SERVICE_IDS].sort());
  });

  it("returns only the reachable island for a two-island graph", () => {
    const islands: BlueprintGraph = {
      id: "islands",
      title: "Two islands",
      nodes: [
        { id: "a", kind: "source", label: "A", position: { col: 1, row: 1 } },
        { id: "b", kind: "sink", label: "B", position: { col: 2, row: 1 } },
        { id: "x", kind: "source", label: "X", position: { col: 1, row: 3 } },
        { id: "y", kind: "sink", label: "Y", position: { col: 2, row: 3 } },
      ],
      edges: [
        { from: "a", to: "b", label: "a-to-b", pulse: "steady" },
        { from: "x", to: "y", label: "x-to-y", pulse: "steady" },
      ],
    };

    const closure = connectedClosure(islands, "a");
    expect([...closure].sort()).toEqual(["a", "b"]);
  });
});
