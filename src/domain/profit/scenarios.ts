import { calculateProfit, DEFAULT_PROFIT_INPUT, PROFIT_MODEL_VERSION } from "./calculate";
import type { ProfitInput, ProfitInputKey } from "./types";
import type { ReadinessCheckId } from "./readiness";
import { getCategories, PLATFORMS, resolvePreset, type PlatformId, type CategoryId } from "@/src/data/presets";
import { getProfessionalTemplate } from "@/src/data/professional-templates";

export const SCENARIO_STORAGE_KEY = "liheng.saved-plans.v1";
export const MAX_SAVED_SCENARIOS = 12;
export const ZERO_COST_IDS: readonly ReadinessCheckId[] = [
  "product", "fulfillment", "order-costs", "acquisition", "after-sales", "tax",
];

export interface ScenarioDraft {
  platformId: PlatformId;
  categoryId: CategoryId;
  input: ProfitInput;
  feesConfirmed: boolean;
  acknowledgedZeroCosts: ReadinessCheckId[];
  manualOverrides: ProfitInputKey[];
  isExample: boolean;
}

export interface SavedScenario extends ScenarioDraft {
  id: string;
  name: string;
  savedAt: string;
  modelVersion: string;
  presetVersion: string;
  templateVersion: string;
  sourceUrl: string | null;
  summary: {
    profit: number;
    profitMargin: number;
    maximumAdvertisingCost: number | null;
    monthlyProfit: number;
  };
}

export function createScenario(draft: ScenarioDraft, name: string): SavedScenario {
  const result = calculateProfit(draft.input);
  if (result.validationMessage?.includes("须在")) throw new Error("请先修正提示中的输入，再保存方案。");
  const preset = resolvePreset(draft.platformId, draft.categoryId).preset;
  const template = getProfessionalTemplate(draft.platformId);
  return {
    ...draft,
    input: { ...draft.input },
    id: crypto.randomUUID(),
    name: name.trim().slice(0, 40) || "未命名方案",
    savedAt: new Date().toISOString(),
    modelVersion: PROFIT_MODEL_VERSION,
    presetVersion: preset.version,
    templateVersion: template.version,
    sourceUrl: draft.input.calculationMode === "professional" ? template.sourceUrl : preset.sourceUrl,
    summary: {
      profit: result.profit,
      profitMargin: result.profitMargin,
      maximumAdvertisingCost: result.maximumAdvertisingCost,
      monthlyProfit: result.monthlyProfit,
    },
  };
}

export function isScenarioCurrent(plan: SavedScenario): boolean {
  return plan.modelVersion === PROFIT_MODEL_VERSION
    && plan.presetVersion === resolvePreset(plan.platformId, plan.categoryId).preset.version
    && plan.templateVersion === getProfessionalTemplate(plan.platformId).version;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isAmount = (value: unknown) => typeof value === "number" && Number.isFinite(value);
const isText = (value: unknown) => typeof value === "string" && value.length > 0 && value.length <= 100;

function isPlan(value: unknown): value is SavedScenario {
  if (!isRecord(value) || !isRecord(value.input) || !isRecord(value.summary)) return false;
  const input = value.input;
  const summary = value.summary;
  const platform = PLATFORMS.find((entry) => entry.id === value.platformId);
  if (!platform || !getCategories(platform.id).some((entry) => entry.id === value.categoryId)) return false;
  if (![value.id, value.name, value.modelVersion, value.presetVersion, value.templateVersion].every(isText)) return false;
  if (typeof value.savedAt !== "string" || !Number.isFinite(Date.parse(value.savedAt))) return false;
  if (value.sourceUrl !== null && (typeof value.sourceUrl !== "string" || !value.sourceUrl.startsWith("https://"))) return false;
  if (typeof value.feesConfirmed !== "boolean" || typeof value.isExample !== "boolean") return false;
  if (!Array.isArray(value.acknowledgedZeroCosts) || !value.acknowledgedZeroCosts.every((id) => ZERO_COST_IDS.includes(id))) return false;
  if (!Array.isArray(value.manualOverrides) || !value.manualOverrides.every((key) => typeof DEFAULT_PROFIT_INPUT[key as ProfitInputKey] === "number")) return false;
  for (const [key, defaultValue] of Object.entries(DEFAULT_PROFIT_INPUT)) {
    if (typeof defaultValue === "number" && (!isAmount(input[key]) || (input[key] as number) < 0)) return false;
  }
  if (!["quick", "professional"].includes(String(input.calculationMode))) return false;
  if (!["organic", "advertising", "creator"].includes(String(input.salesChannel))) return false;
  if (!["platformFeeBase", "paymentFeeBase", "creatorCommissionBase", "taxFeeBase"].every((key) =>
    ["item-amount", "buyer-paid", "seller-settlement"].includes(String(input[key])))) return false;
  if (calculateProfit(input as unknown as ProfitInput).validationMessage?.includes("须在")) return false;
  return ["profit", "profitMargin", "monthlyProfit"].every((key) => isAmount(summary[key]))
    && (summary.maximumAdvertisingCost === null || isAmount(summary.maximumAdvertisingCost));
}

export interface ScenarioStoreSnapshot {
  plans: SavedScenario[];
  error: string | null;
}

export function parseScenarios(raw: string | null): ScenarioStoreSnapshot {
  if (raw === null) return { plans: [], error: null };
  try {
    if (raw.length > 500_000) throw new Error("oversized");
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data) || data.schemaVersion !== 1 || !Array.isArray(data.plans)
      || data.plans.length > MAX_SAVED_SCENARIOS || !data.plans.every(isPlan)
      || new Set(data.plans.map((plan) => plan.id)).size !== data.plans.length) throw new Error("invalid");
    return { plans: data.plans, error: null };
  } catch {
    return { plans: [], error: "本地方案无法读取，原记录尚未覆盖。可清空本地方案后重新保存。" };
  }
}

const EMPTY: ScenarioStoreSnapshot = { plans: [], error: null };
const DENIED: ScenarioStoreSnapshot = { plans: [], error: "浏览器未允许本地存储，请检查隐私设置。仍可继续计算。" };
let cachedRaw: string | null | undefined;
let cachedSnapshot = EMPTY;
export const getServerScenarioSnapshot = () => EMPTY;

export function getScenarioSnapshot(): ScenarioStoreSnapshot {
  try {
    const raw = window.localStorage.getItem(SCENARIO_STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSnapshot = parseScenarios(raw);
    }
    return cachedSnapshot;
  } catch {
    return DENIED;
  }
}

export function subscribeScenarios(callback: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SCENARIO_STORAGE_KEY || event.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(SCENARIO_STORAGE_KEY, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SCENARIO_STORAGE_KEY, callback);
  };
}

export function writeScenarios(plans: SavedScenario[]): string | null {
  const raw = JSON.stringify({ schemaVersion: 1, plans });
  if (parseScenarios(raw).error) return "方案数据无效，未保存。请检查输入。";
  try {
    window.localStorage.setItem(SCENARIO_STORAGE_KEY, raw);
    window.dispatchEvent(new Event(SCENARIO_STORAGE_KEY));
    return null;
  } catch {
    return "保存失败：本地存储不可用或空间不足。请检查浏览器设置，当前输入仍保留。";
  }
}

export function clearScenarios(): string | null {
  try {
    window.localStorage.removeItem(SCENARIO_STORAGE_KEY);
    window.dispatchEvent(new Event(SCENARIO_STORAGE_KEY));
    return null;
  } catch {
    return "清空失败，请在浏览器设置中删除本站保存的数据。";
  }
}
