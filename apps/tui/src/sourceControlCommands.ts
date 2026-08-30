import path from "node:path";
import type {
  SourceControlCloneProtocol,
  SourceControlCloneRepositoryInput,
  SourceControlProviderKind,
  SourceControlRepositoryVisibility,
} from "@t3tools/contracts";

export type ParsedPublishCommandArgs = {
  readonly repository: string;
  readonly provider: SourceControlProviderKind;
  readonly visibility: SourceControlRepositoryVisibility;
  readonly protocol: SourceControlCloneProtocol;
  readonly remoteName: string;
};

export function normalizeSourceControlCommandProvider(
  value: string,
): SourceControlProviderKind | null {
  switch (value) {
    case "github":
    case "gh":
      return "github";
    case "gitlab":
    case "glab":
      return "gitlab";
    case "azure":
    case "azure-devops":
    case "az":
      return "azure-devops";
    case "bitbucket":
    case "bb":
      return "bitbucket";
    default:
      return null;
  }
}

export function isRemoteUrlLike(source: string): boolean {
  return (
    /^[a-z][a-z0-9+.-]*:\/\//i.test(source) ||
    /^[^@\s]+@[^:\s]+:[^\s]+$/i.test(source) ||
    source.startsWith("git@")
  );
}

export function cloneDirectoryNameFromSource(source: string): string {
  const trimmed = source
    .trim()
    .replace(/\/+$/, "")
    .replace(/\.git$/i, "");
  const segments = trimmed.split(/[/:]/);
  for (let index = segments.length - 1; index >= 0; index -= 1) {
    const segment = segments[index];
    if (segment) {
      return segment;
    }
  }
  return "repository";
}

export function parsePublishCommandArgs(args: string): ParsedPublishCommandArgs | null {
  const tokens = args.trim().split(/\s+/).filter(Boolean);
  const repository = tokens[0]?.trim() ?? "";
  if (!repository || !repository.includes("/")) {
    return null;
  }

  let provider: SourceControlProviderKind = "github";
  let visibility: SourceControlRepositoryVisibility = "private";
  let protocol: SourceControlCloneProtocol = "ssh";
  let remoteName = "origin";

  for (const token of tokens.slice(1)) {
    const normalized = token.toLowerCase();
    if (normalized === "private" || normalized === "public") {
      visibility = normalized;
    } else if (normalized === "ssh" || normalized === "https" || normalized === "auto") {
      protocol = normalized;
    } else if (normalized.startsWith("remote=")) {
      const nextRemoteName = token.slice("remote=".length).trim();
      if (nextRemoteName) {
        remoteName = nextRemoteName;
      }
    } else if (normalized.startsWith("provider=")) {
      const nextProvider = normalizeSourceControlCommandProvider(
        normalized.slice("provider=".length),
      );
      if (nextProvider) {
        provider = nextProvider;
      }
    } else {
      const nextProvider = normalizeSourceControlCommandProvider(normalized);
      if (nextProvider) {
        provider = nextProvider;
      }
    }
  }

  return {
    provider,
    repository,
    visibility,
    protocol,
    remoteName,
  };
}

export function parseCloneCommandArgs(
  args: string,
  defaultDestinationParent: string,
): SourceControlCloneRepositoryInput | null {
  const tokens = args.trim().split(/\s+/).filter(Boolean);
  const source = tokens[0]?.trim() ?? "";
  if (!source) {
    return null;
  }

  let provider: SourceControlProviderKind = "github";
  let protocol: SourceControlCloneProtocol | undefined;
  let destinationPath: string | null = null;
  for (const token of tokens.slice(1)) {
    const normalized = token.toLowerCase();
    if (normalized === "ssh" || normalized === "https" || normalized === "auto") {
      protocol = normalized;
    } else if (normalized.startsWith("provider=")) {
      const nextProvider = normalizeSourceControlCommandProvider(
        normalized.slice("provider=".length),
      );
      if (nextProvider) {
        provider = nextProvider;
      }
    } else {
      const nextProvider = normalizeSourceControlCommandProvider(normalized);
      if (nextProvider) {
        provider = nextProvider;
      } else if (!destinationPath) {
        destinationPath = token;
      }
    }
  }

  const cloneInput: SourceControlCloneRepositoryInput = {
    destinationPath:
      destinationPath ?? path.join(defaultDestinationParent, cloneDirectoryNameFromSource(source)),
    ...(protocol ? { protocol } : {}),
  };

  if (isRemoteUrlLike(source)) {
    return {
      ...cloneInput,
      remoteUrl: source,
    };
  }

  return {
    ...cloneInput,
    provider,
    repository: source,
  };
}
