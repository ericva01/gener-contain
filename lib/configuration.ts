import { defaultConfig } from "@/config/defaults";
import { generatorConfigSchema } from "@/config/schema";
import type { GeneratorConfig } from "@/types/generator";

export const STORAGE_KEY = "configcraft:configuration";

export function migrateConfiguration(input: unknown): unknown {
  if (!input || typeof input !== "object") throw new Error("Configuration must be a JSON object.");
  const value = input as Record<string, unknown>;
  if (value.schemaVersion !== 1) throw new Error(`Unsupported configuration version: ${String(value.schemaVersion)}.`);
  return { ...defaultConfig, ...value };
}
export function importConfiguration(json: string): GeneratorConfig {
  let parsed: unknown;
  try { parsed = JSON.parse(json); } catch { throw new Error("The selected file is not valid JSON."); }
  const result = generatorConfigSchema.safeParse(migrateConfiguration(parsed));
  if (!result.success) throw new Error(`Invalid configuration: ${result.error.issues[0]?.message ?? "unknown error"}`);
  return result.data;
}
export function exportConfiguration(config: GeneratorConfig) { return `${JSON.stringify(config, null, 2)}\n`; }
export function loadConfiguration(): GeneratorConfig | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try { return importConfiguration(saved); } catch { localStorage.removeItem(STORAGE_KEY); return null; }
}
export function saveConfiguration(config: GeneratorConfig) { localStorage.setItem(STORAGE_KEY, exportConfiguration(config)); }

export function encodeSharedConfiguration(config: GeneratorConfig): string {
  const bytes = new TextEncoder().encode(JSON.stringify(config));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function decodeSharedConfiguration(value: string): GeneratorConfig {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return importConfiguration(new TextDecoder().decode(bytes));
  } catch { throw new Error("This share link contains an invalid configuration."); }
}

export function sanitizeProjectName(value: string): string {
  const safe = value.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 63).replace(/-$/g, "");
  return safe || "configcraft-project";
}
export function isSafeArchivePath(path: string) {
  return path.length > 0 && !path.startsWith("/") && !path.startsWith("\\") && !path.includes("..") && !/^[a-zA-Z]:/.test(path) && !path.split(/[\\/]/).includes("");
}
