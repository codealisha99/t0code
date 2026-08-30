export type CommandPaletteItem = {
  readonly id: string;
  readonly section: string;
  readonly icon: string;
  readonly label: string;
  readonly description?: string | undefined;
  readonly trailingLabel?: string | undefined;
  readonly keywords: readonly string[];
  readonly disabled?: boolean;
  readonly workspaceRoot?: string | undefined;
};

export function commandPaletteTextMatches(item: CommandPaletteItem, query: string): boolean {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = [
    item.section,
    item.label,
    item.description ?? "",
    item.trailingLabel ?? "",
    ...item.keywords,
  ]
    .join(" ")
    .toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}
