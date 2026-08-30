import { describe, expect, it } from "vitest";

import { commandPaletteTextMatches, type CommandPaletteItem } from "./commandPalette";

const item: CommandPaletteItem = {
  id: "settings",
  section: "Actions",
  icon: "󰒓",
  label: "Open settings",
  description: "Theme and providers",
  keywords: ["prefs", "config"],
};

describe("commandPaletteTextMatches", () => {
  it("matches all query tokens against label, description, and keywords", () => {
    expect(commandPaletteTextMatches(item, "")).toBe(true);
    expect(commandPaletteTextMatches(item, "open prefs")).toBe(true);
    expect(commandPaletteTextMatches(item, "missing token")).toBe(false);
  });
});
