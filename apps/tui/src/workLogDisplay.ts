import type { TimelineEntry } from "@t3tools/client-core";

import { resolveWorkEntryIcon } from "./workEntryIcons";
import { ACTIVE_TUI_THEME, PALETTE } from "./tuiThemeState";
import type { TuiColor } from "./theme";

type WorkEntry = Extract<TimelineEntry, { kind: "work" }>["entry"];

export function capitalizePhrase(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) return value;
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}

export function normalizeCompactToolLabel(value: string): string {
  return value.replace(/\s+(?:complete|completed)\s*$/i, "").trim();
}

export function toolWorkEntryHeading(entry: WorkEntry): string {
  if (entry.toolTitle) {
    return capitalizePhrase(normalizeCompactToolLabel(entry.toolTitle));
  }
  return capitalizePhrase(normalizeCompactToolLabel(entry.label));
}

export function workEntryPreview(entry: WorkEntry): string | null {
  if (entry.command) return entry.command;
  if (entry.detail) return entry.detail;
  if ((entry.changedFiles?.length ?? 0) === 0) return null;
  const [firstPath] = entry.changedFiles ?? [];
  if (!firstPath) return null;
  return entry.changedFiles!.length === 1
    ? firstPath
    : `${firstPath} +${entry.changedFiles!.length - 1} more`;
}

export function workEntryDisplayText(entry: WorkEntry): string {
  const heading = toolWorkEntryHeading(entry);
  const preview = workEntryPreview(entry);
  return preview ? `${heading} - ${preview}` : heading;
}

export function workEntryPrefix(entry: WorkEntry): string {
  return resolveWorkEntryIcon(entry);
}

export function workEntryAccent(entry: WorkEntry): TuiColor {
  if (entry.tone === "error") return ACTIVE_TUI_THEME.colors.workEntryErrorAccent;
  if (entry.requestKind === "command" || entry.command) return PALETTE.text;
  if (entry.requestKind === "file-change" || (entry.changedFiles?.length ?? 0) > 0) {
    return PALETTE.info;
  }
  if (entry.requestKind === "file-read" || entry.itemType === "image_view") {
    return PALETTE.muted;
  }
  return PALETTE.subtle;
}

export function renderMessageBody(entry: TimelineEntry): string {
  if (entry.kind === "message") {
    return entry.message.text || " ";
  }
  if (entry.kind === "proposed-plan") {
    return entry.proposedPlan.planMarkdown;
  }
  return workEntryDisplayText(entry.entry);
}
