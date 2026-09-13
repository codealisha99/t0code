export type SidebarContextMenuActionId =
  | "rename"
  | "mark-unread"
  | "open-editor"
  | "open-folder"
  | "copy-path"
  | "copy-thread-id"
  | "archive"
  | "unarchive"
  | "delete";

export type ThreadSelectionState = {
  selectedThreadIds: ReadonlySet<string>;
  anchorThreadId: string | null;
};

export type SidebarContextMenuItem = {
  id: SidebarContextMenuActionId;
  label: string;
  destructive?: boolean;
};

export type ProjectRemovalConfirmStep = {
  title: string;
  body?: string;
  confirmLabel: string;
};

export function buildThreadContextMenuItems(
  input: { archived?: boolean } = {},
): readonly SidebarContextMenuItem[] {
  return [
    { id: "rename", label: "Rename thread" },
    { id: "mark-unread", label: "Mark unread" },
    { id: "open-editor", label: "Open in Editor" },
    { id: "open-folder", label: "Open Folder" },
    { id: "copy-path", label: "Copy Path" },
    { id: "copy-thread-id", label: "Copy Thread ID" },
    input.archived === true
      ? { id: "unarchive", label: "Unarchive" }
      : { id: "archive", label: "Archive" },
    { id: "delete", label: "Delete", destructive: true },
  ];
}

export function buildProjectContextMenuItems(): readonly SidebarContextMenuItem[] {
  return [
    { id: "open-editor", label: "Open in Editor" },
    { id: "open-folder", label: "Open Folder" },
    { id: "delete", label: "Remove project", destructive: true },
  ];
}

export function buildProjectRemovalConfirmSteps(
  projectTitle: string,
  threadCount: number,
): readonly ProjectRemovalConfirmStep[] {
  if (threadCount <= 0) {
    return [
      {
        title: `Remove project "${projectTitle}"?`,
        confirmLabel: "Remove",
      },
    ];
  }

  const threadLabel = `${threadCount} thread${threadCount === 1 ? "" : "s"}`;
  return [
    {
      title: `Remove project "${projectTitle}"?`,
      body: `Removing this project will also remove ${threadLabel}. Continue to confirm.`,
      confirmLabel: "Continue",
    },
    {
      title: `Remove project "${projectTitle}" and ${threadLabel}?`,
      body: "This permanently removes the project and all conversation history inside it.",
      confirmLabel: "Remove project",
    },
  ];
}

export function buildMultiSelectContextMenuItems(input: {
  count: number;
  archived?: boolean;
}): readonly SidebarContextMenuItem[] {
  return [
    { id: "mark-unread", label: `Mark unread (${input.count})` },
    input.archived === true
      ? { id: "unarchive", label: `Unarchive (${input.count})` }
      : { id: "archive", label: `Archive (${input.count})` },
    { id: "delete", label: `Delete (${input.count})`, destructive: true },
  ];
}

export {
  markThreadUnreadLocally,
  clearLocallyUnreadThread,
  toggleThreadSelection,
  rangeSelectThreads,
  clearThreadSelection,
  removeFromThreadSelection,
} from "@t3tools/client-core/threadSelection";
