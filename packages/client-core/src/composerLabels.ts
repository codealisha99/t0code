export function formatReasoningEffortLabel(effort: string): string {
  if (effort === "none") return "No reasoning";
  if (effort === "xhigh") return "Extra High";
  if (effort === "max") return "Max";
  if (effort === "ultracode") return "Ultracode";
  if (effort === "ultrathink") return "Ultrathink";
  return effort.slice(0, 1).toUpperCase() + effort.slice(1);
}

export function truncateToolbarLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) {
    return label;
  }

  if (maxLength <= 1) {
    return "…";
  }

  return `${label.slice(0, maxLength - 1).trimEnd()}…`;
}

export function interactionLabel(mode: "default" | "plan"): string {
  return mode === "plan" ? "Plan" : "Chat";
}

export function interactionIcon(mode: "default" | "plan"): string {
  return mode === "plan" ? "󰨖" : "󰍩";
}

export function providerIcon(provider: string | null | undefined): string {
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
