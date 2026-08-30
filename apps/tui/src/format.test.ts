import { describe, expect, it } from "vitest";

import {
  collapseOtelSignalsUrl,
  formatCpuPercent,
  formatDiagnosticsDescription,
  formatDurationMs,
  formatMemoryBytes,
  formatRelativeTime,
  formatRelativeTimeLabel,
  resolveHttpOriginFromWsUrl,
} from "./format";

describe("formatRelativeTime", () => {
  const now = Date.parse("2026-08-29T12:00:00.000Z");

  it("returns now for timestamps under a minute", () => {
    expect(formatRelativeTime("2026-08-29T11:59:30.000Z", now)).toBe("now");
  });

  it("formats hours and days", () => {
    expect(formatRelativeTime("2026-08-29T09:00:00.000Z", now)).toBe("3h");
    expect(formatRelativeTime("2026-08-27T12:00:00.000Z", now)).toBe("2d");
  });

  it("builds ago labels", () => {
    expect(formatRelativeTimeLabel("2026-08-29T11:00:00.000Z", now)).toBe("1h ago");
  });
});

describe("formatMemoryBytes", () => {
  it("formats bytes and kibibytes", () => {
    expect(formatMemoryBytes(0)).toBe("0 B");
    expect(formatMemoryBytes(512)).toBe("512 B");
    expect(formatMemoryBytes(2048)).toBe("2.0 KiB");
  });
});

describe("formatCpuPercent", () => {
  it("uses whole percents at 10+", () => {
    expect(formatCpuPercent(3.25)).toBe("3.3%");
    expect(formatCpuPercent(12.4)).toBe("12%");
  });
});

describe("formatDurationMs", () => {
  it("formats milliseconds and seconds", () => {
    expect(formatDurationMs(250)).toBe("250ms");
    expect(formatDurationMs(1500)).toBe("1.5s");
  });
});

describe("collapseOtelSignalsUrl", () => {
  it("collapses matching traces and metrics bases", () => {
    expect(
      collapseOtelSignalsUrl({
        tracesUrl: "http://localhost:4318/v1/traces",
        metricsUrl: "http://localhost:4318/v1/metrics",
      }),
    ).toBe("http://localhost:4318/v1/{traces,metrics}");
  });

  it("returns null when bases differ", () => {
    expect(
      collapseOtelSignalsUrl({
        tracesUrl: "http://localhost:4318/v1/traces",
        metricsUrl: "http://localhost:4319/v1/metrics",
      }),
    ).toBeNull();
  });
});

describe("formatDiagnosticsDescription", () => {
  it("describes local tracing without exporters", () => {
    expect(
      formatDiagnosticsDescription({
        localTracingEnabled: true,
        otlpTracesEnabled: false,
        otlpMetricsEnabled: false,
      }),
    ).toBe("Local trace file.");
  });
});

describe("resolveHttpOriginFromWsUrl", () => {
  it("converts websocket origins", () => {
    expect(resolveHttpOriginFromWsUrl("ws://127.0.0.1:4000/ws")).toBe("http://127.0.0.1:4000");
    expect(resolveHttpOriginFromWsUrl("wss://example.test/ws")).toBe("https://example.test");
  });
});
