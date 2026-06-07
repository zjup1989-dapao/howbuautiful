import type { OutfitCandidate } from "./types";

type CandidateOverride = {
  assets: OutfitCandidate["assets"];
  tuning: Pick<OutfitCandidate["tuning"], "saturation" | "formality">;
};

export function applyTuningToCandidate(candidate: OutfitCandidate, override: CandidateOverride): OutfitCandidate {
  return {
    ...candidate,
    assets: override.assets,
    tuning: {
      ...candidate.tuning,
      saturation: override.tuning.saturation,
      formality: override.tuning.formality,
    },
  };
}
