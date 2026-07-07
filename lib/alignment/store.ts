import { create } from "zustand";

export type AlignmentId = "ember" | "meridian" | "atelier";

interface AlignmentState {
  alignment: AlignmentId;
  setAlignment: (id: AlignmentId) => void;
}

const ALIGNMENT_IDS: AlignmentId[] = ["ember", "meridian", "atelier"];

function getInitialAlignment(): AlignmentId {
  if (typeof window === "undefined") return "ember";
  try {
    const stored = localStorage.getItem("mj.alignment");
    if (stored && (ALIGNMENT_IDS as string[]).includes(stored)) {
      return stored as AlignmentId;
    }
  } catch {
    // ignore storage access errors
  }
  return "ember";
}

export const useAlignmentStore = create<AlignmentState>((set) => ({
  alignment: getInitialAlignment(),
  setAlignment: (id) => {
    set({ alignment: id });
    if (typeof document !== "undefined") {
      document.documentElement.dataset.alignment = id;
    }
    try {
      localStorage.setItem("mj.alignment", id);
    } catch {
      // ignore storage access errors
    }
  },
}));
