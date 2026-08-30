import {
  MODEL_OPTIONS_BY_PROVIDER,
  type ClaudeCodeEffort,
  type CodexReasoningEffort,
  type ProviderKind,
  type ProviderModelOptions,
  type ProviderOptionDescriptor,
  type ProviderOptionSelection,
  type RuntimeMode,
} from "@t3tools/contracts";
import {
  getDefaultReasoningEffort,
  getReasoningEffortOptions,
  isClaudeUltrathinkPrompt,
  normalizeClaudeModelOptions,
  normalizeCodexModelOptions,
  resolveReasoningEffortForProvider,
  resolveSelectableModel,
  supportsClaudeFastMode,
  supportsClaudeThinkingToggle,
  supportsClaudeUltrathinkKeyword,
} from "@t3tools/shared/model";

import { formatReasoningEffortLabel } from "./composerControlLabels";
import {
  filterProviderOptionSelectionsForDescriptors,
  mergeProviderOptionSelections,
  modelOptionsToProviderOptionSelections,
} from "./providerOptionSelections";
import { PALETTE } from "./tuiThemeState";
import type { TuiColor } from "./theme";

export function providerIcon(provider: ProviderKind | string | null | undefined): string {
  return provider === "claudeAgent" ? "✱" : "󰚩";
}

export function providerPickerIcon(provider: string): string {
  if (provider === "claudeAgent") return "✱";
  if (provider === "cursor") return "⌖";
  if (provider === "opencode") return "⌘";
  if (provider === "githubCopilot") return "";
  if (provider === "gemini") return "◇";
  if (provider === "acpRegistry") return "󰕮";
  if (provider === "piAgent") return "π";
  return "󰚩";
}

export function providerColor(provider: ProviderKind | string | null | undefined): TuiColor {
  return provider === "claudeAgent" ? PALETTE.claude : PALETTE.muted;
}

export function interactionLabel(mode: "default" | "plan"): string {
  return mode === "plan" ? "Plan" : "Chat";
}

export function interactionIcon(mode: "default" | "plan"): string {
  return mode === "plan" ? "󰨖" : "󰍩";
}

export function resolveModelName(
  provider: ProviderKind,
  model: string,
  options: ReadonlyArray<{
    readonly slug: string;
    readonly name: string;
  }> = MODEL_OPTIONS_BY_PROVIDER[provider],
): string {
  return options.find((option) => option.slug === model)?.name ?? model;
}

export function modelControlLabel(
  provider: ProviderKind,
  model: string,
  options: ReadonlyArray<{
    readonly slug: string;
    readonly name: string;
    readonly shortName?: string;
  }> = MODEL_OPTIONS_BY_PROVIDER[provider],
): string {
  const resolvedModel = resolveSelectableModel(provider, model, options) ?? model;
  const selectedOption = options.find((option) => option.slug === resolvedModel);

  if (selectedOption?.shortName) {
    return selectedOption.shortName;
  }

  if (provider === "codex") {
    return resolveModelName(provider, resolvedModel, options);
  } else {
    if (resolvedModel === "claude-opus-4-6") return "Opus 4.6";
    if (resolvedModel === "claude-sonnet-4-6") return "Sonnet 4.6";
    if (resolvedModel === "claude-haiku-4-5") return "Haiku 4.5";
  }

  return resolveModelName(provider, resolvedModel, options)
    .replace(/^GPT-/i, "GPT ")
    .replace(/-codex$/i, "")
    .replace(/^Claude\s+/i, "")
    .replace(/\s+Codex(?:\s+Spark)?$/i, "")
    .trim();
}

export function getCodexTraits(modelOptions: ProviderModelOptions | null | undefined): {
  effort: CodexReasoningEffort | "none";
  fastModeEnabled: boolean;
} {
  const defaultReasoningEffort = getDefaultReasoningEffort("codex");
  const rawReasoningEffort =
    typeof modelOptions?.codex?.reasoningEffort === "string"
      ? (modelOptions.codex.reasoningEffort as CodexReasoningEffort | "none")
      : null;
  return {
    effort:
      resolveReasoningEffortForProvider("codex", rawReasoningEffort) ??
      (rawReasoningEffort === "none" ? "none" : null) ??
      defaultReasoningEffort,
    fastModeEnabled: modelOptions?.codex?.fastMode === true,
  };
}

