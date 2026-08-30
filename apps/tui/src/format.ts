import type { ServerConfig } from "@t3tools/contracts";
import { DEFAULT_TIMESTAMP_FORMAT, type TimestampFormat } from "@t3tools/client-core";

const timestampFormatterCache = new Map<TimestampFormat, Intl.DateTimeFormat>();

export function nowIso(): string {
  return new Date().toISOString();
}

export function formatRelativeTime(iso: string | null | undefined, nowMs = Date.now()): string {
  if (!iso) return "";
  const diffMs = nowMs - Date.parse(iso);
  if (!Number.isFinite(diffMs)) return "";
  const minutes = Math.max(Math.floor(diffMs / 60_000), 0);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function formatRelativeTimeLabel(
  iso: string | null | undefined,
  nowMs = Date.now(),
): string {
  const relativeTime = formatRelativeTime(iso, nowMs);
  return relativeTime === "now" ? "now" : `${relativeTime} ago`;
}

export function formatCheckedRelativeTime(
  iso: string | null | undefined,
  nowMs = Date.now(),
): string {
  const relativeTime = formatRelativeTime(iso, nowMs);
  return relativeTime === "now" ? "Checked now" : `Checked ${relativeTime} ago`;
}

export function formatMemoryBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KiB", "MiB", "GiB"] as const;
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const precision = value >= 10 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

export function formatCpuPercent(value: number): string {
  if (!Number.isFinite(value)) return "0%";
  const precision = value >= 10 ? 0 : 1;
  return `${value.toFixed(precision)}%`;
}

export function formatDurationMs(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "0ms";
  if (value < 1_000) return `${Math.round(value)}ms`;
  const seconds = value / 1_000;
  if (seconds < 60) return `${seconds.toFixed(seconds >= 10 ? 0 : 1)}s`;
  const minutes = seconds / 60;
  return `${minutes.toFixed(minutes >= 10 ? 0 : 1)}m`;
}

export function collapseOtelSignalsUrl(input: {
  tracesUrl: string;
  metricsUrl: string;
}): string | null {
  const tracesSuffix = "/traces";
  const metricsSuffix = "/metrics";
  if (!input.tracesUrl.endsWith(tracesSuffix) || !input.metricsUrl.endsWith(metricsSuffix)) {
    return null;
  }

  const tracesBase = input.tracesUrl.slice(0, -tracesSuffix.length);
  const metricsBase = input.metricsUrl.slice(0, -metricsSuffix.length);
  return tracesBase === metricsBase ? `${tracesBase}/{traces,metrics}` : null;
}

export function formatDiagnosticsDescription(input: {
  localTracingEnabled: boolean;
  otlpTracesEnabled: boolean;
  otlpTracesUrl?: string | undefined;
  otlpMetricsEnabled: boolean;
  otlpMetricsUrl?: string | undefined;
}): string {
  const mode = input.localTracingEnabled ? "Local trace file" : "Terminal logs only";
  const tracesUrl = input.otlpTracesEnabled ? input.otlpTracesUrl : undefined;
  const metricsUrl = input.otlpMetricsEnabled ? input.otlpMetricsUrl : undefined;

  if (tracesUrl && metricsUrl) {
    const collapsedUrl = collapseOtelSignalsUrl({ tracesUrl, metricsUrl });
    return collapsedUrl
      ? `${mode}. Exporting OTEL to ${collapsedUrl}.`
      : `${mode}. Exporting OTEL traces to ${tracesUrl} and metrics to ${metricsUrl}.`;
  }

  if (tracesUrl) return `${mode}. Exporting OTEL traces to ${tracesUrl}.`;
  if (metricsUrl) return `${mode}. Exporting OTEL metrics to ${metricsUrl}.`;
  return `${mode}.`;
}

export function formatEnvironmentPlatform(environment: ServerConfig["environment"]): string {
  return `${environment.platform.os}/${environment.platform.arch}`;
}

export function formatEnvironmentCapabilities(environment: ServerConfig["environment"]): string {
  return environment.capabilities.repositoryIdentity
    ? "Repository identity supported"
    : "Repository identity unavailable";
}

export function getTimestampFormatter(timestampFormat: TimestampFormat): Intl.DateTimeFormat {
  const cached = timestampFormatterCache.get(timestampFormat);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    ...(timestampFormat === "locale" ? {} : { hour12: timestampFormat === "12-hour" }),
  });
  timestampFormatterCache.set(timestampFormat, formatter);
  return formatter;
}

export function formatMessageTimestamp(
  iso: string | null | undefined,
  timestampFormat: TimestampFormat = DEFAULT_TIMESTAMP_FORMAT,
): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return getTimestampFormatter(timestampFormat).format(date);
}

export function resolveHttpOriginFromWsUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    const protocol = parsed.protocol === "wss:" ? "https:" : "http:";
    return `${protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}
