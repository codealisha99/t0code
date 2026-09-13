export interface FollowUpQueueItem {
  readonly id: string;
  readonly threadId: string;
  readonly text: string;
  readonly createdAt: string;
}

export function enqueueFollowUp(
  queue: readonly FollowUpQueueItem[],
  item: FollowUpQueueItem,
): FollowUpQueueItem[] {
  return [...queue, item];
}

export function followUpsForThread(
  queue: readonly FollowUpQueueItem[],
  threadId: string | null | undefined,
): FollowUpQueueItem[] {
  if (!threadId) {
    return [];
  }
  return queue.filter((item) => item.threadId === threadId);
}

export function takeNextFollowUp(
  queue: readonly FollowUpQueueItem[],
  threadId: string | null | undefined,
): { readonly next: FollowUpQueueItem | null; readonly remaining: FollowUpQueueItem[] } {
  if (!threadId) {
    return { next: null, remaining: [...queue] };
  }
  const index = queue.findIndex((item) => item.threadId === threadId);
  if (index < 0) {
    return { next: null, remaining: [...queue] };
  }
  return {
    next: queue[index] ?? null,
    remaining: queue.filter((_, itemIndex) => itemIndex !== index),
  };
}

export function removeFollowUp(
  queue: readonly FollowUpQueueItem[],
  id: string,
): FollowUpQueueItem[] {
  return queue.filter((item) => item.id !== id);
}

export function clearFollowUpsForThread(
  queue: readonly FollowUpQueueItem[],
  threadId: string | null | undefined,
): FollowUpQueueItem[] {
  if (!threadId) {
    return [...queue];
  }
  return queue.filter((item) => item.threadId !== threadId);
}
