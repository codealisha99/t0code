export type DeferredComposerSyncState = {
  version: number;
  timeoutId: ReturnType<typeof setTimeout> | null;
};

export function createDeferredComposerSyncState(): DeferredComposerSyncState {
  return {
    version: 0,
    timeoutId: null,
  };
}

export function invalidateDeferredComposerSync(
  state: DeferredComposerSyncState,
  clearTimeoutImpl: typeof clearTimeout = clearTimeout,
): void {
  state.version += 1;
  if (state.timeoutId !== null) {
    clearTimeoutImpl(state.timeoutId);
    state.timeoutId = null;
  }
}

export function scheduleDeferredComposerSync(input: {
  state: DeferredComposerSyncState;
  onSync: () => void;
  setTimeoutImpl?: typeof setTimeout;
  clearTimeoutImpl?: typeof clearTimeout;
}): void {
  const { state, onSync, setTimeoutImpl = setTimeout, clearTimeoutImpl = clearTimeout } = input;
  const capturedVersion = state.version;
  if (state.timeoutId !== null) {
    clearTimeoutImpl(state.timeoutId);
  }
  state.timeoutId = setTimeoutImpl(() => {
    state.timeoutId = null;
    if (capturedVersion !== state.version) {
      return;
    }
    onSync();
  }, 0);
}
