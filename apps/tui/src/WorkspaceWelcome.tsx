import { TextAttributes } from "@opentui/core";
import { TUI_METRICS } from "./designSystem";
import type { TuiTheme } from "./theme";

/** A quiet, content-sized introduction that remains scrollable in short terminals. */
export function WorkspaceWelcome(props: {
  theme: TuiTheme;
  hasProject: boolean;
  loading: boolean;
  compact: boolean;
}) {
  const p = props.theme.palette;
  return (
    <box
      style={{
        flexDirection: "column",
        paddingLeft: TUI_METRICS.space.panel,
        paddingRight: TUI_METRICS.space.panel,
        paddingTop: props.compact ? 1 : TUI_METRICS.space.section,
        paddingBottom: props.compact ? 1 : TUI_METRICS.space.panel,
        gap: 1,
      }}
    >
      <text
        content={
          props.loading
            ? "Opening your workspace…"
            : props.hasProject
              ? "What are we building?"
              : "Your next idea starts here."
        }
        style={{ fg: p.text, attributes: TextAttributes.BOLD }}
      />
      <text
        content={
          props.loading
            ? "Connecting to your projects and conversations."
            : props.hasProject
              ? props.compact
                ? "Describe a change or ask a question."
                : "Describe a change, investigate a bug, or think through a plan."
              : "Add a project with + in the sidebar to start a conversation."
        }
        style={{ fg: p.muted }}
      />
      {!props.loading && props.hasProject && !props.compact ? (
        <box
          style={{
            flexDirection: "column",
            border: ["left"],
            borderColor: p.accent,
            paddingLeft: TUI_METRICS.space.panel,
            marginTop: 1,
            gap: 1,
          }}
        >
          <text content="Build    Describe what you want to change." style={{ fg: p.text }} />
          <text content="Explore  Ask how a part of the codebase works." style={{ fg: p.text }} />
          <text content="Plan     Work through an approach before coding." style={{ fg: p.text }} />
        </box>
      ) : null}
      {!props.loading && props.hasProject ? (
        <text
          content={
            props.compact ? "@ files   / commands" : "@ reference files    / browse commands"
          }
          style={{ fg: p.subtle, marginTop: 1 }}
        />
      ) : null}
    </box>
  );
}
