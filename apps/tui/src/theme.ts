import type { AppTheme } from "@t3tools/client-core";

export interface TerminalColors {
  readonly palette: readonly (string | null)[];
  readonly defaultForeground: string | null;
  readonly defaultBackground: string | null;
  readonly cursorColor: string | null;
  readonly mouseForeground: string | null;
  readonly mouseBackground: string | null;
  readonly tekForeground: string | null;
  readonly tekBackground: string | null;
  readonly highlightBackground: string | null;
  readonly highlightForeground: string | null;
}

export type TuiColor = string;

export const TERMINAL_MATCH_THEME_ID = "terminal-match" as const;
export const TUI_THEME_IDS = ["default", TERMINAL_MATCH_THEME_ID] as const;
export type TuiThemeId = (typeof TUI_THEME_IDS)[number];
export const DEFAULT_TUI_THEME_ID = "default" as const;
export const TUI_THEME_LABELS: Record<TuiThemeId, string> = {
  default: "Default",
  [TERMINAL_MATCH_THEME_ID]: "Terminal Match",
};

export type TuiThemeMode = "light" | "dark";

type TuiThemeDetails = {
  attachmentPillTones: readonly { backgroundColor: TuiColor; textColor: TuiColor }[];
  codeBlock: { background: TuiColor; language: TuiColor; copyIcon: TuiColor };
  status: { awaitingInput: TuiColor; working: TuiColor; planReady: TuiColor; pulse: TuiColor };
  diffViewer: {
    addedBg: TuiColor;
    removedBg: TuiColor;
    addedContentBg: TuiColor;
    removedContentBg: TuiColor;
    addedSignColor: TuiColor;
    removedSignColor: TuiColor;
  };
  colors: {
    workEntryErrorAccent: TuiColor;
    destructiveIcon: TuiColor;
    controlKnob: TuiColor;
    primaryButtonText: TuiColor;
    sendDotIdle: TuiColor;
    sendDotActive: TuiColor;
    selectedText: TuiColor;
  };
};

export interface ResolveTuiThemeOptions {
  systemMode?: TuiThemeMode | null;
  terminalColors?: TerminalColors | null;
}

const DEFAULT_DARK_PALETTE = {
  canvas: "#16181d",
  sidebar: "#111318",
  main: "#16181d",
  surface: "#1e2128",
  surfaceAlt: "#262a33",
  input: "#111318",
  surfaceUser: "#242b38",
  surfacePlan: "#1d2b25",
  surfaceWarn: "#302719",
  surfaceInfo: "#202c42",
  footer: "#16181d",
  diff: "#1e2128",
  popup: "#22262e",
  scrim: "#00000099",
  border: "#363c48",
  divider: "#292e38",
  control: "transparent",
  controlHover: "#2b303a",
  controlActive: "#293951",
  controlActiveStrong: "#344763",
  controlInset: "#191c23",
  controlInsetHover: "#262a33",
  composerPanel: "#1e2128",
  composerBorder: "#82aaff",
  composerBorderMuted: "#454e5e",
  composerSend: "#245bd6",
  composerSendHover: "#1e4fbc",
  composerStop: "#dc2626",
  composerStopHover: "#ef4444",
  accent: "#82aaff",
  cursor: "#edf0f7",
  selection: "#293e61",
  selectionActive: "#334f7a",
  text: "#edf0f7",
  muted: "#b0b8c8",
  subtle: "#929caf",
  success: "#78dba9",
  info: "#82b5ff",
  warning: "#edc078",
  claude: "#d97757",
} satisfies Record<string, TuiColor>;

type TuiPaletteShape = typeof DEFAULT_DARK_PALETTE;
export type TuiPalette = { [Key in keyof TuiPaletteShape]: TuiColor };