export function getClaudeTraits(
  model: string,
  prompt: string,
  modelOptions: ProviderModelOptions | null | undefined,
): {
  effort: Exclude<ClaudeCodeEffort, "ultrathink"> | null;
  thinkingEnabled: boolean | null;
  fastModeEnabled: boolean;
  options: ReadonlyArray<ClaudeCodeEffort>;
  ultrathinkPromptControlled: boolean;
  supportsFastMode: boolean;
} {
  const options = getReasoningEffortOptions("claudeAgent", model);
  const defaultReasoningEffort = getDefaultReasoningEffort("claudeAgent") as Exclude<
    ClaudeCodeEffort,
    "ultrathink"
  >;
  const resolvedEffort = resolveReasoningEffortForProvider(
    "claudeAgent",
    modelOptions?.claudeAgent?.effort,
  );
  const effort =
    resolvedEffort && resolvedEffort !== "ultrathink" && options.includes(resolvedEffort)
      ? resolvedEffort
      : options.includes(defaultReasoningEffort)
        ? defaultReasoningEffort
        : null;
  const thinkingEnabled = supportsClaudeThinkingToggle(model)
    ? (modelOptions?.claudeAgent?.thinking ?? true)
    : null;
  const supportsFastMode = supportsClaudeFastMode(model);

  return {
    effort,
    thinkingEnabled,
    fastModeEnabled: supportsFastMode && modelOptions?.claudeAgent?.fastMode === true,
    options,
    ultrathinkPromptControlled:
      supportsClaudeUltrathinkKeyword(model) && isClaudeUltrathinkPrompt(prompt),
    supportsFastMode,
  };
}

export function composerTraitsLabel(
  provider: ProviderKind,
  model: string,
  prompt: string,
  modelOptions: ProviderModelOptions | null | undefined,
): string | null {
  if (provider === "codex") {
    const { effort, fastModeEnabled } = getCodexTraits(modelOptions);
    return [formatReasoningEffortLabel(effort), ...(fastModeEnabled ? ["Fast"] : [])].join(" · ");
  }

  const { effort, thinkingEnabled, fastModeEnabled, ultrathinkPromptControlled, supportsFastMode } =
    getClaudeTraits(model, prompt, modelOptions);
  const label = [
    ultrathinkPromptControlled
      ? "Ultrathink"
      : effort
        ? formatReasoningEffortLabel(effort)
        : thinkingEnabled === null
          ? null
          : `Thinking ${thinkingEnabled ? "On" : "Off"}`,
    ...(supportsFastMode && fastModeEnabled ? ["Fast"] : []),
  ]
    .filter(Boolean)
    .join(" · ");
  return label || null;
}

export function getDispatchModelOptions(
  provider: ProviderKind | string,
  model: string,
  modelOptions: ProviderModelOptions | null | undefined,
): ProviderModelOptions | undefined {
  if (provider === "codex") {
    const normalized = normalizeCodexModelOptions(modelOptions?.codex);
    return normalized ? { codex: normalized } : undefined;
  }
  if (provider !== "claudeAgent") {
    return undefined;
  }
  const normalized = normalizeClaudeModelOptions(model, modelOptions?.claudeAgent);
  return normalized ? { claudeAgent: normalized } : undefined;
}

export function modelOptionSelectionsForDispatch(
  provider: ProviderKind,
  modelOptions: ProviderModelOptions | null | undefined,
  providerOptionSelections: ReadonlyArray<ProviderOptionSelection> | null | undefined,
  descriptors: ReadonlyArray<ProviderOptionDescriptor> | null | undefined,
): ReadonlyArray<ProviderOptionSelection> | undefined {
  const merged = mergeProviderOptionSelections(
    modelOptionsToProviderOptionSelections(provider, modelOptions),
    providerOptionSelections,
  );
  if (!descriptors || descriptors.length === 0) {
    return merged;
  }
  return filterProviderOptionSelectionsForDescriptors(merged, descriptors);
}

export function composerTraitsIcon(provider: ProviderKind): string {
  return provider === "claudeAgent" ? "󰚩" : "󰔟";
}

export function runtimeFooterLabel(mode: RuntimeMode): string {
  return mode === "full-access" ? "Full access" : "Approval";
}

export function runtimeFooterIcon(mode: RuntimeMode): string {
  return mode === "full-access" ? "󰌾" : "󰌽";
}
