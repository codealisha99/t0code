import { describe, expect, it } from "vitest";

import { parseDiffFiles, summarizeDiffPatch } from "./diffParse";

const SAMPLE_DIFF = `diff --git a/src/a.ts b/src/a.ts
index 1111111..2222222 100644
--- a/src/a.ts
+++ b/src/a.ts
@@ -1,2 +1,3 @@
 keep
-old
+new
+added
`;

describe("summarizeDiffPatch", () => {
  it("counts added and removed lines", () => {
    expect(summarizeDiffPatch("+++ b/file\n--- a/file\n+one\n-two\n keep")).toEqual({
      addedLines: 1,
      removedLines: 1,
    });
  });
});

describe("parseDiffFiles", () => {
  it("splits unified diffs by file", () => {
    const files = parseDiffFiles(SAMPLE_DIFF);
    expect(files).toHaveLength(1);
    expect(files[0]?.filePath).toBe("src/a.ts");
    expect(files[0]?.addedLines).toBeGreaterThan(0);
    expect(files[0]?.removedLines).toBeGreaterThan(0);
  });

  it("returns an empty list for blank input", () => {
    expect(parseDiffFiles("   ")).toEqual([]);
  });
});
