import * as fs from "node:fs/promises";
import path from "node:path";

import { expandUserPath } from "./workspacePaths";

export function scoreDirectorySuggestion(candidate: string, query: string): number {
  const candidateName = path.basename(candidate).toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return 0;
  if (candidate.toLowerCase() === normalizedQuery) return 5;
  if (candidateName === normalizedQuery) return 4;
  if (candidateName.startsWith(normalizedQuery)) return 3;
  if (candidate.toLowerCase().includes(normalizedQuery)) return 2;
  return 1;
}

export async function listDirectorySuggestions(input: string, homeDir: string): Promise<string[]> {
  const trimmed = input.trim();
  const expanded = expandUserPath(trimmed, homeDir);
  const targetPath = trimmed ? path.resolve(expanded) : process.cwd();
  const searchingWithinDirectory = /[\\/]$/.test(expanded);
  const searchRoot = searchingWithinDirectory ? targetPath : path.dirname(targetPath);
  const query = searchingWithinDirectory ? "" : path.basename(targetPath).toLowerCase();

  try {
    const entries = await fs.readdir(searchRoot, { withFileTypes: true });
    const directories = await Promise.all(
      entries.map(async (entry) => {
        if (entry.isDirectory()) return path.join(searchRoot, entry.name);
        if (!entry.isSymbolicLink()) return null;
        const candidatePath = path.join(searchRoot, entry.name);
        try {
          const stat = await fs.stat(candidatePath);
          return stat.isDirectory() ? candidatePath : null;
        } catch {
          return null;
        }
      }),
    );

    return directories
      .filter((candidate): candidate is string => candidate !== null)
      .filter((candidate) => (query ? candidate.toLowerCase().includes(query) : true))
      .toSorted((left, right) => {
        const byScore =
          scoreDirectorySuggestion(right, query) - scoreDirectorySuggestion(left, query);
        if (byScore !== 0) return byScore;
        return left.localeCompare(right);
      })
      .slice(0, 6);
  } catch {
    return [];
  }
}
