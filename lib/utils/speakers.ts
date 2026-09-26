import type { Participant } from "@/lib/types";

/**
 * Categorical speaker colours (validated: adjacent CVD ΔE ≥ 9.1, normal-vision ΔE ≥ 19.6
 * on white). Assigned in participant order, never by rank, so a person keeps their
 * colour everywhere. Three slots are under 3:1 contrast on white, so speaker marks are
 * always shipped with a visible name label or a table view.
 */
export const SPEAKER_PALETTE = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"];

export function speakerColors(participants: Participant[]): Map<string, string> {
  return new Map(participants.map((p, i) => [p.name, SPEAKER_PALETTE[i % SPEAKER_PALETTE.length]]));
}
