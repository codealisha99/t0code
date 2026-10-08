import { describe, expect, it } from "vitest";
import { controlColors, syntaxColors } from "./designSystem";
import { resolveTuiTheme } from "./theme";

function luminance(hex: string) {
  const channels = [1, 3, 5].map((start) => {
    const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
}

function contrast(foreground: string, background: string) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe.each(["dark", "light"] as const)("%s design system", (mode) => {
  const theme = resolveTuiTheme(mode);
  const p = theme.palette;

  it("keeps reading text and code legible on their surfaces", () => {
    for (const background of [p.main, p.sidebar, p.surface, p.popup, p.composerPanel]) {
      for (const foreground of [p.text, p.muted, p.subtle]) {
        expect(
          contrast(foreground, background),
          `${foreground} on ${background}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
    for (const foreground of Object.values(syntaxColors(p))) {
      expect(contrast(foreground, theme.codeBlock.background)).toBeGreaterThanOrEqual(4.5);
    }
    for (const tone of theme.attachmentPillTones) {
      expect(contrast(tone.textColor, tone.backgroundColor)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps primary actions readable at rest and on hover", () => {
    for (const hovered of [false, true]) {
      const colors = controlColors(theme, { primary: true, hovered });
      expect(contrast(colors.foreground, colors.background)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("does not highlight disabled controls when hovered or selected", () => {
    expect(
      controlColors(theme, { disabled: true, active: true, hovered: true, primary: true }),
    ).toEqual(controlColors(theme, { disabled: true }));
  });
});
