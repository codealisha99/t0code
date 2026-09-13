import type { ProjectEntry } from "@t3tools/contracts";

/**
 * Unified mention helpers for TUI and Web.
 * TUI uses `ComposerMention {path,kind}` while Web uses prompt segments.
 * This module provides the shared regex and pure string helpers so both
 * surfaces stay consistent. Terminal placeholder handling is optional so the
 * same split logic works for TUI (no placeholder) and Web (INLINE_TERMINAL_CONTEXT_PLACEHOLDER).
 */

// Two patterns: strict for live prompt segments (requires trailing whitespace so
// trailing `@query` while typing stays as text), permissive for final
// send-time parsing which should capture `@file` at end-of-string.
export const MENTION_TOKEN_PATTERN_STRICT = /(^|\s)@([^\s@]+)(?=\s)/g;
export const MENTION_TOKEN_PATTERN_FINAL = /(^|\s)@([^\s@]+)(?=\s|$)/g;
// Keep original name as final for backwards compat (TUI strip uses it), expose strict separately.
export const MENTION_TOKEN_PATTERN = MENTION_TOKEN_PATTERN_FINAL;
export const MENTION_TOKEN_REGEX = MENTION_TOKEN_PATTERN;

export type ComposerMention = {
  type: "path";
  path: string;
  kind: ProjectEntry["kind"];
  parentPath?: string;
};

export type ComposerPathTrigger = {
  query: string;
  rangeStart: number;
  rangeEnd: number;
};

export type ComposerPromptSegment =
  | { type: "text"; text: string }
  | { type: "mention"; path: string }
  | { type: "terminal-context"; context: unknown | null };

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

export function replaceTextRange(
  text: string,
  rangeStart: number,
  rangeEnd: number,
  replacement: string,
): { text: string; cursor: number } {
  const safeStart = Math.max(0, Math.min(text.length, rangeStart));
  const safeEnd = Math.max(safeStart, Math.min(text.length, rangeEnd));
  const nextText = `${text.slice(0, safeStart)}${replacement}${text.slice(safeEnd)}`;
  return { text: nextText, cursor: safeStart + replacement.length };
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

export function mergeChatAttachments<
  T extends { name: string; mimeType: string; sizeBytes: number; dataUrl?: string; id?: string },
>(...attachmentLists: ReadonlyArray<ReadonlyArray<T>>): T[] {
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

// --- Web prompt segment helpers (with optional terminal placeholder) ---

function pushTextSegment(segments: ComposerPromptSegment[], text: string): void {
  if (!text) return;
  const last = segments[segments.length - 1];
  if (last && last.type === "text") {
    last.text += text;
    return;
  }
  segments.push({ type: "text", text });
}

function splitPromptTextIntoComposerSegments(text: string): ComposerPromptSegment[] {
  const segments: ComposerPromptSegment[] = [];
  if (!text) {
    return segments;
  }

  let cursor = 0;
  // Strict pattern for live editor: trailing `@pac` without space stays as text (matches web test expectations)
  const pattern = new RegExp(
    MENTION_TOKEN_PATTERN_STRICT.source,
    MENTION_TOKEN_PATTERN_STRICT.flags,
  );
  for (const match of text.matchAll(pattern)) {
    const fullMatch = match[0];
    const prefix = match[1] ?? "";
    const path = match[2] ?? "";
    const matchIndex = match.index ?? 0;
    const mentionStart = matchIndex + prefix.length;
    const mentionEnd = mentionStart + fullMatch.length - prefix.length;

    if (mentionStart > cursor) {
      pushTextSegment(segments, text.slice(cursor, mentionStart));
    }

    if (path.length > 0) {
      segments.push({ type: "mention", path });
    } else {
      pushTextSegment(segments, text.slice(mentionStart, mentionEnd));
    }

    cursor = mentionEnd;
  }

  if (cursor < text.length) {
    pushTextSegment(segments, text.slice(cursor));
  }

  return segments;
}

export function splitPromptIntoComposerSegments(
  prompt: string,
  terminalContexts: ReadonlyArray<unknown> = [],
  terminalPlaceholder = "\uFFFC",
): ComposerPromptSegment[] {
  if (!prompt) {
    return [];
  }

  const segments: ComposerPromptSegment[] = [];
  let textCursor = 0;
  let terminalContextIndex = 0;

  for (let index = 0; index < prompt.length; index += 1) {
    if (prompt[index] !== terminalPlaceholder) {
      continue;
    }

    if (index > textCursor) {
      segments.push(...splitPromptTextIntoComposerSegments(prompt.slice(textCursor, index)));
    }
    segments.push({
      type: "terminal-context",
      context: terminalContexts[terminalContextIndex] ?? null,
    });
    terminalContextIndex += 1;
    textCursor = index + 1;
  }

  if (textCursor < prompt.length) {
    segments.push(...splitPromptTextIntoComposerSegments(prompt.slice(textCursor)));
  }

  return segments;
}