const DEFAULT_THEME_DETAILS = {
  attachmentPillTones: [
    { backgroundColor: "#1d2026", textColor: "#82b5ff" },
    { backgroundColor: "#241b2f", textColor: "#a78bfa" },
    { backgroundColor: "#2a2417", textColor: "#facc15" },
    { backgroundColor: "#2a1b1b", textColor: "#f87171" },
    { backgroundColor: "#1c2721", textColor: "#34d399" },
    { backgroundColor: "#272019", textColor: "#fb923c" },
  ],
  codeBlock: {
    background: "#111318",
    language: "#b0b8c8",
    copyIcon: "#b0b8c8",
  },
  status: {
    awaitingInput: "#818cf8",
    working: "#7dd3fc",
    planReady: "#a78bfa",
    pulse: "#3b82f6",
  },
  diffViewer: {
    addedBg: "#173124",
    removedBg: "#3a1f1f",
    addedContentBg: "#1d3a2b",
    removedContentBg: "#442525",
    addedSignColor: "#4ade80",
    removedSignColor: "#f87171",
  },
  colors: {
    workEntryErrorAccent: "#fda4af",
    destructiveIcon: "#fda4af",
    controlKnob: "#f5f5f5",
    primaryButtonText: "#f5f5f5",
    sendDotIdle: "#6b7280",
    sendDotActive: "#d1d5db",
    selectedText: "#f5f5f5",
  },
} satisfies TuiThemeDetails;

export type TuiTheme = {
  id: TuiThemeId;
  mode: TuiThemeMode;
  palette: TuiPalette;
} & TuiThemeDetails;

const DEFAULT_DARK_THEME: TuiTheme = {
  id: "default",
  mode: "dark",
  palette: DEFAULT_DARK_PALETTE,
  ...DEFAULT_THEME_DETAILS,
};

const DEFAULT_LIGHT_PALETTE: TuiPalette = {
  ...DEFAULT_DARK_PALETTE,
  canvas: "#f5f6f8",
  sidebar: "#eceef2",
  main: "#f5f6f8",
  surface: "#ffffff",
  surfaceAlt: "#e9edf3",
  input: "#ffffff",
  surfaceUser: "#e7edf7",
  surfacePlan: "#e6f3eb",
  surfaceWarn: "#fff1d6",
  surfaceInfo: "#e7efff",
  footer: "#f5f6f8",
  diff: "#ffffff",
  popup: "#ffffff",
  scrim: "#00000022",
  border: "#bec6d3",
  divider: "#d7dce5",
  controlHover: "#dfe5ee",
  controlActive: "#d6e3fa",
  controlActiveStrong: "#c5d7f5",
  controlInset: "#e3e7ee",
  controlInsetHover: "#d7dfe9",
  composerPanel: "#ffffff",
  composerBorder: "#245bd6",
  composerBorderMuted: "#9aa7bc",
  composerSend: "#245bd6",
  composerSendHover: "#1e4fbc",
  accent: "#245bd6",
  cursor: "#202631",
  selection: "#d6e3fa",
  selectionActive: "#c5d7f5",
  text: "#202631",
  muted: "#505d70",
  subtle: "#5b687b",
  success: "#216e49",
  info: "#245bd6",
  warning: "#875900",
  claude: "#a4472d",
};

const DEFAULT_LIGHT_THEME: TuiTheme = {
  ...DEFAULT_DARK_THEME,
  id: "default",
  mode: "light",
  palette: DEFAULT_LIGHT_PALETTE,
  attachmentPillTones: [
    { backgroundColor: "#e7efff", textColor: "#245bd6" },
    { backgroundColor: "#efe7fa", textColor: "#7040a0" },
    { backgroundColor: "#fff1d6", textColor: "#875900" },
    { backgroundColor: "#ffe9eb", textColor: "#b4233a" },
    { backgroundColor: "#e6f3eb", textColor: "#216e49" },
    { backgroundColor: "#ffeadf", textColor: "#a4472d" },
  ],
  codeBlock: { background: "#e9edf3", language: "#505d70", copyIcon: "#505d70" },
  status: {
    awaitingInput: "#245bd6",
    working: "#245bd6",
    planReady: "#7040a0",
    pulse: "#245bd6",
  },
  diffViewer: {
    addedBg: "#dcefe2",
    removedBg: "#f9e0e4",
    addedContentBg: "#e6f3eb",
    removedContentBg: "#ffe9eb",
    addedSignColor: "#216e49",
    removedSignColor: "#b4233a",
  },
  colors: {
    ...DEFAULT_DARK_THEME.colors,
    selectedText: "#202631",
    workEntryErrorAccent: "#b4233a",
    destructiveIcon: "#b4233a",
    sendDotIdle: "#606d80",
  },
};

