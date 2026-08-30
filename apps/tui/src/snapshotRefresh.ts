export function createCoalescedRefreshRunner(
  runRefresh: (reason: string) => Promise<void>,
): (reason: string) => Promise<void> {
  let running = false;
  let pendingReason: string | null = null;

  return async (reason: string) => {
    if (running) {
      pendingReason = reason;
      return;
    }

    running = true;
    let nextReason: string | null = reason;

    try {
      while (nextReason) {
        const currentReason = nextReason;
        nextReason = null;
        await runRefresh(currentReason);

        if (pendingReason) {
          nextReason = pendingReason;
          pendingReason = null;
        }
      }
    } finally {
      running = false;
    }
  };
}
