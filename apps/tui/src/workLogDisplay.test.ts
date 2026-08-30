import { describe, expect, it } from "vitest";

import {
  capitalizePhrase,
  normalizeCompactToolLabel,
  workEntryDisplayText,
} from "./workLogDisplay";

describe("workLogDisplay", () => {
  it("capitalizes headings and strips complete suffixes", () => {
    expect(capitalizePhrase("read file")).toBe("Read file");
    expect(normalizeCompactToolLabel("Read file complete")).toBe("Read file");
  });

  it("joins heading and command preview", () => {
    expect(
      workEntryDisplayText({
        id: "1",
        createdAt: "2026-01-01T00:00:00.000Z",
        label: "run command complete",
        command: "bun test",
        tone: "tool",
      }),
    ).toBe("Run command - bun test");
  });
});
