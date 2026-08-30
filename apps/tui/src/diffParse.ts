export type ParsedDiffFile = {
  readonly key: string;
  readonly filePath: string;
  readonly patch: string;
  readonly addedLines: number;
  readonly removedLines: number;
  readonly filetype?: string;
};

const OPEN_TUI_DIFF_METADATA_PREFIXES = [
  "diff --git ",
  "index ",
  "new file mode ",
  "deleted file mode ",
  "old mode ",
  "new mode ",
  "similarity index ",
  "rename from ",
  "rename to ",
] as const;

export function summarizeDiffPatch(patch: string): { addedLines: number; removedLines: number } {
  let addedLines = 0;
  let removedLines = 0;

  for (const line of patch.split("\n")) {
    if (line.startsWith("+++ ") || line.startsWith("--- ")) {
      continue;
    }
    if (line.startsWith("+")) {
      addedLines++;
      continue;
    }
    if (line.startsWith("-")) {
      removedLines++;
    }
  }

  return { addedLines, removedLines };
}

export function normalizePatchForOpenTuiDiff(patch: string): string {
  const lines = patch
    .trimEnd()
    .split("\n")
    .filter((line) => !OPEN_TUI_DIFF_METADATA_PREFIXES.some((prefix) => line.startsWith(prefix)));
  const normalizedLines: string[] = [];

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] ?? "";
    const hunkMatch = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@(.*)$/.exec(line);
    if (!hunkMatch) {
      normalizedLines.push(line);
      continue;
    }

    const oldStart = Number(hunkMatch[1]);
    const newStart = Number(hunkMatch[3]);
    let oldCount = 0;
    let newCount = 0;

    for (let cursor = index + 1; cursor < lines.length; cursor++) {
      const bodyLine = lines[cursor] ?? "";
      if (bodyLine.startsWith("@@ ")) {
        break;
      }
      if (bodyLine.startsWith("-")) {
        oldCount++;
        continue;
      }
      if (bodyLine.startsWith("+")) {
        newCount++;
        continue;
      }
      if (bodyLine.startsWith(" ")) {
        oldCount++;
        newCount++;
      }
    }

    normalizedLines.push(`@@ -${oldStart},${oldCount} +${newStart},${newCount} @@${hunkMatch[5]}`);
  }

  return normalizedLines.join("\n");
}

export function parseDiffFiles(
  diffText: string,
  resolveFiletype?: (filePath: string) => string | undefined,
): ParsedDiffFile[] {
  const normalized = diffText.trim();
  if (normalized.length === 0) {
    return [];
  }

  const lines = normalized.split("\n");
  const files: ParsedDiffFile[] = [];
  let currentLines: string[] = [];
  let currentPath: string | null = null;
  let fallbackIndex = 0;

  function commitCurrentFile() {
    if (currentLines.length === 0) {
      return;
    }

    const patch = normalizePatchForOpenTuiDiff(currentLines.join("\n"));
    const filePath = currentPath ?? `diff-${fallbackIndex + 1}`;
    const { addedLines, removedLines } = summarizeDiffPatch(patch);
    const filetype = resolveFiletype?.(filePath);

    files.push({
      key: `${filePath}:${fallbackIndex}`,
      filePath,
      patch,
      addedLines,
      removedLines,
      ...(filetype ? { filetype } : {}),
    });

    fallbackIndex++;
    currentLines = [];
    currentPath = null;
  }

  for (const line of lines) {
    const diffGitMatch = /^diff --git a\/(.+?) b\/(.+)$/.exec(line);
    if (diffGitMatch) {
      commitCurrentFile();
      currentPath = diffGitMatch[2] ?? diffGitMatch[1] ?? null;
    } else if (line.startsWith("+++ ")) {
      const nextPath = line.slice(4).trim();
      if (nextPath !== "/dev/null") {
        currentPath = nextPath.replace(/^b\//, "");
      }
    } else if (line.startsWith("--- ")) {
      const previousPath = line.slice(4).trim();
      if (!currentPath && previousPath !== "/dev/null") {
        currentPath = previousPath.replace(/^a\//, "");
      }
    }

    currentLines.push(line);
  }

  commitCurrentFile();
  return files;
}