export const DEFAULT_TUI_THEME = DEFAULT_DARK_THEME;

function defaultThemeForMode(mode: TuiThemeMode): TuiTheme {
  return mode === "light" ? DEFAULT_LIGHT_THEME : DEFAULT_DARK_THEME;
}

type RgbaColor = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
};

interface SystemThemeCurrent {
  readonly primary: RgbaColor;
  readonly secondary: RgbaColor;
  readonly accent: RgbaColor;
  readonly error: RgbaColor;
  readonly warning: RgbaColor;
  readonly success: RgbaColor;
  readonly info: RgbaColor;
  readonly text: RgbaColor;
  readonly textMuted: RgbaColor;
  readonly selectedListItemText: RgbaColor;
  readonly background: RgbaColor;
  readonly backgroundPanel: RgbaColor;
  readonly backgroundElement: RgbaColor;
  readonly backgroundMenu: RgbaColor;
  readonly border: RgbaColor;
  readonly borderActive: RgbaColor;
  readonly borderSubtle: RgbaColor;
  readonly diffHighlightAdded: RgbaColor;
  readonly diffHighlightRemoved: RgbaColor;
  readonly diffAddedBg: RgbaColor;
  readonly diffRemovedBg: RgbaColor;
  readonly diffAddedLineNumberBg: RgbaColor;
  readonly diffRemovedLineNumberBg: RgbaColor;
}

type SystemTheme = SystemThemeCurrent & {
  _hasSelectedListItemText: boolean;
};

type SystemThemeColor = keyof SystemThemeCurrent;
type HexColor = `#${string}`;
type RefName = string;
type Variant = {
  dark: HexColor | RefName;
  light: HexColor | RefName;
};
type ColorValue = HexColor | RefName | Variant | RgbaColor | number;

type ThemeJson = {
  defs?: Record<string, HexColor | RefName>;
  theme: Omit<Record<SystemThemeColor, ColorValue>, "selectedListItemText" | "backgroundMenu"> & {
    selectedListItemText?: ColorValue;
    backgroundMenu?: ColorValue;
  };
};

const ANSI_COLOR_FALLBACKS = [
  "#000000",
  "#800000",
  "#008000",
  "#808000",
  "#000080",
  "#800080",
  "#008080",
  "#c0c0c0",
  "#808080",
  "#ff0000",
  "#00ff00",
  "#ffff00",
  "#0000ff",
  "#ff00ff",
  "#00ffff",
  "#ffffff",
] as const;

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function isRgbaColor(value: unknown): value is RgbaColor {
  return (
    typeof value === "object" &&
    value !== null &&
    "r" in value &&
    "g" in value &&
    "b" in value &&
    "a" in value
  );
}

function fromInts(r: number, g: number, b: number, a = 255): RgbaColor {
  return {
    r: clampByte(r),
    g: clampByte(g),
    b: clampByte(b),
    a: clampByte(a),
  };
}

function rgbaFromHex(hex: string): RgbaColor {
  const normalized = hex.trim().replace(/^#/, "");
  const expanded =
    normalized.length === 3 || normalized.length === 4
      ? normalized
          .split("")
          .map((value) => value + value)
          .join("")
      : normalized;

  if (expanded.length !== 6 && expanded.length !== 8) {
    throw new Error(`Unsupported color format: ${hex}`);
  }

  return fromInts(
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
    expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) : 255,
  );
}

function formatHexChannel(value: number): string {
  return value.toString(16).padStart(2, "0");
}

function rgbaToHex(color: RgbaColor): TuiColor {
  const base = `#${formatHexChannel(color.r)}${formatHexChannel(color.g)}${formatHexChannel(color.b)}`;
  return color.a === 255 ? base : `${base}${formatHexChannel(color.a)}`;
}

