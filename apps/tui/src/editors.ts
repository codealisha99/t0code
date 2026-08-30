import type { EditorId } from "@t3tools/contracts";

export function resolvePreferredEditor(availableEditors: readonly EditorId[]): EditorId | null {
  return availableEditors[0] ?? null;
}

export function resolvePreferredCodeEditor(availableEditors: readonly EditorId[]): EditorId | null {
  return availableEditors.find((editor) => editor !== "file-manager") ?? null;
}

export function hasAvailableFileManager(availableEditors: readonly EditorId[]): boolean {
  return availableEditors.includes("file-manager");
}
