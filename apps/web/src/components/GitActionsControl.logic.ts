import type { GitRunStackedActionResult, GitStackedAction } from "@t3tools/contracts";
import { resolveQuickAction } from "@t3tools/client-core";
export {
  buildGitActionMenuItems as buildMenuItems,
  resolveQuickAction,
} from "@t3tools/client-core";
export type {
  GitActionIconName,
  GitActionMenuItem,
  GitDialogAction,
  GitQuickAction,
} from "@t3tools/client-core";

export interface DefaultBranchActionDialogCopy {
  title: string;
  description: string;
  continueLabel: string;
}

export type DefaultBranchConfirmableAction = "commit_push" | "commit_push_pr";

export { summarizeGitResultDetailed as summarizeGitResult } from "@t3tools/client-core/gitResult";

export function buildGitActionProgressStages(input: {
  action: GitStackedAction;
  hasCustomCommitMessage: boolean;
  hasWorkingTreeChanges: boolean;
  forcePushOnly?: boolean;
  pushTarget?: string;
  featureBranch?: boolean;
}): string[] {
  const branchStages = input.featureBranch ? ["Preparing feature branch..."] : [];
  const shouldIncludeCommitStages =
    !input.forcePushOnly && (input.action === "commit" || input.hasWorkingTreeChanges);
  const commitStages = !shouldIncludeCommitStages
    ? []
    : input.hasCustomCommitMessage
      ? ["Committing..."]
      : ["Generating commit message...", "Committing..."];
  const pushStage = input.pushTarget ? `Pushing to ${input.pushTarget}...` : "Pushing...";
  if (input.action === "commit") {
    return [...branchStages, ...commitStages];
  }
  if (input.action === "commit_push") {
    return [...branchStages, ...commitStages, pushStage];
  }
  return [...branchStages, ...commitStages, pushStage, "Creating PR..."];
}

export function requiresDefaultBranchConfirmation(
  action: GitStackedAction,
  isDefaultBranch: boolean,
): boolean {
  if (!isDefaultBranch) return false;
  return action === "commit_push" || action === "commit_push_pr";
}

export function resolveDefaultBranchActionDialogCopy(input: {
  action: DefaultBranchConfirmableAction;
  branchName: string;
  includesCommit: boolean;
}): DefaultBranchActionDialogCopy {
  const branchLabel = input.branchName;
  const suffix = ` on "${branchLabel}". You can continue on this branch or create a feature branch and run the same action there.`;

  if (input.action === "commit_push") {
    if (input.includesCommit) {
      return {
        title: "Commit & push to default branch?",
        description: `This action will commit and push changes${suffix}`,
        continueLabel: `Commit & push to ${branchLabel}`,
      };
    }
    return {
      title: "Push to default branch?",
      description: `This action will push local commits${suffix}`,
      continueLabel: `Push to ${branchLabel}`,
    };
  }

  if (input.includesCommit) {
    return {
      title: "Commit, push & create PR from default branch?",
      description: `This action will commit, push, and create a PR${suffix}`,
      continueLabel: `Commit, push & create PR`,
    };
  }
  return {
    title: "Push & create PR from default branch?",
    description: `This action will push local commits and create a PR${suffix}`,
    continueLabel: "Push & create PR",
  };
}

// Re-export from shared for backwards compatibility in this module's exports
export { resolveAutoFeatureBranchName } from "@t3tools/shared/git";
