import { resolvePreset, type PlatformId, type PresetSourceAccess } from "./presets";
import type { FeeBasis, SalesChannel } from "@/src/domain/profit/types";

export interface ProfessionalTemplate {
  platformId: PlatformId;
  platformFeeLabel: string;
  paymentFeeLabel: string;
  creatorCommissionLabel: string;
  suggestedBases: {
    platform: FeeBasis;
    payment: FeeBasis;
    creator: FeeBasis;
    tax: FeeBasis;
  };
  supportedChannels: readonly SalesChannel[];
  checklist: readonly string[];
  version: string;
  reviewedAt: string;
  nextReviewAt: string;
  sourceUrl: string | null;
  sourceAccess: PresetSourceAccess;
}

type TemplateSeed = Omit<
  ProfessionalTemplate,
  "version" | "reviewedAt" | "nextReviewAt" | "sourceUrl" | "sourceAccess"
>;

export const FIRST_SIX_PROFESSIONAL_PLATFORM_IDS = [
  "taobao",
  "tmall",
  "jd",
  "pinduoduo",
  "douyin",
  "kuaishou",
] as const satisfies readonly PlatformId[];

const VERSION = "2026.10-professional-v1";
const REVIEWED_AT = "2026-10-03";
const NEXT_REVIEW_AT = "2027-01-03";
const ALL_CHANNELS: readonly SalesChannel[] = ["organic", "advertising", "creator"];

const GENERIC_SEED: TemplateSeed = {
  platformId: "generic",
  platformFeeLabel: "平台服务费",
  paymentFeeLabel: "支付渠道费",
  creatorCommissionLabel: "达人 / 分销佣金",
  suggestedBases: {
    platform: "seller-settlement",
    payment: "buyer-paid",
    creator: "seller-settlement",
    tax: "seller-settlement",
  },
  supportedChannels: ALL_CHANNELS,
  checklist: [
    "按后台账单确认各项百分比费用的计费基数",
    "确认固定交易费、保险及退款后不退费用",
    "将年费、软件费和人工等月度成本按订单量分摊",
  ],
};

const TEMPLATE_SEEDS: readonly TemplateSeed[] = [
  {
    ...GENERIC_SEED,
    platformId: "taobao",
    platformFeeLabel: "基础软件服务费 / 平台佣金",
    creatorCommissionLabel: "淘宝客佣金",
    checklist: ["核对基础软件服务费或类目扣点", "核对淘宝客与推广费用是否重复", "确认运费险和退款后的费用处理"],
  },
  {
    ...GENERIC_SEED,
    platformId: "tmall",
    platformFeeLabel: "技术服务费 / 类目扣点",
    creatorCommissionLabel: "阿里妈妈 / 淘客佣金",
    checklist: ["按店铺类型和类目核对技术服务费", "分开记录营销佣金与活动让利", "将年费或软件费按预计订单分摊"],
  },
  {
    ...GENERIC_SEED,
    platformId: "jd",
    platformFeeLabel: "类目佣金 / 技术服务费",
    creatorCommissionLabel: "京挑客佣金",
    checklist: ["按合同核对类目佣金与平台使用费", "分开记录京挑客和广告费用", "确认京东物流及售后逆向成本"],
  },
  {
    ...GENERIC_SEED,
    platformId: "pinduoduo",
    platformFeeLabel: "平台技术服务费",
    creatorCommissionLabel: "多多进宝佣金",
    checklist: ["按后台账单核对技术或支付服务费", "分开记录多多进宝与推广费用", "确认活动让利、运费险和售后损失"],
  },
  {
    ...GENERIC_SEED,
    platformId: "douyin",
    platformFeeLabel: "平台技术服务费",
    creatorCommissionLabel: "达人 / 精选联盟佣金",
    checklist: ["按类目核对技术服务费", "分开记录达人佣金与千川投放", "确认运费险、退货率和退款后不退费用"],
  },
  {
    ...GENERIC_SEED,
    platformId: "kuaishou",
    platformFeeLabel: "平台技术服务费",
    creatorCommissionLabel: "快分销佣金",
    checklist: ["按类目核对技术服务费", "分开记录快分销与磁力金牛费用", "确认保险、退货率和逆向物流成本"],
  },
];

function buildTemplate(seed: TemplateSeed): ProfessionalTemplate {
  const { preset } = resolvePreset(seed.platformId, "generic");
  return {
    ...seed,
    version: VERSION,
    reviewedAt: REVIEWED_AT,
    nextReviewAt: NEXT_REVIEW_AT,
    sourceUrl: preset.sourceUrl,
    sourceAccess: preset.sourceAccess,
  };
}

export const PROFESSIONAL_TEMPLATES: readonly ProfessionalTemplate[] = [
  buildTemplate(GENERIC_SEED),
  ...TEMPLATE_SEEDS.map(buildTemplate),
];

export function getProfessionalTemplate(platformId: PlatformId): ProfessionalTemplate {
  const exactTemplate = PROFESSIONAL_TEMPLATES.find(
    (template) => template.platformId === platformId,
  );
  if (exactTemplate) return exactTemplate;

  const genericTemplate = PROFESSIONAL_TEMPLATES[0];
  const { preset } = resolvePreset(platformId, "generic");
  return {
    ...genericTemplate,
    sourceUrl: preset.sourceUrl,
    sourceAccess: preset.sourceAccess,
  };
}

export function isProfessionalTemplateReviewDue(
  template: ProfessionalTemplate,
  asOf = new Date(),
): boolean {
  const reviewDeadline = new Date(`${template.nextReviewAt}T23:59:59+08:00`);
  return asOf.getTime() > reviewDeadline.getTime();
}
