import { DEFAULT_TUI_THEME, type TuiPalette, type TuiTheme } from "./theme";

export const PALETTE: TuiPalette = { ...DEFAULT_TUI_THEME.palette };
export let ACTIVE_TUI_THEME: TuiTheme = DEFAULT_TUI_THEME;

export function applyActiveTuiTheme(theme: TuiTheme): void {
  ACTIVE_TUI_THEME = theme;
  Object.assign(PALETTE, theme.palette);
}
