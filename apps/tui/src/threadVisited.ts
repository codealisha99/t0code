export type LocalThreadVisitedState = Readonly<Record<string, string>>;

export function pruneLocalThreadVisitedState(
  visitedByThreadId: LocalThreadVisitedState,
  threadIds: ReadonlySet<string>,
): LocalThreadVisitedState {
  let changed = false;
  const next: Record<string, string> = {};
  for (const [threadId, visitedAt] of Object.entries(visitedByThreadId)) {
    if (!threadIds.has(threadId)) {
      changed = true;
      continue;
    }
    next[threadId] = visitedAt;
  }
  return changed ? next : visitedByThreadId;
}

export function pruneLocallyUnreadThreadIds(
  unreadThreadIds: ReadonlySet<string>,
  threadIds: ReadonlySet<string>,
): ReadonlySet<string> {
  let changed = false;
  const next = new Set<string>();
  for (const threadId of unreadThreadIds) {
    if (!threadIds.has(threadId)) {
      changed = true;
      continue;
    }
    next.add(threadId);
  }
  return changed ? next : unreadThreadIds;
}
