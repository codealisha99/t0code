import type {
  SourceControlProviderAuth,
  SourceControlProviderDiscoveryItem,
  VcsDiscoveryItem,
} from "@t3tools/contracts";

import { PALETTE } from "./tuiThemeState";
import type { TuiColor } from "./theme";

export function authStatusLabel(auth: SourceControlProviderAuth): string {
  switch (auth.status) {
    case "authenticated":
      return "Authenticated";
    case "unauthenticated":
      return "Sign-in needed";
    case "unknown":
      return "Unknown auth";
  }
}

export function sourceControlStatusColor(input: {
  readonly status: "available" | "missing";
  readonly implemented?: boolean;
  readonly auth?: SourceControlProviderAuth;
}): TuiColor {
  if (input.implemented === false) return PALETTE.subtle;
  if (input.status !== "available") return PALETTE.warning;
  if (input.auth && input.auth.status !== "authenticated") return PALETTE.warning;
  return PALETTE.success;
}

export function vcsSummary(item: VcsDiscoveryItem): string {
  if (!item.implemented) return `Support for ${item.label} is coming soon.`;
  if (item.status !== "available") return `Not available on this server: ${item.installHint}`;
  return "Available";
}

export function sourceControlProviderSummary(item: SourceControlProviderDiscoveryItem): string {
  if (item.status !== "available") return `Not available on this server: ${item.installHint}`;
  if (item.auth.status === "authenticated") {
    return item.auth.account
      ? `${item.auth.account}${item.auth.host ? ` on ${item.auth.host}` : ""}`
      : "Authenticated";
  }
  return item.auth.detail ?? item.detail ?? item.installHint;
}
