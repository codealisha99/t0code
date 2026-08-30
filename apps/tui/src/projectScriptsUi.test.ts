import { describe, expect, it } from "vitest";

import {
  createEmptyProjectScriptDraft,
  createProjectScriptEditDraft,
  projectScriptIconLabel,
  updateProjectScriptsForSave,
} from "./projectScriptsUi";

describe("updateProjectScriptsForSave", () => {
  it("appends a new script", () => {
    const draft = { ...createEmptyProjectScriptDraft(), name: "Test", command: "bun test" };
    const next = updateProjectScriptsForSave({ scripts: [], draft });
    expect(next).toHaveLength(1);
    expect(next[0]?.name).toBe("Test");
    expect(next[0]?.command).toBe("bun test");
    expect(next[0]?.runOnWorktreeCreate).toBe(false);
  });

  it("clears other worktree-create flags when saving a new worktree script", () => {
    const existing = createProjectScriptEditDraft({
      id: "setup",
      name: "Setup",
      command: "bun install",
      icon: "configure",
      runOnWorktreeCreate: true,
    });
    const scripts = updateProjectScriptsForSave({
      scripts: [],
      draft: existing,
    });
    const next = updateProjectScriptsForSave({
      scripts,
      draft: {
        ...createEmptyProjectScriptDraft(),
        name: "Bootstrap",
        command: "bun run bootstrap",
        runOnWorktreeCreate: true,
      },
    });
    expect(
      next.filter((script) => script.runOnWorktreeCreate).map((script) => script.name),
    ).toEqual(["Bootstrap"]);
  });
});

describe("projectScriptIconLabel", () => {
  it("labels known icons", () => {
    expect(projectScriptIconLabel("test")).toBe("Test");
  });
});
