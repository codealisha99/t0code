import { describe, expect, it } from "vitest";

import { scoreDirectorySuggestion } from "./directorySuggestions";

describe("scoreDirectorySuggestion", () => {
  it("ranks exact and prefix matches above substring matches", () => {
    expect(scoreDirectorySuggestion("/src/t1code", "t1code")).toBe(4);
    expect(scoreDirectorySuggestion("/src/t1code-extra", "t1")).toBe(3);
    expect(scoreDirectorySuggestion("/src/playground", "play")).toBe(3);
    expect(scoreDirectorySuggestion("/src/my-playground", "play")).toBe(2);
  });
});
