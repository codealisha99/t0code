import { describe, expect, it, vi } from "vitest";

import { createCoalescedRefreshRunner } from "./snapshotRefresh";

const NOOP = (): void => undefined;

describe("snapshotRefresh", () => {
  it("runs one trailing refresh after in-flight requests finish", async () => {
    let resolveFirst: () => void = NOOP;
    let capturedFirstResolver = false;
    const calls: string[] = [];
    const refresh = vi.fn(
      (reason: string) =>
        new Promise<void>((resolve) => {
          calls.push(reason);
          if (reason === "initial") {
            resolveFirst = resolve;
            capturedFirstResolver = true;
            return;
          }
          resolve();
        }),
    );
    const run = createCoalescedRefreshRunner(refresh);

    const firstRun = run("initial");
    await Promise.resolve();
    const secondRun = run("domain-event");
    const thirdRun = run("domain-event-2");

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(["initial"]);

    expect(capturedFirstResolver).toBe(true);
    resolveFirst();
    await firstRun;
    await Promise.all([secondRun, thirdRun]);

    expect(refresh).toHaveBeenCalledTimes(2);
    expect(calls).toEqual(["initial", "domain-event-2"]);
  });

  it("allows a new refresh after the queue drains", async () => {
    const refresh = vi.fn(async (_reason: string) => undefined);
    const run = createCoalescedRefreshRunner(refresh);

    await run("initial");
    await run("domain-event");

    expect(refresh).toHaveBeenCalledTimes(2);
    expect(refresh).toHaveBeenNthCalledWith(1, "initial");
    expect(refresh).toHaveBeenNthCalledWith(2, "domain-event");
  });
});
