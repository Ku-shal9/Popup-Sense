import { describe, it, expect } from "vitest";
import {
  parsePopupDecision,
  type PopupDecision,
} from "../../src/core/engine/decision-schema";

describe("parsePopupDecision (Unit / Seam Verification)", () => {
  it("successfully parses valid structured JSON output from an open-weight AI model", () => {
    const rawAiOutput = JSON.stringify({
      action: "ALLOW",
      riskScore: 0.05,
      category: "AUTH_OAUTH",
      confidence: 0.95,
      reasoning: "Authentic Google OAuth endpoint initiated via recent user click gesture",
      modelId: "llama3.2:3b",
    });

    const decision: PopupDecision = parsePopupDecision(rawAiOutput);

    expect(decision).toEqual({
      action: "ALLOW",
      riskScore: 0.05,
      category: "AUTH_OAUTH",
      confidence: 0.95,
      reasoning: "Authentic Google OAuth endpoint initiated via recent user click gesture",
      modelId: "llama3.2:3b",
      consumedAt: "src/core/engine/decision-schema.ts:parsePopupDecision",
    });
  });

  it("handles markdown code fences (```json ... ```) produced by LLMs", () => {
    const fencedOutput = "```json\n" + JSON.stringify({
      action: "BLOCK",
      riskScore: 0.88,
      category: "CLICKJACKING",
      confidence: 0.92,
      reasoning: "Invisible full-page overlay intercepting clicks with no user request",
      modelId: "qwen2.5:3b",
    }) + "\n```";

    const decision = parsePopupDecision(fencedOutput);
    expect(decision.action).toBe("BLOCK");
    expect(decision.category).toBe("CLICKJACKING");
    expect(decision.riskScore).toBe(0.88);
  });

  it("safely falls back to QUARANTINE_PROMPT when JSON is malformed or missing required keys", () => {
    const malformedOutput = "I think this is an ad popup so you should probably block it.";

    const decision = parsePopupDecision(malformedOutput);

    expect(decision.action).toBe("QUARANTINE_PROMPT");
    expect(decision.category).toBe("AMBIGUOUS_UNKNOWN");
    expect(decision.riskScore).toBe(0.5);
    expect(decision.reasoning).toContain("Fallback triggered");
  });
});
