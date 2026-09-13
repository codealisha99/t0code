import type { ProviderApprovalDecision } from "@t3tools/contracts";
import {
  normalizeApprovalDecision as normalizeCoreApprovalDecision,
  parseApprovalResponseCommand as parseCoreApprovalResponseCommand,
  parseStandaloneComposerModeCommand as parseCoreStandaloneComposerModeCommand,
} from "@t3tools/client-core/slashCommands";

export function parseStandaloneComposerModeCommand(text: string): "plan" | "default" | null {
  return parseCoreStandaloneComposerModeCommand(text);
}

export function parseApprovalResponseCommand(text: string): ProviderApprovalDecision | null {
  return parseCoreApprovalResponseCommand(text) as ProviderApprovalDecision | null;
}

export { normalizeCoreApprovalDecision as normalizeApprovalDecision };