function luminanceFromColor(color: RgbaColor): number {
  return (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
}

function systemBackgroundHex(colors: TerminalColors): string | null {
  return colors.defaultBackground ?? colors.palette[0] ?? null;
}

function systemForegroundHex(colors: TerminalColors): string | null {
  return colors.defaultForeground ?? colors.palette[7] ?? null;
}

export function isTuiThemeId(value: unknown): value is TuiThemeId {
  return typeof value === "string" && (TUI_THEME_IDS as readonly string[]).includes(value);
}

export function normalizeTuiThemeId(value: unknown): TuiThemeId {
  return isTuiThemeId(value) ? value : DEFAULT_TUI_THEME_ID;
}

export function hasUsableTerminalColors(
  colors: TerminalColors | null | undefined,
): colors is TerminalColors {
  return Boolean(colors && systemBackgroundHex(colors) && systemForegroundHex(colors));
}

function luminanceFromHex(hex: string): number {
  return luminanceFromColor(rgbaFromHex(hex));
}

function ansiCubeComponent(value: number): number {
  return value === 0 ? 0 : value * 40 + 55;
}

function ansiToRgba(code: number): RgbaColor {
  if (code < 16) {
    return rgbaFromHex(ANSI_COLOR_FALLBACKS[code] ?? "#000000");
  }
  if (code < 232) {
    const index = code - 16;
    const b = index % 6;
    const g = Math.floor(index / 6) % 6;
    const r = Math.floor(index / 36);
    return fromInts(ansiCubeComponent(r), ansiCubeComponent(g), ansiCubeComponent(b));
  }
  if (code < 256) {
    const gray = (code - 232) * 10 + 8;
    return fromInts(gray, gray, gray);
  }
  return fromInts(0, 0, 0);
}

function resolveSystemTheme(theme: ThemeJson, mode: TuiThemeMode): SystemTheme {
  const defs = theme.defs ?? {};

  function resolveColor(color: ColorValue, chain: string[] = []): RgbaColor {
    if (isRgbaColor(color)) return color;
    if (typeof color === "string") {
      if (color === "transparent" || color === "none") return fromInts(0, 0, 0, 0);
      if (color.startsWith("#")) return rgbaFromHex(color);
      if (chain.includes(color)) {
        throw new Error(`Circular color reference: ${[...chain, color].join(" -> ")}`);
      }
      const next = defs[color] ?? theme.theme[color as SystemThemeColor];
      if (next === undefined) {
        throw new Error(`Color reference "${color}" not found in defs or theme`);
      }
      return resolveColor(next, [...chain, color]);
    }
    if (typeof color === "number") {
      return ansiToRgba(color);
    }
    return resolveColor(color[mode], chain);
  }

  const resolved = Object.fromEntries(
    Object.entries(theme.theme)
      .filter(([key]) => key !== "selectedListItemText" && key !== "backgroundMenu")
      .map(([key, value]) => [key, resolveColor(value as ColorValue)]),
  ) as Partial<Record<SystemThemeColor, RgbaColor>>;

  const hasSelectedListItemText = theme.theme.selectedListItemText !== undefined;
  if (hasSelectedListItemText) {
    resolved.selectedListItemText = resolveColor(theme.theme.selectedListItemText!);
  } else {
    resolved.selectedListItemText = resolved.background!;
  }

  if (theme.theme.backgroundMenu !== undefined) {
    resolved.backgroundMenu = resolveColor(theme.theme.backgroundMenu);
  } else {
    resolved.backgroundMenu = resolved.backgroundElement!;
  }

  return {
    ...(resolved as SystemThemeCurrent),
    _hasSelectedListItemText: hasSelectedListItemText,
  };
}

function selectedForeground(theme: SystemTheme, bg?: RgbaColor): RgbaColor {
  if (theme._hasSelectedListItemText) {
    return theme.selectedListItemText;
  }
  if (theme.background.a === 0) {
    return luminanceFromColor(bg ?? theme.primary) > 0.5
      ? fromInts(0, 0, 0)
      : fromInts(255, 255, 255);
  }
  return theme.background;
}

function tint(base: RgbaColor, overlay: RgbaColor, alpha: number): RgbaColor {
  return fromInts(
    base.r + (overlay.r - base.r) * alpha,
    base.g + (overlay.g - base.g) * alpha,
    base.b + (overlay.b - base.b) * alpha,
    base.a,
  );
}

function scaleChannels(bg: RgbaColor, luminance: number, nextLum: number): RgbaColor {
  if (luminance === 0) {
    return bg;
  }

  const ratio = nextLum / luminance;
  return fromInts(bg.r * ratio, bg.g * ratio, bg.b * ratio, bg.a);
}

function generateGrayScale(bg: RgbaColor, isDark: boolean): Record<number, RgbaColor> {
  const grays: Record<number, RgbaColor> = {};
  const luminance = 0.299 * bg.r + 0.587 * bg.g + 0.114 * bg.b;

  for (let index = 1; index <= 12; index++) {
    const factor = index / 12;
    let nextColor: RgbaColor;

    if (isDark) {
      if (luminance < 10) {
        const gray = factor * 0.4 * 255;
        nextColor = fromInts(gray, gray, gray);
      } else {
        const nextLum = luminance + (255 - luminance) * factor * 0.4;
        nextColor = scaleChannels(bg, luminance, nextLum);
      }
    } else if (luminance > 245) {
      const gray = 255 - factor * 0.4 * 255;
      nextColor = fromInts(gray, gray, gray);
    } else {
      const nextLum = luminance * (1 - factor * 0.4);
      nextColor = scaleChannels(bg, luminance, nextLum);
    }

    grays[index] = nextColor;
  }

  return grays;
}

function generateMutedTextColor(bg: RgbaColor, isDark: boolean): RgbaColor {
  const luminance = 0.299 * bg.r + 0.587 * bg.g + 0.114 * bg.b;
  const gray = isDark
    ? luminance < 10
      ? 180
      : Math.min(Math.floor(160 + luminance * 0.3), 200)
    : luminance > 245
      ? 75
      : Math.max(Math.floor(100 - (255 - luminance) * 0.2), 60);
  return fromInts(gray, gray, gray);
}

function generateSystem(colors: TerminalColors, mode: TuiThemeMode): ThemeJson {
  const backgroundHex = systemBackgroundHex(colors);
  const foregroundHex = systemForegroundHex(colors);
  if (!backgroundHex || !foregroundHex) {
    throw new Error("Terminal palette is incomplete");
  }

  const bg = rgbaFromHex(backgroundHex);
  const fg = rgbaFromHex(foregroundHex);
  const transparent = fromInts(bg.r, bg.g, bg.b, 0);
  const isDark = mode === "dark";
  const grays = generateGrayScale(bg, isDark);
  const textMuted = generateMutedTextColor(bg, isDark);
  const gray = (index: number) => grays[index] ?? bg;
  const colorAt = (index: number) => {
    const value = colors.palette[index];
    return value ? rgbaFromHex(value) : ansiToRgba(index);
  };

  const ansi = {
    red: colorAt(1),
    green: colorAt(2),
    yellow: colorAt(3),
    blue: colorAt(4),
    magenta: colorAt(5),
    cyan: colorAt(6),
    redBright: colorAt(9),
    greenBright: colorAt(10),
  };

  const diffAlpha = isDark ? 0.22 : 0.14;
  return {
    theme: {
      primary: ansi.cyan,
      secondary: ansi.magenta,
      accent: ansi.cyan,
      error: ansi.red,
      warning: ansi.yellow,
      success: ansi.green,
      info: ansi.cyan,
      text: fg,
      textMuted,
      selectedListItemText: bg,
      background: transparent,
      backgroundPanel: gray(2),
      backgroundElement: gray(3),
      backgroundMenu: gray(3),
      borderSubtle: gray(6),
      border: gray(7),
      borderActive: gray(8),
      diffHighlightAdded: ansi.greenBright,
      diffHighlightRemoved: ansi.redBright,
      diffAddedBg: tint(bg, ansi.green, diffAlpha),
      diffRemovedBg: tint(bg, ansi.red, diffAlpha),
      diffAddedLineNumberBg: tint(gray(3), ansi.green, diffAlpha),
      diffRemovedLineNumberBg: tint(gray(3), ansi.red, diffAlpha),
    },
  };
}

export function resolveTerminalThemeMode(
  colors: TerminalColors | null | undefined,
): TuiThemeMode | null {
  if (!hasUsableTerminalColors(colors)) return null;
  return luminanceFromHex(systemBackgroundHex(colors)!) > 0.5 ? "light" : "dark";
}

function createTerminalMatchTheme(colors: TerminalColors, mode: TuiThemeMode): TuiTheme {
  const resolved = resolveSystemTheme(generateSystem(colors, mode), mode);
  const isDark = mode === "dark";
  const toneAlpha = isDark ? 0.18 : 0.12;
  const selectedText = selectedForeground(resolved, resolved.primary);

  return {
    id: TERMINAL_MATCH_THEME_ID,
    mode,
    palette: {
      canvas: rgbaToHex(resolved.background),
      sidebar: rgbaToHex(resolved.backgroundPanel),
      main: rgbaToHex(resolved.background),
      surface: rgbaToHex(resolved.backgroundPanel),
      surfaceAlt: rgbaToHex(resolved.backgroundElement),
      input: rgbaToHex(resolved.backgroundElement),
      surfaceUser: rgbaToHex(resolved.backgroundPanel),
      surfacePlan: rgbaToHex(
        tint(resolved.backgroundPanel, resolved.secondary, isDark ? 0.14 : 0.1),
      ),
      surfaceWarn: rgbaToHex(tint(resolved.backgroundPanel, resolved.warning, isDark ? 0.16 : 0.1)),
      surfaceInfo: rgbaToHex(tint(resolved.backgroundPanel, resolved.info, isDark ? 0.14 : 0.1)),
      footer: rgbaToHex(resolved.background),
      diff: rgbaToHex(resolved.backgroundPanel),
      popup: rgbaToHex(resolved.backgroundMenu),
      scrim: isDark ? "#00000099" : "#00000022",
      border: rgbaToHex(resolved.border),
      divider: rgbaToHex(resolved.borderSubtle),
      control: "transparent",
      controlHover: rgbaToHex(resolved.backgroundElement),
      controlActive: rgbaToHex(resolved.backgroundElement),
      controlActiveStrong: rgbaToHex(resolved.backgroundMenu),
      controlInset: rgbaToHex(resolved.backgroundPanel),
      controlInsetHover: rgbaToHex(resolved.backgroundElement),
      composerPanel: rgbaToHex(resolved.backgroundElement),
      composerBorder: rgbaToHex(resolved.primary),
      composerBorderMuted: rgbaToHex(resolved.borderSubtle),
      composerSend: rgbaToHex(resolved.primary),
      composerSendHover: rgbaToHex(resolved.accent),
      composerStop: rgbaToHex(resolved.error),
      composerStopHover: rgbaToHex(resolved.diffHighlightRemoved),
      accent: rgbaToHex(resolved.accent),
      cursor: rgbaToHex(resolved.text),
      selection: rgbaToHex(resolved.primary),
      selectionActive: rgbaToHex(resolved.accent),
      text: rgbaToHex(resolved.text),
      muted: rgbaToHex(resolved.textMuted),
      subtle: rgbaToHex(resolved.borderActive),
      success: rgbaToHex(resolved.success),
      info: rgbaToHex(resolved.info),
      warning: rgbaToHex(resolved.warning),
      claude: rgbaToHex(resolved.secondary),
    },
    attachmentPillTones: [
      {
        backgroundColor: rgbaToHex(tint(resolved.backgroundElement, resolved.primary, toneAlpha)),
        textColor: rgbaToHex(resolved.primary),
      },
      {
        backgroundColor: rgbaToHex(tint(resolved.backgroundElement, resolved.secondary, toneAlpha)),
        textColor: rgbaToHex(resolved.secondary),
      },
      {
        backgroundColor: rgbaToHex(tint(resolved.backgroundElement, resolved.warning, toneAlpha)),
        textColor: rgbaToHex(resolved.warning),
      },
      {
        backgroundColor: rgbaToHex(tint(resolved.backgroundElement, resolved.error, toneAlpha)),
        textColor: rgbaToHex(resolved.error),
      },
      {
        backgroundColor: rgbaToHex(tint(resolved.backgroundElement, resolved.success, toneAlpha)),
        textColor: rgbaToHex(resolved.success),
      },
      {
        backgroundColor: rgbaToHex(tint(resolved.backgroundElement, resolved.info, toneAlpha)),
        textColor: rgbaToHex(resolved.info),
      },
    ],
    codeBlock: {
      background: rgbaToHex(resolved.backgroundElement),
      language: rgbaToHex(resolved.textMuted),
      copyIcon: rgbaToHex(resolved.textMuted),
    },
    status: {
      awaitingInput: rgbaToHex(resolved.primary),
      working: rgbaToHex(resolved.info),
      planReady: rgbaToHex(resolved.secondary),
      pulse: rgbaToHex(resolved.accent),
    },
    diffViewer: {
      addedBg: rgbaToHex(resolved.diffAddedLineNumberBg),
      removedBg: rgbaToHex(resolved.diffRemovedLineNumberBg),
      addedContentBg: rgbaToHex(resolved.diffAddedBg),
      removedContentBg: rgbaToHex(resolved.diffRemovedBg),
      addedSignColor: rgbaToHex(resolved.diffHighlightAdded),
      removedSignColor: rgbaToHex(resolved.diffHighlightRemoved),
    },
    colors: {
      workEntryErrorAccent: rgbaToHex(resolved.diffHighlightRemoved),
      destructiveIcon: rgbaToHex(resolved.error),
      controlKnob: rgbaToHex(selectedText),
      primaryButtonText: rgbaToHex(selectedText),
      sendDotIdle: rgbaToHex(resolved.textMuted),
      sendDotActive: rgbaToHex(selectedText),
      selectedText: rgbaToHex(selectedText),
    },
  };
}

function terminalColorsSignature(colors: TerminalColors | null | undefined): string {
  if (!colors) return "none";
  return [
    colors.defaultBackground ?? "",
    colors.defaultForeground ?? "",
    ...colors.palette.map((value) => value ?? ""),
  ].join("|");
}

export function resolveTuiThemeMode(
  theme: AppTheme | undefined,
  systemMode: TuiThemeMode | null = null,
): TuiThemeMode {
  if (theme === "light") return "light";
  if (theme === "dark") return "dark";
  return systemMode ?? "dark";
}

const THEME_CACHE = new Map<string, TuiTheme>([
  [`${DEFAULT_TUI_THEME_ID}:dark`, DEFAULT_DARK_THEME],
  [`${DEFAULT_TUI_THEME_ID}:light`, DEFAULT_LIGHT_THEME],
]);

export function resolveTuiTheme(
  theme: AppTheme | undefined,
  themeId: TuiThemeId = DEFAULT_TUI_THEME_ID,
  options: ResolveTuiThemeOptions = {},
): TuiTheme {
  const mode = resolveTuiThemeMode(theme, options.systemMode ?? null);
  const cacheKey =
    themeId === TERMINAL_MATCH_THEME_ID
      ? `${themeId}:${mode}:${terminalColorsSignature(options.terminalColors)}`
      : `${themeId}:${mode}`;
  const cached = THEME_CACHE.get(cacheKey);
  if (cached) {
    return cached;
  }

  if (themeId === TERMINAL_MATCH_THEME_ID) {
    const fallback = defaultThemeForMode(mode);
    if (!hasUsableTerminalColors(options.terminalColors)) {
      THEME_CACHE.set(cacheKey, fallback);
      return fallback;
    }

    const resolved = createTerminalMatchTheme(options.terminalColors, mode);
    THEME_CACHE.set(cacheKey, resolved);
    return resolved;
  }

  return defaultThemeForMode(mode);
}

export function colorToHex(color: TuiColor): string {
  return color;
}
