import { describe, expect, it } from "vitest";
import { Schema } from "effect";

import {
  DEFAULT_SERVER_SETTINGS,
  ProviderDriverKind,
  ProviderInstanceId,
} from "@t3tools/contracts";

import {
  formatProviderInstanceSummary,
  normalizeFetchIntervalSeconds,
  readProviderInstallEnabled,
} from "./providerInstallUi";

describe("normalizeFetchIntervalSeconds", () => {
  it("rounds finite values and rejects NaN", () => {
    expect(normalizeFetchIntervalSeconds(30.4)).toBe(30);
    expect(normalizeFetchIntervalSeconds(Number.NaN)).toBe(0);
  });
});

describe("readProviderInstallEnabled", () => {
  it("falls back to default provider settings", () => {
    expect(readProviderInstallEnabled(DEFAULT_SERVER_SETTINGS, "codex")).toBe(
      DEFAULT_SERVER_SETTINGS.providers.codex.enabled,
    );
  });
});

const decodeProviderDriverKind = Schema.decodeUnknownSync(ProviderDriverKind);

describe("formatProviderInstanceSummary", () => {
  it("includes the enabled state", () => {
    expect(
      formatProviderInstanceSummary(ProviderInstanceId.make("codex"), {
        driver: decodeProviderDriverKind("codex"),
        enabled: false,
        displayName: "Work",
        config: {},
      }),
    ).toBe("Work · codex · disabled");
  });
});
