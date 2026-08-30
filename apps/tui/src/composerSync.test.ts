import { describe, expect, it, vi } from "vitest";
import {
  createDeferredComposerSyncState,
  invalidateDeferredComposerSync,
  scheduleDeferredComposerSync,
} from "./composerSync";

describe("composerSync", () => {
  it("runs only the latest scheduled sync", () => {
    vi.useFakeTimers();
    try {
      const state = createDeferredComposerSyncState();
      const sync = vi.fn();

      scheduleDeferredComposerSync({ state, onSync: () => sync("first") });
      scheduleDeferredComposerSync({ state, onSync: () => sync("second") });

      vi.runAllTimers();

      expect(sync).toHaveBeenCalledTimes(1);
      expect(sync).toHaveBeenCalledWith("second");
    } finally {
      vi.useRealTimers();
    }
  });

  it("drops a scheduled sync after invalidation", () => {
    vi.useFakeTimers();
    try {
      const state = createDeferredComposerSyncState();
      const sync = vi.fn();

      scheduleDeferredComposerSync({ state, onSync: sync });
      invalidateDeferredComposerSync(state);

      vi.runAllTimers();

      expect(sync).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});
