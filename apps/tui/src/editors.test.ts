import { describe, expect, it } from "vitest";

import {
  hasAvailableFileManager,
  resolvePreferredCodeEditor,
  resolvePreferredEditor,
} from "./editors";

describe("resolvePreferredEditor", () => {
  it("prefers the first editor and skips the file manager for code", () => {
    expect(resolvePreferredEditor(["file-manager", "vscode"])).toBe("file-manager");
    expect(resolvePreferredCodeEditor(["file-manager", "vscode"])).toBe("vscode");
    expect(hasAvailableFileManager(["vscode"])).toBe(false);
  });
});
