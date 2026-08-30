import type { ProjectEntry } from "@t3tools/contracts";
import type { ChatAttachment } from "@t3tools/client-core";

import type { ResolvedComposerImageAttachment } from "./composerSubmit";

export type ComposerPathTrigger = {
  query: string;
  rangeStart: number;
  rangeEnd: number;
};

export type ComposerMention = {
  type: "path";
  path: string;
  kind: ProjectEntry["kind"];
  parentPath?: string;
};

export type DraftComposerImageAttachment = ResolvedComposerImageAttachment & { localPath?: string };
export type ComposerImageAttachment = ChatAttachment | DraftComposerImageAttachment;

export type ComposerDraftState = {
  text: string;
  mentions: ComposerMention[];
  attachments: DraftComposerImageAttachment[];
};

const MENTION_TOKEN_PATTERN = /(^|\s)@([^\s@]+)(?=\s|$)/g;

export function basenameOfPath(input: string): string {
  const trimmed = input.replace(/\/+$/g, "");
  const parts = trimmed.split("/");
  return parts[parts.length - 1] || input;
}

export function inferMentionKindFromPath(pathValue: string): ProjectEntry["kind"] {
  return basenameOfPath(pathValue).includes(".") ? "file" : "directory";
}

export function mentionLabel(mention: Pick<ComposerMention, "path" | "kind">): string {
  const icon = mention.kind === "directory" ? "󰉋" : "󰈔";
  return `${icon} ${basenameOfPath(mention.path)}`;
}

export function mentionSignature(mention: Pick<ComposerMention, "path">): string {
  return mention.path;
}

export function cloneDraftAttachment(
  attachment: DraftComposerImageAttachment,
): DraftComposerImageAttachment {
  return { ...attachment };
}

export function cloneComposerMention(mention: ComposerMention): ComposerMention {
  return { ...mention };
}

export function cloneComposerDraftState(draft: ComposerDraftState): ComposerDraftState {
  return {
    text: draft.text,
    mentions: draft.mentions.map(cloneComposerMention),
    attachments: draft.attachments.map(cloneDraftAttachment),
  };
}

export function detectTrailingComposerPathTrigger(input: string): ComposerPathTrigger | null {
  const trimmedEnd = input.replace(/\r/g, "");
  const cursor = trimmedEnd.length;
  let index = cursor - 1;
  while (index >= 0) {
    const char = trimmedEnd[index] ?? "";
    if (char === " " || char === "\n" || char === "\t") {
      break;
    }
    index -= 1;
  }
  const rangeStart = index + 1;
  const token = trimmedEnd.slice(rangeStart, cursor);
  if (!token.startsWith("@")) {
    return null;
  }
  return {
    query: token.slice(1),
    rangeStart,
    rangeEnd: cursor,
  };
}

export function replaceComposerTextRange(
  text: string,
  rangeStart: number,
  rangeEnd: number,
  replacement: string,
): string {
  const safeStart = Math.max(0, Math.min(text.length, rangeStart));
  const safeEnd = Math.max(safeStart, Math.min(text.length, rangeEnd));
  return `${text.slice(0, safeStart)}${replacement}${text.slice(safeEnd)}`;
}

export function stripMentionTokensFromText(input: string): {
  mentions: ComposerMention[];
  body: string;
} {
  const mentions: ComposerMention[] = [];
  let cursor = 0;
  let output = "";

  for (const match of input.matchAll(MENTION_TOKEN_PATTERN)) {
    const fullMatch = match[0] ?? "";
    const prefix = match[1] ?? "";
    const mentionPath = match[2] ?? "";
    const matchIndex = match.index ?? 0;
    const mentionStart = matchIndex + prefix.length;
    const mentionEnd = mentionStart + fullMatch.length - prefix.length;
    output += input.slice(cursor, mentionStart);
    if (mentionPath.length > 0) {
      mentions.push({
        type: "path",
        path: mentionPath,
        kind: inferMentionKindFromPath(mentionPath),
      });
    } else {
      output += input.slice(mentionStart, mentionEnd);
    }
    cursor = mentionEnd;
  }

  output += input.slice(cursor);
  const body = output
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { mentions, body };
}

export function attachmentSignature(attachment: {
  name: string;
  mimeType: string;
  sizeBytes: number;
  dataUrl?: string;
  id?: string;
}): string {
  if (attachment.id) {
    return `id::${attachment.id}`;
  }
  return [
    "draft",
    attachment.mimeType,
    String(attachment.sizeBytes),
    attachment.dataUrl ?? "",
  ].join("::");
}

export function mergeChatAttachments<T extends ComposerImageAttachment>(
  ...attachmentLists: ReadonlyArray<ReadonlyArray<T>>
): T[] {
  const merged: T[] = [];
  const seen = new Set<string>();
  for (const attachments of attachmentLists) {
    for (const attachment of attachments) {
      const signature = attachmentSignature(attachment);
      if (seen.has(signature)) {
        continue;
      }
      seen.add(signature);
      merged.push(attachment);
    }
  }
  return merged;
}
