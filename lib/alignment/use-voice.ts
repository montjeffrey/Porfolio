"use client";

import { useAlignmentStore, type AlignmentId } from "@/lib/alignment/store";
import { getCopy, type Voice } from "@/lib/alignment/voice";

const ALIGNMENT_TO_VOICE: Record<AlignmentId, Voice> = {
  ember: "operator",
  meridian: "boardroom",
  atelier: "studio",
};

export function useVoice(key: string): string {
  const alignment = useAlignmentStore((state) => state.alignment);
  const voice = ALIGNMENT_TO_VOICE[alignment];
  return getCopy(key, voice);
}
