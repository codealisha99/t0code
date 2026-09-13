export {
  type LocalThreadVisitedState,
  pruneLocalThreadVisitedState,
  pruneLocallyUnreadThreadIds,
  isDraftThreadId,
  DRAFT_THREAD_ID_PREFIX,
  shouldApplyWelcomeBootstrapSelection,
  shouldClearPendingCreatedThread,
} from "@t3tools/client-core/threadVisited";
