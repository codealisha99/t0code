import { describe, expect, it } from "vitest";

import { TUI_SIDEBAR_WIDTH, resolveTuiResponsiveLayout } from "./responsiveLayout";

describe("resolveTuiResponsiveLayout", () => {
  it("keeps the send action clear at 80 columns with the sidebar open", () => {
    const layout = resolveTuiResponsiveLayout({
      viewportColumns: 80,
      sidebarCollapsedPreference: false,
    });
    expect(layout.showSidebar).toBe(true);
    expect(layout.showComposerModeLabels).toBe(false);
    expect(layout.showComposerModelLabel).toBe(false);
    expect(layout.showComposerTraitsLabel).toBe(false);
    expect(layout.showComposerDividers).toBe(false);
  });

  it("keeps the full layout in wide terminals", () => {
    expect(
      resolveTuiResponsiveLayout({
        viewportColumns: 160,
        sidebarCollapsedPreference: false,
      }),
    ).toEqual(
      expect.objectContaining({
        showSidebarToggle: false,
        sidebarForcedCollapsed: false,
        sidebarCollapsed: false,
        sidebarWidth: TUI_SIDEBAR_WIDTH,
        showSidebar: true,
        showSidebarAlphaBadge: true,
        sidebarTitle: "T1 Code",
        showHeaderProjectBadge: true,
        showComposerModeLabels: true,
        showComposerModelLabel: true,
        showComposerTraitsLabel: true,
        showComposerDividers: true,
      }),
    );
  });

  it("allows manual sidebar collapse before forcing it", () => {
    expect(
      resolveTuiResponsiveLayout({
        viewportColumns: 106,
        sidebarCollapsedPreference: true,
      }),
    ).toEqual(
      expect.objectContaining({
        showSidebarToggle: true,
        sidebarForcedCollapsed: false,
        sidebarCollapsed: true,
        sidebarWidth: 0,
        showSidebar: false,
        showSidebarAlphaBadge: false,
        sidebarTitle: "T1",
        showHeaderProjectBadge: false,
        showComposerModeLabels: true,
        showComposerModelLabel: true,
        showComposerTraitsLabel: true,
        showComposerDividers: true,
      }),
    );
  });

  it("forces the sidebar closed in very narrow terminals", () => {
    expect(
      resolveTuiResponsiveLayout({
        viewportColumns: 78,
        sidebarCollapsedPreference: false,
      }),
    ).toEqual(
      expect.objectContaining({
        showSidebarToggle: true,
        sidebarForcedCollapsed: true,
        sidebarCollapsed: true,
        sidebarWidth: 0,
        showSidebar: false,
        showComposerModeLabels: true,
        showComposerModelLabel: true,
        showComposerTraitsLabel: true,
      }),
    );
  });

  it("keeps the sidebar open at widths that still have room for the full layout", () => {
    expect(
      resolveTuiResponsiveLayout({
        viewportColumns: 86,
        sidebarCollapsedPreference: false,
      }),
    ).toEqual(
      expect.objectContaining({
        showSidebarToggle: true,
        sidebarForcedCollapsed: false,
        sidebarCollapsed: false,
        showSidebar: true,
        sidebarTitle: "T1 Code",
      }),
    );
  });

  it("keeps the traits label visible while the sidebar is still open", () => {
    expect(
      resolveTuiResponsiveLayout({
        viewportColumns: 110,
        sidebarCollapsedPreference: false,
      }),
    ).toEqual(
      expect.objectContaining({
        showSidebar: true,
        sidebarTitle: "T1 Code",
        showComposerModeLabels: true,
        showComposerModelLabel: true,
        showComposerTraitsLabel: true,
        showComposerDividers: true,
      }),
    );
  });

  it("collapses the traits label before the other footer labels in tighter widths", () => {
    expect(
      resolveTuiResponsiveLayout({
        viewportColumns: 104,
        sidebarCollapsedPreference: false,
      }),
    ).toEqual(
      expect.objectContaining({
        showSidebar: true,
        showComposerModeLabels: true,
        showComposerModelLabel: true,
        showComposerTraitsLabel: false,
        showComposerDividers: true,
      }),
    );
  });

  it("keeps the sidebar open until the main pane is actually constrained", () => {
    expect(
      resolveTuiResponsiveLayout({
        viewportColumns: 104,
        sidebarCollapsedPreference: false,
      }),
    ).toEqual(
      expect.objectContaining({
        showSidebarToggle: false,
        sidebarForcedCollapsed: false,
        sidebarCollapsed: false,
        showSidebar: true,
        sidebarTitle: "T1 Code",
      }),
    );
  });
});
