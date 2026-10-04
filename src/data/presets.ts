export type PlatformId =
  | "generic"
  | "taobao"
  | "tmall"
  | "jd"
  | "pinduoduo"
  | "douyin"
  | "kuaishou"
  | "wechat-shop"
  | "xiaohongshu"
  | "xianyu"
  | "1688"
  | "vip"
  | "dewu"
  | "meituan-flash"
  | "jd-daojia"
  | "eleme-retail"
  | "suning"
  | "dangdang"
  | "baidu-aicaigou"
  | "weidian"
  | "kongfz";

export type CategoryId =
  | "generic"
  | "apparel"
  | "electronics"
  | "beauty"
  | "home"
  | "food"
  | "books"
  | "collectibles"
  | "local-retail"
  | "industrial"
  | "wholesale";

export type PresetSourceAccess =
  | "generic"
  | "public"
  | "login-required"
  | "contract-only";

export interface CategoryOption {
  id: CategoryId;
  label: string;
}

export interface PlatformOption {
  id: PlatformId;
  label: string;
  shortLabel: string;
  market: string;
  categories: readonly CategoryOption[];
}

export interface FeePreset {
  id: string;
  platformId: PlatformId;
  categoryId: CategoryId;
  platformFeeRate: number;
  paymentFeeRate: number;
  paymentFixedFee: number;
  refundLossRate: number;
  market: string;
  sourceUrl: string | null;
  sourceAccess: PresetSourceAccess;
  effectiveDate: string | null;
  reviewedAt: string | null;
  version: string;
  verificationRequired: boolean;
  verification: string;
  note: string;
}

export interface ResolvedPreset {
  preset: FeePreset;
  resolution: "category" | "platform" | "global";
  requestedCategoryId: CategoryId;
}

const CATEGORIES = {
  generic: { id: "generic", label: "通用类目" },
  apparel: { id: "apparel", label: "服饰鞋包" },
  electronics: { id: "electronics", label: "数码家电" },
  beauty: { id: "beauty", label: "美妆个护" },
  home: { id: "home", label: "家居日用" },
  food: { id: "food", label: "食品生鲜" },
  books: { id: "books", label: "图书音像" },
  collectibles: { id: "collectibles", label: "收藏文玩" },
  localRetail: { id: "local-retail", label: "本地零售" },
  industrial: { id: "industrial", label: "工业品" },
  wholesale: { id: "wholesale", label: "批发货源" },
} as const satisfies Record<string, CategoryOption>;

const GENERAL_CATEGORIES: readonly CategoryOption[] = [
  CATEGORIES.generic,
  CATEGORIES.apparel,
  CATEGORIES.electronics,
  CATEGORIES.beauty,
  CATEGORIES.home,
  CATEGORIES.food,
];

const B2B_CATEGORIES: readonly CategoryOption[] = [
  CATEGORIES.generic,
  CATEGORIES.wholesale,
  CATEGORIES.industrial,
  CATEGORIES.apparel,
  CATEGORIES.electronics,
  CATEGORIES.home,
];
const LOCAL_CATEGORIES: readonly CategoryOption[] = [
  CATEGORIES.generic,
  CATEGORIES.localRetail,
  CATEGORIES.food,
  CATEGORIES.beauty,
];

