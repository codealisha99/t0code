import { describe, expect, it } from "vitest";

import {
  composerTraitsLabel,
  getDispatchModelOptions,
  interactionLabel,
  modelControlLabel,
  providerPickerIcon,
  runtimeFooterLabel,
} from "./composerLabels";

describe("composerLabels", () => {
  it("labels interaction and runtime modes", () => {
    expect(interactionLabel("plan")).toBe("Plan");
    expect(runtimeFooterLabel("full-access")).toBe("Full access");
  });

  it("uses known Claude short names", () => {
    expect(modelControlLabel("claudeAgent", "claude-opus-4-6")).toBe("Opus 4.6");
  });

  it("maps coming-soon provider icons", () => {
    expect(providerPickerIcon("gemini")).toBe("◇");
  });

  it("formats Codex traits", () => {
    expect(
      composerTraitsLabel("codex", "gpt-5.3-codex", "", {
        codex: { reasoningEffort: "high", fastMode: true },
      }),
    ).toContain("Fast");
  });

  it("does not attach Claude options to Cursor dispatch", () => {
    expect(
      getDispatchModelOptions("cursor", "auto", { claudeAgent: { effort: "max" } }),
    ).toBeUndefined();
  });
});
