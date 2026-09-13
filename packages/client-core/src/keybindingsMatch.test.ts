import { describe, expect, it } from "vitest";
import {
  evaluateWhenNode,
  formatShortcutLabel,
  matchesShortcut,
  matchesWhenClause,
  resolveShortcutCommand,
} from "./keybindingsMatch";
import type {
  KeybindingShortcut,
  KeybindingWhenNode,
  ResolvedKeybindingsConfig,
} from "@t3tools/contracts";

describe("matchesShortcut", () => {
  it("matches mod on mac as meta", () => {
    const shortcut: KeybindingShortcut = {
      key: "k",
      metaKey: false,
      ctrlKey: false,
      modKey: true,
      shiftKey: false,
      altKey: false,
    };
    expect(
      matchesShortcut(
        { key: "k", metaKey: true, ctrlKey: false, shiftKey: false, altKey: false },
        shortcut,
        "darwin",
      ),
    ).toBe(true);
    expect(
      matchesShortcut(
        { key: "k", metaKey: false, ctrlKey: true, shiftKey: false, altKey: false },
        shortcut,
        "linux",
      ),
    ).toBe(true);
  });

  it("normalizes esc to escape", () => {
    const shortcut: KeybindingShortcut = {
      key: "escape",
      metaKey: false,
      ctrlKey: false,
      modKey: false,
      shiftKey: false,
      altKey: false,
    };
    expect(
      matchesShortcut(
        { key: "Esc", metaKey: false, ctrlKey: false, shiftKey: false, altKey: false },
        shortcut,
        "darwin",
      ),
    ).toBe(true);
  });
});

describe("evaluateWhenNode", () => {
  it("identifier true/false", () => {
    expect(
      evaluateWhenNode(
        { type: "identifier", name: "true" },
        { terminalFocus: false, terminalOpen: false },
      ),
    ).toBe(true);
    expect(
      evaluateWhenNode(
        { type: "identifier", name: "false" },
        { terminalFocus: false, terminalOpen: false },
      ),
    ).toBe(false);
  });

  it("and/or/not", () => {
    const ctx = { terminalFocus: true, terminalOpen: false, foo: true } as Record<
      string,
      boolean
    > & { terminalFocus: boolean; terminalOpen: boolean };
    const notNode: KeybindingWhenNode = {
      type: "not",
      node: { type: "identifier", name: "terminalOpen" },
    };
    expect(evaluateWhenNode(notNode, ctx)).toBe(true);
    const andNode: KeybindingWhenNode = {
      type: "and",
      left: { type: "identifier", name: "terminalFocus" },
      right: { type: "identifier", name: "foo" },
    };
    expect(evaluateWhenNode(andNode, ctx)).toBe(true);
    const orNode: KeybindingWhenNode = {
      type: "or",
      left: { type: "identifier", name: "terminalOpen" },
      right: { type: "identifier", name: "foo" },
    };
    expect(evaluateWhenNode(orNode, ctx)).toBe(true);
  });
});

describe("matchesWhenClause", () => {
  it("undefined always true", () => {
    expect(matchesWhenClause(undefined, { terminalFocus: false, terminalOpen: false })).toBe(true);
  });
});

describe("resolveShortcutCommand", () => {
  it("last wins", () => {
    const bindings: ResolvedKeybindingsConfig = [
      {
        key: "ctrl+k",
        command: "terminal.clear" as never,
        shortcut: {
          key: "k",
          ctrlKey: true,
          metaKey: false,
          modKey: false,
          shiftKey: false,
          altKey: false,
        },
        whenAst: undefined,
      },
      {
        key: "ctrl+k",
        command: "terminal.toggle" as never,
        shortcut: {
          key: "k",
          ctrlKey: true,
          metaKey: false,
          modKey: false,
          shiftKey: false,
          altKey: false,
        },
        whenAst: undefined,
      },
    ] as never;
    expect(
      resolveShortcutCommand(
        { key: "k", ctrlKey: true, metaKey: false, shiftKey: false, altKey: false },
        bindings,
        { platform: "linux" },
      ),
    ).toBe("terminal.toggle");
  });
});

describe("formatShortcutLabel", () => {
  it("formats mac meta", () => {
    expect(
      formatShortcutLabel(
        { key: "k", ctrlKey: false, metaKey: true, modKey: false, shiftKey: false, altKey: false },
        "darwin",
      ),
    ).toBe("⌘K");
  });

  it("formats linux ctrl", () => {
    expect(
      formatShortcutLabel(
        { key: "k", ctrlKey: true, metaKey: false, modKey: false, shiftKey: false, altKey: false },
        "linux",
      ),
    ).toBe("Ctrl+K");
  });
});