export const PLATFORMS: readonly PlatformOption[] = [
  { id: "generic", label: "通用电商", shortLabel: "通用", market: "自定义", categories: [CATEGORIES.generic] },
  { id: "taobao", label: "淘宝", shortLabel: "淘宝", market: "中国大陆", categories: GENERAL_CATEGORIES },
  { id: "tmall", label: "天猫", shortLabel: "天猫", market: "中国大陆", categories: GENERAL_CATEGORIES },
  { id: "jd", label: "京东开放平台", shortLabel: "京东", market: "中国大陆", categories: GENERAL_CATEGORIES },
  { id: "pinduoduo", label: "拼多多", shortLabel: "拼多多", market: "中国大陆", categories: GENERAL_CATEGORIES },
  { id: "douyin", label: "抖音电商", shortLabel: "抖音", market: "中国大陆", categories: GENERAL_CATEGORIES },
  { id: "kuaishou", label: "快手电商", shortLabel: "快手", market: "中国大陆", categories: GENERAL_CATEGORIES },
  { id: "wechat-shop", label: "微信小店", shortLabel: "微信小店", market: "中国大陆", categories: GENERAL_CATEGORIES },
  { id: "xiaohongshu", label: "小红书电商", shortLabel: "小红书", market: "中国大陆", categories: GENERAL_CATEGORIES },
  { id: "xianyu", label: "闲鱼", shortLabel: "闲鱼", market: "中国大陆", categories: [CATEGORIES.generic, CATEGORIES.electronics, CATEGORIES.apparel, CATEGORIES.books, CATEGORIES.collectibles] },
  { id: "1688", label: "1688", shortLabel: "1688", market: "中国大陆 / B2B", categories: B2B_CATEGORIES },
  { id: "vip", label: "唯品会", shortLabel: "唯品会", market: "中国大陆 / 品牌特卖", categories: [CATEGORIES.generic, CATEGORIES.apparel, CATEGORIES.beauty, CATEGORIES.home] },
  { id: "dewu", label: "得物", shortLabel: "得物", market: "中国大陆 / 潮流垂直", categories: [CATEGORIES.generic, CATEGORIES.apparel, CATEGORIES.electronics, CATEGORIES.beauty, CATEGORIES.collectibles] },
  { id: "meituan-flash", label: "美团闪购", shortLabel: "美团闪购", market: "中国大陆 / 即时零售", categories: LOCAL_CATEGORIES },
  { id: "jd-daojia", label: "京东秒送 / 京东到家", shortLabel: "京东秒送", market: "中国大陆 / 即时零售", categories: LOCAL_CATEGORIES },
  { id: "eleme-retail", label: "饿了么零售", shortLabel: "饿了么", market: "中国大陆 / 即时零售", categories: LOCAL_CATEGORIES },
  { id: "suning", label: "苏宁易购开放平台", shortLabel: "苏宁易购", market: "中国大陆", categories: [CATEGORIES.generic, CATEGORIES.electronics, CATEGORIES.home] },
  { id: "dangdang", label: "当当开放平台", shortLabel: "当当", market: "中国大陆", categories: [CATEGORIES.generic, CATEGORIES.books, CATEGORIES.home, CATEGORIES.apparel] },
  { id: "baidu-aicaigou", label: "百度爱采购", shortLabel: "爱采购", market: "中国大陆 / B2B", categories: B2B_CATEGORIES },
  { id: "weidian", label: "微店", shortLabel: "微店", market: "中国大陆 / 私域", categories: GENERAL_CATEGORIES },
  { id: "kongfz", label: "孔夫子旧书网", shortLabel: "孔夫子", market: "中国大陆 / 图书收藏", categories: [CATEGORIES.generic, CATEGORIES.books, CATEGORIES.collectibles] },
];

const SHARED_VERSION = "2026.10-cn";
const REVIEWED_AT = "2026-10-03";
const DEFAULT_VERIFICATION = "费率因类目、主体、活动或履约方式而异，请用商家后台或合同中的当前值覆盖。";

interface DomesticPresetSeed {
  platformId: Exclude<PlatformId, "generic">;
  sourceUrl: string;
  sourceAccess: Exclude<PresetSourceAccess, "generic">;
  note: string;
}

const DOMESTIC_PRESET_SEEDS: readonly DomesticPresetSeed[] = [
  { platformId: "taobao", sourceUrl: "https://seller.taobao.com/", sourceAccess: "login-required", note: "未包含基础软件服务费、淘宝客、推广、运费险、物流及退款后的费用处理。" },
  { platformId: "tmall", sourceUrl: "https://zhaoshang.tmall.com/", sourceAccess: "contract-only", note: "店铺类型、类目资质、保证金、基础服务费和营销佣金需分别核对。" },
  { platformId: "jd", sourceUrl: "https://zhaoshang.jd.com/", sourceAccess: "login-required", note: "未包含类目技术服务费、平台使用费、联盟佣金、京东物流和售后费用。" },
  { platformId: "pinduoduo", sourceUrl: "https://mms.pinduoduo.com/", sourceAccess: "login-required", note: "未包含支付或技术服务费、多多进宝、推广、活动让利、运费险和售后损失。" },
  { platformId: "douyin", sourceUrl: "https://fxg.jinritemai.com/", sourceAccess: "login-required", note: "技术服务费、精选联盟或达人佣金、千川投放、保险和物流必须分项核对。" },
  { platformId: "kuaishou", sourceUrl: "https://s.kwaixiaodian.com/", sourceAccess: "login-required", note: "技术服务费、快分销佣金、磁力金牛、保险和物流必须分项核对。" },
  { platformId: "wechat-shop", sourceUrl: "https://channels.weixin.qq.com/shop/rules", sourceAccess: "public", note: "自营、橱窗带货和达人分销口径不同，避免重复计入技术服务费与支付费。" },
  { platformId: "xiaohongshu", sourceUrl: "https://ark.xiaohongshu.com/", sourceAccess: "login-required", note: "未包含技术服务费、支付渠道费、买手佣金、聚光推广、物流和售后。" },
  { platformId: "xianyu", sourceUrl: "https://www.goofish.com/", sourceAccess: "login-required", note: "高频或高额经营卖家、验货和保障服务可能触发额外费用，以 App 规则中心为准。" },
  { platformId: "1688", sourceUrl: "https://seller.1688.com/", sourceAccess: "login-required", note: "诚信通等会员费应按订单摊销，交易服务费、分销佣金和营销费用需分开。" },
  { platformId: "vip", sourceUrl: "https://vis.vip.com/", sourceAccess: "contract-only", note: "结算折扣、合同扣点、仓配、退货和活动分摊通常由招商合同确定。" },
  { platformId: "dewu", sourceUrl: "https://merchant.dewu.com/", sourceAccess: "login-required", note: "技术、运营、支付、鉴别查验、包装仓储和物流可能按类目与价格阶梯计费。" },
  { platformId: "meituan-flash", sourceUrl: "https://rules-center.meituan.com/", sourceAccess: "contract-only", note: "平台服务费、配送、商家承担活动和推广费用以门店合同与账单为准。" },
  { platformId: "jd-daojia", sourceUrl: "https://store.jddj.com/", sourceAccess: "contract-only", note: "平台服务、即时配送、营销活动、支付与售后费用以商家合同和账单为准。" },
  { platformId: "eleme-retail", sourceUrl: "https://kaidian.ele.me/", sourceAccess: "contract-only", note: "服务费、蜂鸟或自配送、活动补贴、推广和包装需按门店合同拆分。" },
  { platformId: "suning", sourceUrl: "https://sop.suning.com/", sourceAccess: "login-required", note: "未包含保证金、平台使用费、类目服务费、支付、仓配和售后。" },
  { platformId: "dangdang", sourceUrl: "https://open.dangdang.com/", sourceAccess: "contract-only", note: "保证金、平台使用费、类目佣金、营销和退换货条件需按审核结果核对。" },
  { platformId: "baidu-aicaigou", sourceUrl: "https://kaidian.baidu.com/mallplat/index.html", sourceAccess: "contract-only", note: "核心成本通常是会员与推广获客成本，不应强行等同于商城订单佣金。" },
  { platformId: "weidian", sourceUrl: "https://d.weidian.com/", sourceAccess: "login-required", note: "SaaS 套餐、支付、平台流量场景、分销佣金和私域成交费用需要分开核对。" },
  { platformId: "kongfz", sourceUrl: "https://seller.kongfz.com/", sourceAccess: "login-required", note: "店铺周期费、交易服务费、支付、推广和包装物流需按店铺等级与账单核对。" },
];

