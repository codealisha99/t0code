import { describe, expect, it } from "vitest";

import { authStatusLabel, sourceControlProviderSummary, vcsSummary } from "./sourceControlUi";

describe("authStatusLabel", () => {
  it("labels known auth states", () => {
    expect(
      authStatusLabel({ status: "authenticated", account: null, host: null, detail: null }),
    ).toBe("Authenticated");
    expect(
      authStatusLabel({ status: "unauthenticated", account: null, host: null, detail: null }),
    ).toBe("Sign-in needed");
  });
});

describe("vcsSummary", () => {
  it("marks unimplemented tools as coming soon", () => {
    expect(
      vcsSummary({
        kind: "jj",
        label: "Jujutsu",
        implemented: false,
        status: "available",
        version: null,
        detail: null,
        installHint: "brew install jj",
      }),
    ).toBe("Support for Jujutsu is coming soon.");
  });
});

describe("sourceControlProviderSummary", () => {
  it("shows the authenticated account", () => {
    expect(
      sourceControlProviderSummary({
        kind: "github",
        label: "GitHub",
        status: "available",
        version: null,
        detail: null,
        installHint: "Install gh",
        auth: { status: "authenticated", account: "octocat", host: "github.com", detail: null },
      }),
    ).toBe("octocat on github.com");
  });
});
