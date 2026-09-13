import type { ServerConfig } from "@t3tools/contracts";
import type { TimestampFormat } from "@t3tools/client-core";
import {
  collapseOtelSignalsUrl as coreCollapseOtelSignalsUrl,
  formatCheckedRelativeTime as coreFormatCheckedRelativeTime,
  formatCpuPercent as coreFormatCpuPercent,
  formatDurationMs as coreFormatDurationMs,
  formatMemoryBytes as coreFormatMemoryBytes,
  formatRelativeTime as coreFormatRelativeTime,
  formatRelativeTimeLabel as coreFormatRelativeTimeLabel,
  getTimestampFormatter as coreGetTimestampFormatter,
  nowIso as coreNowIso,
} from "@t3tools/client-core/formatTime";

export const nowIso = coreNowIso;
export const formatRelativeTime = coreFormatRelativeTime;
export const formatRelativeTimeLabel = coreFormatRelativeTimeLabel;
export const formatCheckedRelativeTime = coreFormatCheckedRelativeTime;
export const formatMemoryBytes = coreFormatMemoryBytes;
export const formatCpuPercent = coreFormatCpuPercent;
export const formatDurationMs = coreFormatDurationMs;
export const collapseOtelSignalsUrl = coreCollapseOtelSignalsUrl;

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
  return coreGetTimestampFormatter(timestampFormat, false);
}

export { formatMessageTimestamp } from "@t3tools/client-core/formatTime";
export { resolveHttpOriginFromWsUrl } from "@t3tools/client-core/formatTime";