export const FEE_PRESETS: readonly FeePreset[] = [
  {
    id: "generic-default",
    platformId: "generic",
    categoryId: "generic",
    platformFeeRate: 0,
    paymentFeeRate: 3,
    paymentFixedFee: 0,
    refundLossRate: 3,
    market: "用户自定义",
    sourceUrl: null,
    sourceAccess: "generic",
    effectiveDate: null,
    reviewedAt: null,
    version: SHARED_VERSION,
    verificationRequired: false,
    verification: "通用模式不代表任何平台规则，请按自己的账单修改。",
    note: "平台佣金默认为 0；支付与退款为通用经营估算，可在高级设置中调整。",
  },
  ...DOMESTIC_PRESET_SEEDS.map<FeePreset>((seed) => ({
    id: `${seed.platformId}-generic`,
    platformId: seed.platformId,
    categoryId: "generic",
    platformFeeRate: 0,
    paymentFeeRate: 0,
    paymentFixedFee: 0,
    refundLossRate: 3,
    market: getPlatform(seed.platformId).market,
    sourceUrl: seed.sourceUrl,
    sourceAccess: seed.sourceAccess,
    effectiveDate: null,
    reviewedAt: REVIEWED_AT,
    version: SHARED_VERSION,
    verificationRequired: true,
    verification: DEFAULT_VERIFICATION,
    note: seed.note,
  })),
];

export const SOURCE_ACCESS_LABELS: Readonly<Record<PresetSourceAccess, string>> = {
  generic: "通用假设",
  public: "公开规则入口",
  "login-required": "需登录商家后台",
  "contract-only": "以招商或合同为准",
};

export function getPlatform(platformId: PlatformId): PlatformOption {
  return PLATFORMS.find((platform) => platform.id === platformId) ?? PLATFORMS[0];
}

export function getCategories(platformId: PlatformId): readonly CategoryOption[] {
  return getPlatform(platformId).categories;
}

export function resolvePreset(
  platformId: PlatformId,
  categoryId: CategoryId,
): ResolvedPreset {
  const categoryPreset = FEE_PRESETS.find(
    (preset) => preset.platformId === platformId && preset.categoryId === categoryId,
  );

  if (categoryPreset && categoryId !== "generic") {
    return { preset: categoryPreset, resolution: "category", requestedCategoryId: categoryId };
  }

  const platformPreset = FEE_PRESETS.find(
    (preset) => preset.platformId === platformId && preset.categoryId === "generic",
  );

  if (platformPreset) {
    return { preset: platformPreset, resolution: "platform", requestedCategoryId: categoryId };
  }

  return {
    preset: FEE_PRESETS[0],
    resolution: "global",
    requestedCategoryId: categoryId,
  };
}
