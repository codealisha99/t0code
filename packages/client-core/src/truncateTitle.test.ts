import { describe, expect, it } from "vitest";
import { DEFAULT_THREAD_TITLE, truncateTitle, truncateTitleForDisplay } from "./truncateTitle";

describe("truncateTitle", () => {
  it("trims whitespace", () => {
    expect(truncateTitle("  hello  ")).toBe("hello");
  });

  it("returns trimmed when at limit", () => {
    expect(truncateTitle("abc", 3)).toBe("abc");
  });

  it("truncates with ellipsis", () => {
    expect(truncateTitle("abcdef", 3)).toBe("abc...");
  });

  it("defaults to 50", () => {
    const long = "a".repeat(60);
    expect(truncateTitle(long)).toBe(`${"a".repeat(50)}...`);
  });

  it("empty stays empty", () => {
    expect(truncateTitle("   ")).toBe("");
  });
});

describe("truncateTitleForDisplay", () => {
  it("delegates to truncateTitle", () => {
    expect(truncateTitleForDisplay("abcdef", 3)).toBe("abc...");
  });

  it("default title constant", () => {
    expect(DEFAULT_THREAD_TITLE).toBe("New thread");
  });
});
