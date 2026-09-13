import { describe, expect, it } from "vitest";

import {
  clearFollowUpsForThread,
  enqueueFollowUp,
  followUpsForThread,
  removeFollowUp,
  takeNextFollowUp,
  type FollowUpQueueItem,
} from "./followUpQueue";

function item(id: string, threadId: string, text = id): FollowUpQueueItem {
  return { id, threadId, text, createdAt: "2026-01-01T00:00:00.000Z" };
}

describe("followUpQueue", () => {
  it("enqueues and filters by thread", () => {
    const queue = enqueueFollowUp([item("a", "t1")], item("b", "t2"));

    expect(followUpsForThread(queue, "t1").map((entry) => entry.id)).toEqual(["a"]);
    expect(followUpsForThread(queue, "t2").map((entry) => entry.id)).toEqual(["b"]);
  });

  it("takes the oldest follow-up for a thread", () => {
    const queue = [item("a", "t1", "first"), item("b", "t2"), item("c", "t1", "second")];
    const { next, remaining } = takeNextFollowUp(queue, "t1");

    expect(next?.text).toBe("first");
    expect(remaining.map((entry) => entry.id)).toEqual(["b", "c"]);
  });

  it("removes one item or clears a thread", () => {
    const queue = [item("a", "t1"), item("b", "t2"), item("c", "t1")];

    expect(removeFollowUp(queue, "b").map((entry) => entry.id)).toEqual(["a", "c"]);
    expect(clearFollowUpsForThread(queue, "t1").map((entry) => entry.id)).toEqual(["b"]);
  });
});
