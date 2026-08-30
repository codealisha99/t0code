import type { ProjectScript, ProjectScriptIcon } from "@t3tools/contracts";
import { nextProjectScriptId } from "@t3tools/shared/projectScripts";

export type ProjectScriptDraft = {
  scriptId: string | null;
  name: string;
  command: string;
  icon: ProjectScriptIcon;
  runOnWorktreeCreate: boolean;
  error: string | null;
  busy: boolean;
};

export const PROJECT_SCRIPT_ICON_OPTIONS = [
  { id: "play", icon: "󰐊", label: "Play" },
  { id: "test", icon: "󰙨", label: "Test" },
  { id: "lint", icon: "󰓛", label: "Lint" },
  { id: "configure", icon: "󰒓", label: "Configure" },
  { id: "build", icon: "󰆧", label: "Build" },
  { id: "debug", icon: "󰃤", label: "Debug" },
] as const satisfies ReadonlyArray<{
  readonly id: ProjectScriptIcon;
  readonly icon: string;
  readonly label: string;
}>;

export function projectScriptIcon(icon: ProjectScriptIcon): string {
  return PROJECT_SCRIPT_ICON_OPTIONS.find((option) => option.id === icon)?.icon ?? "󰐊";
}

export function projectScriptIconLabel(icon: ProjectScriptIcon): string {
  return PROJECT_SCRIPT_ICON_OPTIONS.find((option) => option.id === icon)?.label ?? "Play";
}

export function createEmptyProjectScriptDraft(): ProjectScriptDraft {
  return {
    scriptId: null,
    name: "",
    command: "",
    icon: "play",
    runOnWorktreeCreate: false,
    error: null,
    busy: false,
  };
}

export function createProjectScriptEditDraft(script: ProjectScript): ProjectScriptDraft {
  return {
    scriptId: script.id,
    name: script.name,
    command: script.command,
    icon: script.icon,
    runOnWorktreeCreate: script.runOnWorktreeCreate,
    error: null,
    busy: false,
  };
}

export function updateProjectScriptsForSave(input: {
  scripts: readonly ProjectScript[];
  draft: ProjectScriptDraft;
}): readonly ProjectScript[] {
  const trimmedName = input.draft.name.trim();
  const trimmedCommand = input.draft.command.trim();
  const nextScript: ProjectScript = {
    id:
      input.draft.scriptId ??
      nextProjectScriptId(
        trimmedName,
        input.scripts.map((script) => script.id),
      ),
    name: trimmedName,
    command: trimmedCommand,
    icon: input.draft.icon,
    runOnWorktreeCreate: input.draft.runOnWorktreeCreate,
  };

  if (!input.draft.scriptId) {
    return input.draft.runOnWorktreeCreate
      ? [
          ...input.scripts.map((script) =>
            script.runOnWorktreeCreate ? { ...script, runOnWorktreeCreate: false } : script,
          ),
          nextScript,
        ]
      : [...input.scripts, nextScript];
  }

  return input.scripts.map((script) =>
    script.id === input.draft.scriptId
      ? nextScript
      : input.draft.runOnWorktreeCreate
        ? { ...script, runOnWorktreeCreate: false }
        : script,
  );
}
