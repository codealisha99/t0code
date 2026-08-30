import { describe, expect, it } from "vitest";

import {
  detectTrailingComposerPathTrigger,
  inferMentionKindFromPath,
  mergeChatAttachments,
  replaceComposerTextRange,
  stripMentionTokensFromText,
} from "./composerMentions";

describe("detectTrailingComposerPathTrigger", () => {
  it("reads a trailing @mention query", () => {
    expect(detectTrailingComposerPathTrigger("look at @src/app")).toEqual({
      query: "src/app",
      rangeStart: 8,
      rangeEnd: 16,
    });
  });

  it("returns null when the last token is not a mention", () => {
    expect(detectTrailingComposerPathTrigger("look at src")).toBeNull();
  });
});

describe("stripMentionTokensFromText", () => {
  it("extracts path mentions and leaves the remaining body", () => {
    expect(stripMentionTokensFromText("see @src/ui.tsx please")).toEqual({
      mentions: [{ type: "path", path: "src/ui.tsx", kind: "file" }],
      body: "see please",
    });
  });
});

describe("replaceComposerTextRange", () => {
  it("replaces the selected token", () => {
    expect(replaceComposerTextRange("see @src", 4, 8, "@apps/tui")).toBe("see @apps/tui");
  });
});

describe("inferMentionKindFromPath", () => {
  it("treats dotted basenames as files", () => {
    expect(inferMentionKindFromPath("apps/tui/src/ui.tsx")).toBe("file");
    expect(inferMentionKindFromPath("apps/tui/src")).toBe("directory");
  });
});

describe("mergeChatAttachments", () => {
  it("dedupes by id or draft signature", () => {
    const left = {
      type: "image" as const,
      name: "a.png",
      mimeType: "image/png",
      sizeBytes: 12,
      dataUrl: "data:image/png;base64,aa",
      id: "one",
    };
    const right = { ...left, name: "b.png" };
    expect(mergeChatAttachments([left], [right])).toHaveLength(1);
  });
});
