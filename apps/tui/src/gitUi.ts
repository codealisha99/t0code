import type { GitActionMenuItem } from "@t3tools/client-core";
import type { GitStackedAction } from "@t3tools/contracts";

export function gitMenuItemIcon(item: Pick<GitActionMenuItem, "icon">): string {
  if (item.icon === "commit") return "󰜘";
  if (item.icon === "push") return "󰊤";
  return "󰙯";
}

export function summarizeGitActionResult(
  action: GitStackedAction,
  result: {
    commit: { status: string; commitSha?: string | undefined };
    push: { status: string };
    pr: { status: string; number?: number | undefined };
  },
): string {
  if (result.pr.status === "created" || result.pr.status === "opened_existing") {
    return result.pr.number ? `PR #${result.pr.number}` : "PR ready";
  }
  if (result.push.status === "pushed") {
    return "Pushed";
  }
  if (result.commit.status === "created") {
    return result.commit.commitSha
      ? `Committed ${result.commit.commitSha.slice(0, 7)}`
      : "Committed";
  }
  if (action === "commit_push") return "Push complete";
  if (action === "commit_push_pr") return "PR flow complete";
  return "Commit complete";
}
