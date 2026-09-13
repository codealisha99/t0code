import {
  collapseProject as coreCollapseProject,
  ensureProjectExpanded as coreEnsureProjectExpanded,
  pruneExpandedProjects as corePruneExpandedProjects,
} from "@t3tools/client-core/threadSelection";

export function ensureProjectExpanded(
  expandedProjectIds: ReadonlySet<string>,
  projectId: string,
): ReadonlySet<string> {
  return coreEnsureProjectExpanded(expandedProjectIds, projectId);
}

export function collapseProject(
  expandedProjectIds: ReadonlySet<string>,
  projectId: string,
): ReadonlySet<string> {
  return coreCollapseProject(expandedProjectIds, projectId);
}

export function pruneExpandedProjects(
  expandedProjectIds: ReadonlySet<string>,
  projectIds: readonly string[],
): ReadonlySet<string> {
  return corePruneExpandedProjects(expandedProjectIds, new Set(projectIds));
}

export function resolveProjectExpansionOnRowPress(input: {
  expandedProjectIds: ReadonlySet<string>;
  projectId: string;
  isProjectActive: boolean;
}): ReadonlySet<string> {
  const { expandedProjectIds, projectId, isProjectActive } = input;
  if (!expandedProjectIds.has(projectId)) {
    return ensureProjectExpanded(expandedProjectIds, projectId);
  }
  return isProjectActive ? collapseProject(expandedProjectIds, projectId) : expandedProjectIds;
}

export function resolveProjectPrimaryAction(input: {
  activeProjectId: string | undefined;
  expandedProjectIds: ReadonlySet<string>;
  threadCount: number;
}): "open-project-path" | "expand-project" | "focus-threads" | "create-thread" {
  const { activeProjectId, expandedProjectIds, threadCount } = input;
  if (!activeProjectId) return "open-project-path";
  if (!expandedProjectIds.has(activeProjectId)) return "expand-project";
  if (threadCount > 0) return "focus-threads";
  return "create-thread";
}
