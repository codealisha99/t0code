import { describe, expect, it } from "vitest";

import { pruneLocalThreadVisitedState, pruneLocallyUnreadThreadIds } from "./threadVisited";

describe("pruneLocalThreadVisitedState", () => {
  it("drops ids that are no longer live", () => {
    const current = {
      "thread-1": "2026-01-01T00:00:00.000Z",
      "thread-2": "2026-01-02T00:00:00.000Z",
    };
    expect(pruneLocalThreadVisitedState(current, new Set(["thread-1"]))).toEqual({
      "thread-1": "2026-01-01T00:00:00.000Z",
    });
  });

  it("returns the same object when nothing changed", () => {
    const current = { "thread-1": "2026-01-01T00:00:00.000Z" };
    expect(pruneLocalThreadVisitedState(current, new Set(["thread-1"]))).toBe(current);
  });
});

describe("pruneLocallyUnreadThreadIds", () => {
  it("keeps only live unread ids", () => {
    expect([...pruneLocallyUnreadThreadIds(new Set(["a", "b"]), new Set(["a"]))]).toEqual(["a"]);
  });
});
