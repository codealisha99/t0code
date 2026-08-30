import type { GitBranch, ThreadEnvMode } from "@t3tools/contracts";

import { randomUUID } from "./ids";

export type { ThreadEnvMode };
export type EnvMode = ThreadEnvMode;

export const WORKTREE_BRANCH_PREFIX = "t3code";

export function buildTemporaryWorktreeBranchName(): string {
  // Keep the 8-hex suffix shape for backend temporary-branch detection.
  return `${WORKTREE_BRANCH_PREFIX}/${randomUUID().slice(0, 8).toLowerCase()}`;
}

export function resolveDraftEnvModeAfterBranchChange(input: {
  nextWorktreePath: string | null;
  currentWorktreePath: string | null;
  effectiveEnvMode: ThreadEnvMode;
}): ThreadEnvMode {
  const { nextWorktreePath, currentWorktreePath, effectiveEnvMode } = input;
  if (nextWorktreePath) {
    return "worktree";
  }
  if (effectiveEnvMode === "worktree" && !currentWorktreePath) {
    return "worktree";
  }
  return "local";
}

export function resolveBranchToolbarValue(input: {
  envMode: ThreadEnvMode;
  activeWorktreePath: string | null;
  activeThreadBranch: string | null;
  currentGitBranch: string | null;
}): string | null {
  const { envMode, activeWorktreePath, activeThreadBranch, currentGitBranch } = input;
  if (envMode === "worktree" && !activeWorktreePath) {
    return activeThreadBranch ?? currentGitBranch;
  }
  return currentGitBranch ?? activeThreadBranch;
}

export function deriveLocalBranchNameFromRemoteRef(branchName: string): string {
  const firstSeparatorIndex = branchName.indexOf("/");
  if (firstSeparatorIndex <= 0 || firstSeparatorIndex === branchName.length - 1) {
    return branchName;
  }
  return branchName.slice(firstSeparatorIndex + 1);
}

export function deriveLocalBranchNameCandidatesFromRemoteRef(
  branchName: string,
  remoteName?: string,
): ReadonlyArray<string> {
  const candidates = new Set<string>();
  const firstSlashCandidate = deriveLocalBranchNameFromRemoteRef(branchName);
  if (firstSlashCandidate.length > 0) {
    candidates.add(firstSlashCandidate);
  }

  if (remoteName) {
    const remotePrefix = `${remoteName}/`;
    if (branchName.startsWith(remotePrefix) && branchName.length > remotePrefix.length) {
      candidates.add(branchName.slice(remotePrefix.length));
    }
  }

  return [...candidates];
}

export function dedupeRemoteBranchesWithLocalMatches(
  branches: ReadonlyArray<GitBranch>,
): ReadonlyArray<GitBranch> {
  const localBranchNames = new Set(
    branches.filter((branch) => !branch.isRemote).map((branch) => branch.name),
  );

  return branches.filter((branch) => {
    if (!branch.isRemote) {
      return true;
    }
    if (branch.remoteName !== "origin") {
      return true;
    }
    const localBranchCandidates = deriveLocalBranchNameCandidatesFromRemoteRef(
      branch.name,
      branch.remoteName,
    );
    return !localBranchCandidates.some((candidate) => localBranchNames.has(candidate));
  });
}

export function resolveBranchSelectionTarget(input: {
  activeProjectCwd: string;
  activeWorktreePath: string | null;
  branch: Pick<GitBranch, "isDefault" | "worktreePath">;
}): {
  checkoutCwd: string;
  nextWorktreePath: string | null;
  reuseExistingWorktree: boolean;
} {
  const { activeProjectCwd, activeWorktreePath, branch } = input;

  if (branch.worktreePath) {
    return {
      checkoutCwd: branch.worktreePath,
      nextWorktreePath: branch.worktreePath === activeProjectCwd ? null : branch.worktreePath,
      reuseExistingWorktree: true,
    };
  }

  const nextWorktreePath =
    activeWorktreePath !== null && branch.isDefault ? null : activeWorktreePath;

  return {
    checkoutCwd: nextWorktreePath ?? activeProjectCwd,
    nextWorktreePath,
    reuseExistingWorktree: false,
  };
}

export function shouldIncludeBranchPickerItem(input: {
  itemValue: string;
  normalizedQuery: string;
  createBranchItemValue: string | null;
  checkoutPullRequestItemValue: string | null;
}): boolean {
  const { itemValue, normalizedQuery, createBranchItemValue, checkoutPullRequestItemValue } = input;

  if (normalizedQuery.length === 0) {
    return true;
  }

  if (createBranchItemValue && itemValue === createBranchItemValue) {
    return true;
  }

  if (checkoutPullRequestItemValue && itemValue === checkoutPullRequestItemValue) {
    return true;
  }

  return itemValue.toLowerCase().includes(normalizedQuery);
}

export function resolveEffectiveThreadEnvMode(input: {
  activeWorktreePath: string | null;
  hasServerThread: boolean;
  draftThreadEnvMode: ThreadEnvMode | undefined;
  fallbackEnvMode?: ThreadEnvMode;
}): ThreadEnvMode {
  const { activeWorktreePath, hasServerThread, draftThreadEnvMode, fallbackEnvMode } = input;
  return activeWorktreePath || (!hasServerThread && draftThreadEnvMode === "worktree")
    ? "worktree"
    : (draftThreadEnvMode ?? fallbackEnvMode ?? "local");
}

export function branchTriggerLabel(input: {
  activeWorktreePath: string | null;
  effectiveEnvMode: ThreadEnvMode;
  branch: string | null;
}): string {
  const { activeWorktreePath, effectiveEnvMode, branch } = input;
  if (!branch) {
    return "Select branch";
  }
  if (effectiveEnvMode === "worktree" && !activeWorktreePath) {
    return `From ${branch}`;
  }
  return branch;
}
