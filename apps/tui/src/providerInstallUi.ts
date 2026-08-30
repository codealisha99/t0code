import { type AppSettings } from "@t3tools/client-core";
import {
  DEFAULT_SERVER_SETTINGS,
  type ProviderInstanceConfig,
  type ProviderInstanceEnvironmentVariable,
  type ProviderInstanceId,
  type ServerSettings,
} from "@t3tools/contracts";

import {
  defaultProviderInstanceIdForSettingsKey,
  type InstallProviderFieldKey,
  type InstallProviderSettings,
  type ProviderSettingsKey,
} from "./providerSettings";
import type { ProviderInstanceModelOption } from "./providerInstances";

export type InstallProviderKey = ProviderSettingsKey;
export type ModelMenuOption = ProviderInstanceModelOption;

export function normalizeFetchIntervalSeconds(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

export function readProviderInstallSettingValue(
  settings: ServerSettings,
  provider: InstallProviderKey,
  field: InstallProviderFieldKey,
): string {
  const instanceConfig =
    settings.providerInstances[defaultProviderInstanceIdForSettingsKey(provider)]?.config;
  if (
    instanceConfig &&
    typeof instanceConfig === "object" &&
    !globalThis.Array.isArray(instanceConfig) &&
    field in instanceConfig
  ) {
    return String((instanceConfig as Record<string, unknown>)[field] ?? "");
  }
  const providerSettings = settings.providers[provider];
  return field in providerSettings
    ? String(providerSettings[field as keyof typeof providerSettings] ?? "")
    : "";
}

export function readDefaultProviderInstanceMetadataValue(
  settings: ServerSettings,
  provider: InstallProviderKey,
  field: "accentColor" | "displayName",
): string {
  return (
    settings.providerInstances[defaultProviderInstanceIdForSettingsKey(provider)]?.[
      field
    ]?.trim() ?? ""
  );
}

export function readDefaultProviderInstanceEnvironment(
  settings: ServerSettings,
  provider: InstallProviderKey,
): readonly ProviderInstanceEnvironmentVariable[] {
  return (
    settings.providerInstances[defaultProviderInstanceIdForSettingsKey(provider)]?.environment ?? []
  );
}

export function readAdditionalProviderInstances(
  settings: ServerSettings | null,
  provider: InstallProviderKey,
): readonly [ProviderInstanceId, ProviderInstanceConfig][] {
  if (!settings) return [];
  const defaultInstanceId = defaultProviderInstanceIdForSettingsKey(provider);
  return Object.entries(settings.providerInstances)
    .filter(
      (entry): entry is [ProviderInstanceId, ProviderInstanceConfig] =>
        entry[0] !== defaultInstanceId && entry[1].driver === provider,
    )
    .toSorted(([leftId], [rightId]) => String(leftId).localeCompare(String(rightId)));
}

export function formatProviderInstanceSummary(
  instanceId: ProviderInstanceId,
  instance: ProviderInstanceConfig,
): string {
  const label = instance.displayName?.trim() || String(instanceId);
  const state = instance.enabled === false ? "disabled" : "enabled";
  return `${label} · ${String(instanceId)} · ${state}`;
}

export function readProviderInstanceConfigValue(
  instance: ProviderInstanceConfig,
  field: InstallProviderFieldKey,
): string {
  const config = instance.config;
  if (!config || typeof config !== "object" || globalThis.Array.isArray(config)) {
    return "";
  }
  return String((config as Record<string, unknown>)[field] ?? "");
}

export function readProviderInstanceConfigStringArray(
  settings: ServerSettings | null,
  provider: InstallProviderKey,
  key: string,
): readonly string[] | undefined {
  const config =
    settings?.providerInstances[defaultProviderInstanceIdForSettingsKey(provider)]?.config;
  if (!config || typeof config !== "object" || globalThis.Array.isArray(config)) {
    return undefined;
  }
  const value = (config as Record<string, unknown>)[key];
  return globalThis.Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : undefined;
}

export function sortProviderModelPreferenceOptions(
  options: ReadonlyArray<ModelMenuOption>,
  appSettings: AppSettings,
  instanceId: ProviderInstanceId,
): ReadonlyArray<ModelMenuOption> {
  const preferences = appSettings.providerModelPreferences[instanceId];
  const modelOrder = new Map((preferences?.modelOrder ?? []).map((slug, index) => [slug, index]));
  const favoriteModels = new Set(
    appSettings.favorites
      .filter((favorite) => favorite.provider === instanceId)
      .map((favorite) => favorite.model),
  );
  return options
    .map((option, index) => ({ option, index }))
    .toSorted((left, right) => {
      const favoriteDelta =
        Number(favoriteModels.has(right.option.slug)) -
        Number(favoriteModels.has(left.option.slug));
      if (favoriteDelta !== 0) return favoriteDelta;
      const leftRank = modelOrder.get(left.option.slug) ?? Number.POSITIVE_INFINITY;
      const rightRank = modelOrder.get(right.option.slug) ?? Number.POSITIVE_INFINITY;
      if (leftRank !== rightRank) return leftRank - rightRank;
      return left.index - right.index;
    })
    .map(({ option }) => option);
}

export function applyProviderModelPreferences(
  options: ReadonlyArray<ModelMenuOption>,
  appSettings: AppSettings,
  instanceId: ProviderInstanceId,
): ReadonlyArray<ModelMenuOption> {
  const preferences = appSettings.providerModelPreferences[instanceId];
  const hiddenModels = new Set(preferences?.hiddenModels ?? []);
  return sortProviderModelPreferenceOptions(options, appSettings, instanceId).filter(
    (option) => option.isCustom || !hiddenModels.has(option.slug),
  );
}

export function readProviderInstallEnabled(
  settings: ServerSettings,
  provider: InstallProviderKey,
): boolean {
  const instance = settings.providerInstances[defaultProviderInstanceIdForSettingsKey(provider)];
  if (typeof instance?.enabled === "boolean") {
    return instance.enabled;
  }
  if (
    instance?.config &&
    typeof instance.config === "object" &&
    !globalThis.Array.isArray(instance.config)
  ) {
    const enabled = (instance.config as Record<string, unknown>).enabled;
    if (typeof enabled === "boolean") {
      return enabled;
    }
  }
  return settings.providers[provider].enabled;
}

export function isProviderInstallSettingsDirtyForSettings(
  settings: ServerSettings,
  providerSettings: InstallProviderSettings,
): boolean {
  if (
    settings.providerInstances[
      defaultProviderInstanceIdForSettingsKey(providerSettings.provider)
    ] !== undefined
  ) {
    return true;
  }
  if (
    readProviderInstallEnabled(settings, providerSettings.provider) !==
    DEFAULT_SERVER_SETTINGS.providers[providerSettings.provider].enabled
  ) {
    return true;
  }
  return providerSettings.fields.some(
    (field) =>
      readProviderInstallSettingValue(settings, providerSettings.provider, field.key) !==
      String(
        DEFAULT_SERVER_SETTINGS.providers[providerSettings.provider][
          field.key as keyof (typeof DEFAULT_SERVER_SETTINGS.providers)[typeof providerSettings.provider]
        ] ?? "",
      ),
  );
}
