import type { TuiPalette, TuiTheme } from "./theme";

/** Dimensions are terminal cells, never pixels. Keep dense controls one row tall. */
export const TUI_METRICS = {
  space: { none: 0, inline: 1, panel: 2, section: 3 },
  control: { height: 1, iconWidth: 3 },
  headerHeight: 3,
  sidebarWidth: 34,
} as const;

/** Selected, disabled, and hover states use the same precedence on every control. */
export function controlColors(
  theme: TuiTheme,
  state: {
    active?: boolean | undefined;
    disabled?: boolean | undefined;
    hovered?: boolean | undefined;
    primary?: boolean | undefined;
    inset?: boolean | undefined;
  },
) {
  const p = theme.palette;
  if (state.disabled) {
    return { foreground: p.subtle, background: state.inset ? p.controlInset : p.control };
  }
  if (state.primary) {
    return {
      foreground: theme.colors.primaryButtonText,
      background: state.hovered ? p.composerSendHover : p.composerSend,
    };
  }
  return {
    foreground: state.active || state.hovered ? p.text : p.muted,
    background: state.active
      ? p.controlActive
      : state.hovered
        ? state.inset
          ? p.controlInsetHover
          : p.controlHover
        : state.inset
          ? p.controlInset
          : p.control,
  };
}

/** Syntax inherits semantic contrast in dark, light, and terminal-match themes. */
export function syntaxColors(palette: TuiPalette) {
  return {
    keyword: palette.accent,
    string: palette.success,
    comment: palette.subtle,
    number: palette.warning,
    function: palette.info,
    type: palette.warning,
    operator: palette.muted,
    variable: palette.text,
    property: palette.info,
    constant: palette.warning,
    tag: palette.accent,
    attribute: palette.success,
    punctuation: palette.muted,
  };
}
