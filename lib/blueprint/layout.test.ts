import { describe, expect, it } from "vitest";
import { edgePath, nodeRect } from "./layout";
import type { BlueprintNode } from "./types";

const col1Row1: BlueprintNode = {
  id: "n1",
  kind: "source",
  label: "N1",
  position: { col: 1, row: 1 },
};

const col2Row1: BlueprintNode = {
  id: "n2",
  kind: "sink",
  label: "N2",
  position: { col: 2, row: 1 },
};

describe("layout geometry", () => {
  it("computes nodeRect for a col1/row1 node", () => {
    expect(nodeRect(col1Row1)).toEqual({ x: 22, y: 26, w: 176, h: 88 });
  });

  it("computes an edgePath starting at the right-center anchor", () => {
    expect(edgePath(col1Row1, col2Row1).startsWith("M 198")).toBe(true);
  });
});
