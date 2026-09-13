/**
 * Zustand store for sidebar thread multi-selection state.
 *
 * Supports Cmd/Ctrl+Click (toggle individual), Shift+Click (range select),
 * and bulk actions on the selected set.
 */

import type { ThreadId } from "@t3tools/contracts";
import {
  clearThreadSelection as coreClearThreadSelection,
  rangeSelectThreads as coreRangeSelectThreads,
  removeFromThreadSelection as coreRemoveFromThreadSelection,
  toggleThreadSelection as coreToggleThreadSelection,
} from "@t3tools/client-core/threadSelection";
import { create } from "zustand";

export interface ThreadSelectionState {
  /** Currently selected thread IDs. */
  selectedThreadIds: ReadonlySet<ThreadId>;
  /** The thread ID that anchors shift-click range selection. */
  anchorThreadId: ThreadId | null;
}

interface ThreadSelectionStore extends ThreadSelectionState {
  /** Toggle a single thread in the selection (Cmd/Ctrl+Click). */
  toggleThread: (threadId: ThreadId) => void;
  /**
   * Select a range of threads (Shift+Click).
   * Requires the ordered list of thread IDs within the same project
   * so the store can compute which threads fall between anchor and target.
   */
  rangeSelectTo: (threadId: ThreadId, orderedThreadIds: readonly ThreadId[]) => void;
  /** Clear all selection state. */
  clearSelection: () => void;
  /** Remove specific thread IDs from the selection (e.g. after deletion). */
  removeFromSelection: (threadIds: readonly ThreadId[]) => void;
  /** Set the anchor thread without adding it to the selection (e.g. on plain-click navigate). */
  setAnchor: (threadId: ThreadId) => void;
  /** Check if any threads are selected. */
  hasSelection: () => boolean;
}

const EMPTY_SET = new Set<ThreadId>();

export const useThreadSelectionStore = create<ThreadSelectionStore>((set, get) => ({
  selectedThreadIds: EMPTY_SET,
  anchorThreadId: null,

  toggleThread: (threadId) => {
    set((state) => coreToggleThreadSelection(state, threadId as string) as ThreadSelectionState);
  },

  rangeSelectTo: (threadId, orderedThreadIds) => {
    set(
      (state) =>
        coreRangeSelectThreads(
          state as { selectedThreadIds: ReadonlySet<string>; anchorThreadId: string | null },
          threadId as string,
          orderedThreadIds as readonly string[],
        ) as ThreadSelectionState,
    );
  },

  clearSelection: () => {
    const state = get();
    if (state.selectedThreadIds.size === 0 && state.anchorThreadId === null) return;
    const cleared = coreClearThreadSelection();
    set({
      selectedThreadIds: cleared.selectedThreadIds as ReadonlySet<ThreadId>,
      anchorThreadId: cleared.anchorThreadId as ThreadId | null,
    });
  },

  setAnchor: (threadId) => {
    if (get().anchorThreadId === threadId) return;
    set({ anchorThreadId: threadId });
  },

  removeFromSelection: (threadIds) => {
    set((state) => {
      const next = coreRemoveFromThreadSelection(
        state as { selectedThreadIds: ReadonlySet<string>; anchorThreadId: string | null },
        threadIds as readonly string[],
      );
      if (next === state) return state;
      return {
        selectedThreadIds: next.selectedThreadIds as ReadonlySet<ThreadId>,
        anchorThreadId: next.anchorThreadId as ThreadId | null,
      };
    });
  },

  hasSelection: () => get().selectedThreadIds.size > 0,
}));
