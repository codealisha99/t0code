import { describe, expect, it } from "vitest";

import { resolveComposerPrimaryAction } from "./composerAction";

describe("resolveComposerPrimaryAction", () => {
  it("queues the next prompt while a thread is running if the composer has content", () => {
    expect(
      resolveComposerPrimaryAction({
        activeThreadIsRunning: true,
        hasSendableContent: true,
      }),
    ).toBe("queue");
  });

  it("uses stop only when the thread is running and the composer is empty", () => {
    expect(
      resolveComposerPrimaryAction({
        activeThreadIsRunning: true,
        hasSendableContent: false,
      }),
    ).toBe("stop");
  });

  it("uses send when the thread is idle", () => {
    expect(
      resolveComposerPrimaryAction({
        activeThreadIsRunning: false,
        hasSendableContent: false,
      }),
    ).toBe("send");
  });
});
