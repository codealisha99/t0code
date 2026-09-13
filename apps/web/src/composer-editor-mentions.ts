import {
  splitPromptIntoComposerSegments as coreSplitPromptIntoComposerSegments,
  type ComposerPromptSegment as CoreComposerPromptSegment,
} from "@t3tools/client-core/composerMentions";
import {
  INLINE_TERMINAL_CONTEXT_PLACEHOLDER,
  type TerminalContextDraft,
} from "./lib/terminalContext";

export type ComposerPromptSegment =
  | { type: "text"; text: string }
  | { type: "mention"; path: string }
  | { type: "terminal-context"; context: TerminalContextDraft | null };

export function splitPromptIntoComposerSegments(
  prompt: string,
  terminalContexts: ReadonlyArray<TerminalContextDraft> = [],
): ComposerPromptSegment[] {
  return coreSplitPromptIntoComposerSegments(
    prompt,
    terminalContexts as ReadonlyArray<unknown>,
    INLINE_TERMINAL_CONTEXT_PLACEHOLDER,
  ) as ComposerPromptSegment[];
}

// Re-export core helpers for direct use if needed
export {
  MENTION_TOKEN_PATTERN,
  MENTION_TOKEN_REGEX,
  basenameOfPath,
  inferMentionKindFromPath,
  mentionLabel,
  detectTrailingComposerPathTrigger,
  replaceComposerTextRange,
  stripMentionTokensFromText,
} from "@t3tools/client-core/composerMentions";
