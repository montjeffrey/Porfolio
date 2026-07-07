import { create } from "zustand";
import { computeRoi } from "./model";
import { ROI_BOUNDS, ROI_DEFAULTS, type RoiInputs, type RoiOutputs } from "./types";

interface RoiState {
  inputs: RoiInputs;
  outputs: RoiOutputs;
  setInput: (key: keyof RoiInputs, value: number) => void;
  reset: () => void;
}

function clamp(key: keyof RoiInputs, value: number): number {
  const { min, max } = ROI_BOUNDS[key];
  return Math.min(Math.max(value, min), max);
}

export const useRoiStore = create<RoiState>((set) => ({
  inputs: ROI_DEFAULTS,
  outputs: computeRoi(ROI_DEFAULTS),
  setInput: (key, value) =>
    set((state) => {
      const inputs = { ...state.inputs, [key]: clamp(key, value) };
      return { inputs, outputs: computeRoi(inputs) };
    }),
  reset: () => set({ inputs: ROI_DEFAULTS, outputs: computeRoi(ROI_DEFAULTS) }),
}));
