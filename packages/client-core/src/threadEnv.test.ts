import type { GitBranch } from "@t3tools/contracts";
import { describe, expect, it } from "vitest";

import {
  WORKTREE_BRANCH_PREFIX,
  branchTriggerLabel,
  buildTemporaryWorktreeBranchName,
  dedupeRemoteBranchesWithLocalMatches,
  deriveLocalBranchNameFromRemoteRef,
  resolveBranchSelectionTarget,
  resolveDraftEnvModeAfterBranchChange,
  resolveEffectiveThreadEnvMode,
  resolveBranchToolbarValue,
} from "./threadEnv";

describe("buildTemporaryWorktreeBranchName", () => {
  it("uses the shared prefix and an 8-character hex suffix", () => {
    const name = buildTemporaryWorktreeBranchName();
    expect(name.startsWith(`${WORKTREE_BRANCH_PREFIX}/`)).toBe(true);
    expect(name.slice(WORKTREE_BRANCH_PREFIX.length + 1)).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe("resolveEffectiveThreadEnvMode", () => {
  it("stays on worktree when a worktree path is already active", () => {
    expect(
      resolveEffectiveThreadEnvMode({
        activeWorktreePath: "/repo/.t3/worktrees/feature",
        hasServerThread: true,
        draftThreadEnvMode: "local",
        fallbackEnvMode: "local",
      }),
    ).toBe("worktree");
  });

  it("uses the TUI fallback when there is no draft mode", () => {
    expect(
      resolveEffectiveThreadEnvMode({
        activeWorktreePath: null,
        hasServerThread: true,
        draftThreadEnvMode: undefined,
        fallbackEnvMode: "worktree",
      }),
    ).toBe("worktree");
  });

  it("matches the web default of local when fallback is omitted", () => {
    expect(
      resolveEffectiveThreadEnvMode({
        activeWorktreePath: null,
        hasServerThread: true,
        draftThreadEnvMode: undefined,
      }),
    ).toBe("local");
  });
});

describe("resolveDraftEnvModeAfterBranchChange", () => {
  it("keeps new-worktree mode when selecting a base branch before worktree creation", () => {
    expect(
      resolveDraftEnvModeAfterBranchChange({
        nextWorktreePath: null,
        currentWorktreePath: null,
        effectiveEnvMode: "worktree",
      }),
    ).toBe("worktree");
  });
});

describe("resolveBranchToolbarValue", () => {
  it("defaults new-worktree mode to the current git branch", () => {
    expect(
      resolveBranchToolbarValue({
        envMode: "worktree",
        activeWorktreePath: null,
        activeThreadBranch: null,
        currentGitBranch: "main",
      }),
    ).toBe("main");
  });
});

describe("deriveLocalBranchNameFromRemoteRef", () => {
  it("strips the first remote prefix", () => {
    expect(deriveLocalBranchNameFromRemoteRef("origin/feature/demo")).toBe("feature/demo");
  });
});

describe("dedupeRemoteBranchesWithLocalMatches", () => {
  it("hides origin remotes when a local branch already exists", () => {
    const input: GitBranch[] = [
      {
        name: "feature/demo",
        current: false,
        isDefault: false,
        worktreePath: null,
      },
      {
        name: "origin/feature/demo",
        isRemote: true,
        remoteName: "origin",
        current: false,
        isDefault: false,
        worktreePath: null,
      },
    ];
    expect(dedupeRemoteBranchesWithLocalMatches(input).map((branch) => branch.name)).toEqual([
      "feature/demo",
    ]);
  });
});

describe("resolveBranchSelectionTarget", () => {
  it("reuses an existing secondary worktree", () => {
    expect(
      resolveBranchSelectionTarget({
        activeProjectCwd: "/repo",
        activeWorktreePath: "/repo/.t3/worktrees/feature-a",
        branch: {
          isDefault: false,
          worktreePath: "/repo/.t3/worktrees/feature-b",
        },
      }),
    ).toEqual({
      checkoutCwd: "/repo/.t3/worktrees/feature-b",
      nextWorktreePath: "/repo/.t3/worktrees/feature-b",
      reuseExistingWorktree: true,
    });
  });
});

describe("branchTriggerLabel", () => {
  it("shows the base-branch prefix before a worktree exists", () => {
    expect(
      branchTriggerLabel({
        activeWorktreePath: null,
        effectiveEnvMode: "worktree",
        branch: "main",
      }),
    ).toBe("From main");
  });
});
