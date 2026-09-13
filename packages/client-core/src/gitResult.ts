import type { GitRunStackedActionResult, GitStackedAction } from "@t3tools/contracts";

export function gitMenuItemIcon(item: { icon: string }): string {
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

const SHORT_SHA_LENGTH = 7;

function shortenSha(sha: string | undefined): string | null {
  if (!sha) return null;
  return sha.slice(0, SHORT_SHA_LENGTH);
}

function truncateText(value: string | undefined, maxLength = 72): string | undefined {
  if (!value) return undefined;
  if (value.length <= maxLength) return value;
  if (maxLength <= 3) return "...".slice(0, maxLength);
  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

export function summarizeGitResultDetailed(result: GitRunStackedActionResult): {
  title: string;
  description?: string;
} {
  const withDescription = (title: string, description: string | undefined) =>
    description ? { title, description } : { title };

  if (result.pr.status === "created" || result.pr.status === "opened_existing") {
    const prNumber = result.pr.number ? ` #${result.pr.number}` : "";
    const title = `${result.pr.status === "created" ? "Created PR" : "Opened PR"}${prNumber}`;
    return withDescription(title, truncateText(result.pr.title));
  }

  if (result.push.status === "pushed") {
    const shortSha = shortenSha(result.commit.commitSha);
    const branch = result.push.upstreamBranch ?? result.push.branch;
    const pushedCommitPart = shortSha ? ` ${shortSha}` : "";
    const branchPart = branch ? ` to ${branch}` : "";
    return withDescription(
      `Pushed${pushedCommitPart}${branchPart}`,
      truncateText(result.commit.subject),
    );
  }

  if (result.commit.status === "created") {
    const shortSha = shortenSha(result.commit.commitSha);
    const title = shortSha ? `Committed ${shortSha}` : "Committed changes";
    return withDescription(title, truncateText(result.commit.subject));
  }

  return { title: "Done" };
}
