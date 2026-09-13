import type { ChatAttachment } from "@t3tools/client-core";
import type { ResolvedComposerImageAttachment } from "./composerSubmit";

export type { ComposerMention, ComposerPathTrigger } from "@t3tools/client-core/composerMentions";
export {
  MENTION_TOKEN_PATTERN,
  MENTION_TOKEN_REGEX,
  basenameOfPath,
  inferMentionKindFromPath,
  mentionLabel,
  mentionSignature,
  detectTrailingComposerPathTrigger,
  replaceComposerTextRange,
  replaceTextRange,
  stripMentionTokensFromText,
  attachmentSignature,
  mergeChatAttachments,
  splitPromptIntoComposerSegments,
} from "@t3tools/client-core/composerMentions";

export type DraftComposerImageAttachment = ResolvedComposerImageAttachment & {
  localPath?: string;
};
export type ComposerImageAttachment = ChatAttachment | DraftComposerImageAttachment;

export type ComposerDraftState = {
  text: string;
  mentions: import("@t3tools/client-core/composerMentions").ComposerMention[];
  attachments: DraftComposerImageAttachment[];
};

export function cloneDraftAttachment(
  attachment: DraftComposerImageAttachment,
): DraftComposerImageAttachment {
  return { ...attachment };
}

export function cloneComposerMention(
  mention: import("@t3tools/client-core/composerMentions").ComposerMention,
): import("@t3tools/client-core/composerMentions").ComposerMention {
  return { ...mention };
}

export function cloneComposerDraftState(draft: ComposerDraftState): ComposerDraftState {
  return {
    text: draft.text,
    mentions: draft.mentions.map(cloneComposerMention),
    attachments: draft.attachments.map(cloneDraftAttachment),
  };
}
