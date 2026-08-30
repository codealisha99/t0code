import { describe, expect, it } from "vitest";

import { gitMenuItemIcon, summarizeGitActionResult } from "./gitUi";

describe("gitMenuItemIcon", () => {
  it("maps known git action icons", () => {
    expect(gitMenuItemIcon({ icon: "commit" })).toBe("󰜘");
    expect(gitMenuItemIcon({ icon: "push" })).toBe("󰊤");
    expect(gitMenuItemIcon({ icon: "pr" })).toBe("󰙯");
  });
});

describe("summarizeGitActionResult", () => {
  it("prefers PR and commit summaries", () => {
    expect(
      summarizeGitActionResult("commit_push_pr", {
        commit: { status: "created", commitSha: "abcdef123" },
        push: { status: "pushed" },
        pr: { status: "created", number: 12 },
      }),
    ).toBe("PR #12");
    expect(
      summarizeGitActionResult("commit", {
        commit: { status: "created", commitSha: "abcdef123" },
        push: { status: "skipped_not_requested" },
        pr: { status: "skipped_not_requested" },
      }),
    ).toBe("Committed abcdef1");
  });
});
