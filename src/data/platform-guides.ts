import type { PlatformId } from "./presets";

export type SellerPath =
  | "low-barrier"
  | "content"
  | "brand"
  | "local"
  | "b2b";

export type PlatformModel =
  | "综合货架"
  | "内容电商"
  | "二手交易"
  | "批发与获客"
  | "即时零售"
  | "垂直平台"
  | "私域店铺";

export interface SellerPathOption {
  id: "all" | SellerPath;
  label: string;
  shortLabel: string;
  description: string;
}

export interface PlatformGuide {
  id: Exclude<PlatformId, "generic">;
  rank: number;
  name: string;
  shortName: string;
  model: PlatformModel;
  paths: readonly SellerPath[];
  barrier: "低" | "中" | "高" | "招商/合同";
  positioning: string;
  costModel: string;
  bestFor: string;
  notIdealFor: string;
  strengths: readonly string[];
  tradeoffs: readonly string[];
  selectionAdvice: string;
  recentSignal: string;
  benefitNote: string;
  officialLabel: string;
  officialUrl: string;
  reviewedAt: "2026-10-03";
}

export const SELLER_PATHS: readonly SellerPathOption[] = [
  { id: "all", label: "全部平台", shortLabel: "全部", description: "查看 20 个平台，再按经营条件缩小范围。" },
  { id: "low-barrier", label: "低门槛试水", shortLabel: "轻量起步", description: "适合先验证商品、价格和履约能力，避免一开始承担重资质与高固定投入。" },
  { id: "content", label: "内容带货", shortLabel: "内容成交", description: "适合能持续产出短视频、直播或种草内容，并愿意经营达人与投流效率的团队。" },
  { id: "brand", label: "品牌经营", shortLabel: "品牌沉淀", description: "适合资质、供应链和服务能力较成熟，希望积累品牌信任与稳定货架成交的商家。" },
  { id: "local", label: "本地即时零售", shortLabel: "小时达", description: "适合有实体门店、本地库存与即时履约能力的零售经营者。" },
  { id: "b2b", label: "批发 / B2B", shortLabel: "批发获客", description: "适合工厂、档口、批发商和以询盘、复购或大宗订单为主的经营者。" },
];

const REVIEWED_AT = "2026-10-03" as const;

export const PLATFORM_GUIDES: readonly PlatformGuide[] = [
  {
    id: "taobao", rank: 1, name: "淘宝", shortName: "淘宝", model: "综合货架", paths: ["low-barrier", "brand"], barrier: "低",
    positioning: "品类最宽的综合零售市场，适合从单品测试逐步走向店铺经营。",
    costModel: "软件服务费 + 支付/保险 + 淘宝客或推广 + 物流售后；不同费用的计费基数可能不同。",
    bestFor: "有稳定货源、愿意持续做商品信息与搜索运营的个人或小团队。",
    notIdealFor: "只靠一次性上架、没有客服履约能力，或无法承受同款比价的卖家。",
    strengths: ["用户覆盖和类目宽，选品验证空间大", "货架、内容和分销工具较完整"],
    tradeoffs: ["同款竞争强，搜索与推广需要持续经营", "历史费率经验容易失效，必须核对当前账单"],
    selectionAdvice: "新手可先用少量 SKU 验证转化；若主要优势是内容而非搜索，优先再对比抖音或小红书。",
    recentSignal: "平台持续把货架成交与内容场景连接，商家需要同时维护商品基础信息和内容触达。",
    benefitNote: "新商权益、行业活动和工具优惠随类目变化，请在卖家中心查看当前可报名项。",
    officialLabel: "淘宝卖家中心", officialUrl: "https://seller.taobao.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "tmall", rank: 2, name: "天猫", shortName: "天猫", model: "综合货架", paths: ["brand"], barrier: "高",
    positioning: "品牌心智更强的综合零售平台，强调主体资质、品牌授权和服务标准。",
    costModel: "保证金 + 基础/类目软件服务费 + 内容分销或推广 + 履约售后，具体以店铺类型和合同为准。",
    bestFor: "已有品牌、合规资质、稳定供应链和售后团队的成长型商家。",
    notIdealFor: "尚未验证产品、现金流紧张或资质不完整的个人试水项目。",
    strengths: ["品牌信任和消费心智较强", "大促、会员和品牌经营工具体系成熟"],
    tradeoffs: ["入驻审核和经营成本相对更高", "店铺类型、类目和活动规则复杂"],
    selectionAdvice: "先确认资质、保证金和年度投入，再判断品牌溢价能否覆盖成本；试品阶段通常先从淘宝等轻模式开始。",
    recentSignal: "品牌店铺经营更强调全域会员、内容与货架协同，而非只依赖单次大促。",
    benefitNote: "招商类目、品牌扶持与新商权益存在准入条件，以招商页和审核结果为准。",
    officialLabel: "天猫招商", officialUrl: "https://zhaoshang.tmall.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "jd", rank: 3, name: "京东开放平台", shortName: "京东", model: "综合货架", paths: ["brand"], barrier: "中",
    positioning: "以品质心智、标准化服务和供应链履约见长的综合零售平台。",
    costModel: "保证金/周期费 + 类目技术服务费 + 联盟推广 + 支付 + 仓配物流与售后。",
    bestFor: "3C 家电、家居和标准品商家，以及重视时效与正品信任的品牌。",
    notIdealFor: "毛利薄、库存不稳定或无法达到较高履约服务标准的卖家。",
    strengths: ["品质与履约心智清晰", "自营生态和物流能力可形成协同"],
    tradeoffs: ["POP 模式、店铺类型与仓配组合影响成本", "物流按重量、体积和区域计费，不能只填统一费率"],
    selectionAdvice: "先算清仓配和售后，再比较平台转化优势；标准化高客单商品通常比低毛利非标品更匹配。",
    recentSignal: "即时零售与传统货架正在协同，拥有本地库存的商家还可对比京东秒送。",
    benefitNote: "类目招商、店铺模式和阶段性扶持请从官方招商入口查询。",
    officialLabel: "京东招商", officialUrl: "https://zhaoshang.jd.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "pinduoduo", rank: 4, name: "拼多多", shortName: "拼多多", model: "综合货架", paths: ["low-barrier"], barrier: "低",
    positioning: "强调价格竞争力与供给效率的大众零售平台。",
    costModel: "支付/技术服务 + 多多进宝 + 推广 + 活动让利 + 物流、运费险和售后。",
    bestFor: "供应链成本有优势、周转快、能精细控制履约与售后的小商家。",
    notIdealFor: "依赖高溢价、产能不稳或没有低成本履约能力的产品。",
    strengths: ["价格敏感用户规模大，爆品验证快", "入驻起步相对直接，适合供应链型卖家"],
    tradeoffs: ["价格和服务竞争强，利润空间易被压缩", "活动补贴与商家让利必须分开核算"],
    selectionAdvice: "先用保守退款率和广告成本测算；低价不等于低成本，至少留出履约异常与售后缓冲。",
    recentSignal: "平台仍以高性价比供给为核心，商家竞争从单纯低价转向成本、品质与履约综合效率。",
    benefitNote: "新店任务、活动报名与行业权益在商家后台动态展示，不应预先计入利润。",
    officialLabel: "拼多多商家后台", officialUrl: "https://mms.pinduoduo.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "douyin", rank: 5, name: "抖音电商", shortName: "抖音", model: "内容电商", paths: ["content", "brand"], barrier: "中",
    positioning: "由短视频、直播和商城共同驱动的兴趣电商平台。",
    costModel: "类目技术服务费 + 达人/联盟佣金 + 投流 + 支付保险 + 物流售后。",
    bestFor: "商品有演示性、能稳定产出内容或具备达人合作能力的卖家。",
    notIdealFor: "没有内容供给、无法快速承接波动订单或只按自然搜索经营的团队。",
    strengths: ["内容发现到成交链路短，爆发力强", "自播、达人和商城可组合经营"],
    tradeoffs: ["内容、投流和达人佣金可能同时发生", "流量波动大，对素材和履约反应速度要求高"],
    selectionAdvice: "把平台费、达人佣金和千川成本分开测算；先验证单笔模型，再放大直播或投流。",
    recentSignal: "商城货架的重要性提升，但内容质量与转化素材仍是获客的核心变量。",
    benefitNote: "新商任务、行业活动和学习资源从抖店及学习中心查看，以后台实际资格为准。",
    officialLabel: "抖店商家入口", officialUrl: "https://fxg.jinritemai.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "kuaishou", rank: 6, name: "快手电商", shortName: "快手", model: "内容电商", paths: ["content", "low-barrier"], barrier: "中",
    positioning: "重视主播信任、社区关系和直播转化的内容电商平台。",
    costModel: "类目技术服务费 + 快分销佣金 + 磁力金牛推广 + 支付保险 + 物流售后。",
    bestFor: "愿意长期直播、经营粉丝关系，或有产业带货源与主播资源的商家。",
    notIdealFor: "不愿持续出镜或内容经营、只期待上架后自然成交的卖家。",
    strengths: ["直播与信任型成交特色鲜明", "产业带和分销场景对中小商家友好"],
    tradeoffs: ["依赖持续内容和主播运营", "平台费、分销佣金与投流成本不能混算"],
    selectionAdvice: "有稳定直播能力时优先评估；否则先通过分销小规模验证退货率与实际佣金。",
    recentSignal: "内容成交继续向货架承接延伸，粉丝复购和店铺基础运营的重要性上升。",
    benefitNote: "商家成长任务、产业带计划和活动入口以工作台当前展示为准。",
    officialLabel: "快手商家工作台", officialUrl: "https://s.kwaixiaodian.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "wechat-shop", rank: 7, name: "微信小店", shortName: "微信小店", model: "私域店铺", paths: ["content", "low-barrier"], barrier: "低",
    positioning: "连接视频号内容、直播、公众号与社群关系的微信交易载体。",
    costModel: "类目技术服务费 + 达人佣金 + 可能的支付费用 + 投流 + 物流售后。",
    bestFor: "已有公众号、视频号、社群或门店私域触点的个人与小商家。",
    notIdealFor: "没有私域触达、也不准备做视频号内容或达人分销的冷启动项目。",
    strengths: ["社交关系和私域复购链路顺畅", "内容、社群和交易可在微信生态内衔接"],
    tradeoffs: ["公域冷启动能力取决于内容与关系积累", "自营、橱窗和达人模式的费用口径不同"],
    selectionAdvice: "已有私域时优先尝试；核账时先确认技术服务费是否已包含相关支付费用，避免重复。",
    recentSignal: "交易入口继续与视频号和微信内容生态整合，私域沉淀与达人协作并行。",
    benefitNote: "类目准入、成长任务和平台活动请从微信小店官方入口查看。",
    officialLabel: "微信小店", officialUrl: "https://channels.weixin.qq.com/shop", reviewedAt: REVIEWED_AT,
  },
  {
    id: "xiaohongshu", rank: 8, name: "小红书电商", shortName: "小红书", model: "内容电商", paths: ["content", "brand"], barrier: "中",
    positioning: "以生活方式种草、搜索决策和买手合作见长的内容交易平台。",
    costModel: "技术服务费 + 支付渠道费 + 买手/达人佣金 + 聚光推广 + 物流售后。",
    bestFor: "美妆、服饰、家居和生活方式产品，以及擅长审美内容的品牌或主理人。",
    notIdealFor: "产品缺乏内容表达空间、素材粗糙或只追求短期低价放量的卖家。",
    strengths: ["消费决策与口碑搜索价值高", "买手和品牌内容适合建立差异化"],
    tradeoffs: ["内容质量和社区表达要求高", "种草到成交存在周期，买手佣金需单独核算"],
    selectionAdvice: "适合高毛利、可被内容解释的产品；先看内容收藏与咨询，再判断是否加大站内成交投入。",
    recentSignal: "平台持续加强站内交易闭环，商家需兼顾内容资产与店铺承接效率。",
    benefitNote: "新商课程、类目活动和买手合作入口以商家管理平台当前信息为准。",
    officialLabel: "小红书商家平台", officialUrl: "https://ark.xiaohongshu.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "xianyu", rank: 9, name: "闲鱼", shortName: "闲鱼", model: "二手交易", paths: ["low-barrier"], barrier: "低",
    positioning: "覆盖闲置、二手、非标和收藏交易的轻量市场。",
    costModel: "基础交易费用 + 经营性卖家可能触发的附加费用 + 物流/验货保障 + 售后损失。",
    bestFor: "个人闲置、二手数码、非标单品、收藏品和小规模循环经营者。",
    notIdealFor: "需要标准品牌店形象、大规模批量订单或复杂团队协同的商家。",
    strengths: ["个人起步门槛低，非标商品接受度高", "适合验证二手和长尾商品需求"],
    tradeoffs: ["议价、沟通与纠纷处理成本较高", "高频或高额经营可能触发不同收费口径"],
    selectionAdvice: "适合低成本验证，但经营化后要及时核对身份阈值、验货费用与退款损失。",
    recentSignal: "专业卖家与个人闲置并存，平台对经营性交易和保障服务的区分更值得关注。",
    benefitNote: "收费阈值和专项服务以闲鱼 App 规则中心及当前账单为准。",
    officialLabel: "闲鱼网页版", officialUrl: "https://www.goofish.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "1688", rank: 10, name: "1688", shortName: "1688", model: "批发与获客", paths: ["b2b"], barrier: "中",
    positioning: "面向工厂、档口、批发商和采购商的产业带与批发交易平台。",
    costModel: "会员年费摊销 + 交易服务费 + 分销佣金 + 数字营销 + 物流与金融服务成本。",
    bestFor: "有稳定产能、阶梯报价、批量履约和复购服务能力的供货商。",
    notIdealFor: "只做单件零售、无法稳定交期或不具备报价与客户跟进能力的卖家。",
    strengths: ["采购心智明确，适合批量订单和长期客户", "产业带货源、分销和加工场景丰富"],
    tradeoffs: ["会员与获客费用要按有效订单摊销", "询盘、账期、样品和大货履约管理更复杂"],
    selectionAdvice: "用获客成本和复购周期评估，不要只看单笔佣金；先明确最小起订量与交期。",
    recentSignal: "线上批发正强化数字化交易和产业带服务，内容展示与快速报价同样重要。",
    benefitNote: "诚信通方案、行业活动和新商权益以商家工作台当前展示为准。",
    officialLabel: "1688 商家工作台", officialUrl: "https://seller.1688.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "vip", rank: 11, name: "唯品会", shortName: "唯品会", model: "垂直平台", paths: ["brand"], barrier: "招商/合同",
    positioning: "以品牌特卖和折扣零售为核心的精选平台。",
    costModel: "合同扣点/结算折扣 + 仓储配送 + 退货处理 + 活动分摊 + 可能的固定服务费。",
    bestFor: "有品牌授权、稳定库存和折扣货盘，希望集中清货或拓展特卖渠道的商家。",
    notIdealFor: "无品牌资质、库存浅或无法接受平台招商与结算条件的个人卖家。",
    strengths: ["品牌特卖心智清晰", "平台精选可减少无效同款竞争"],
    tradeoffs: ["招商和合同制门槛高", "结算、仓配与退货可能显著影响现金流"],
    selectionAdvice: "它不是普通个人开店首选；先拿到合同条款，再用净结算额倒推真实利润。",
    recentSignal: "平台继续围绕品牌折扣和精选货盘经营，供货稳定性与库存深度是关键。",
    benefitNote: "招商档期和合作政策由供应商平台与招商主管确认，不保证开放所有类目。",
    officialLabel: "唯品会供应商平台", officialUrl: "https://vis.vip.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "dewu", rank: 12, name: "得物", shortName: "得物", model: "垂直平台", paths: ["brand"], barrier: "中",
    positioning: "强调潮流商品、正品心智与鉴别履约的垂直交易平台。",
    costModel: "技术/运营/支付服务 + 鉴别查验 + 包装仓储 + 物流售后，常随类目与价格阶梯变化。",
    bestFor: "潮鞋服饰、美妆、数码和收藏品中具备正品货源与价格优势的商家。",
    notIdealFor: "货源证明不足、非标描述不清或无法适配鉴别履约流程的卖家。",
    strengths: ["年轻消费与正品鉴别心智强", "垂直品类的价格发现效率较高"],
    tradeoffs: ["鉴别、履约与阶梯费用结构较复杂", "品控或时效异常可能放大售后成本"],
    selectionAdvice: "先按具体类目和售价档读取后台费用，再把查验失败、包装和退货作为风险情景。",
    recentSignal: "品类正在扩展，但正品保障与专业履约仍是平台差异化核心。",
    benefitNote: "类目招商、活动与费用说明以得物商家后台当前页面为准。",
    officialLabel: "得物商家后台", officialUrl: "https://merchant.dewu.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "meituan-flash", rank: 13, name: "美团闪购", shortName: "美团闪购", model: "即时零售", paths: ["local"], barrier: "招商/合同",
    positioning: "连接本地门店库存与即时配送需求的小时级零售渠道。",
    costModel: "合同服务费 + 平台或商家配送 + 商家承担活动 + 推广 + 支付与售后。",
    bestFor: "便利店、商超、酒水、数码、鲜花等有门店和实时库存的本地商家。",
    notIdealFor: "无本地库存、无法快速拣货或商品毛利不足以覆盖配送的卖家。",
    strengths: ["强本地需求入口和即时履约心智", "可盘活线下库存并覆盖临时需求"],
    tradeoffs: ["配送距离、时段与活动会明显改变单笔利润", "门店库存准确度和接单速度要求高"],
    selectionAdvice: "先按配送半径和高峰时段测算；客单价过低时，配送与活动成本可能吞掉利润。",
    recentSignal: "即时零售覆盖品类持续扩大，线下门店的数字化库存与履约稳定性成为竞争基础。",
    benefitNote: "新店活动、配送方案和门店合作权益以商家端签约页面为准。",
    officialLabel: "美团规则中心", officialUrl: "https://rules-center.meituan.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "jd-daojia", rank: 14, name: "京东秒送 / 京东到家", shortName: "京东秒送", model: "即时零售", paths: ["local", "brand"], barrier: "招商/合同",
    positioning: "承接商超、品牌门店和本地零售即时需求的到家渠道。",
    costModel: "合同平台服务费 + 即时配送 + 支付 + 商家活动承担 + 广告与售后。",
    bestFor: "已有连锁或单店库存、标准化商品和即时拣配能力的本地零售商。",
    notIdealFor: "库存不同步、营业时段不稳定或缺少门店履约人员的经营者。",
    strengths: ["与京东品质和零售心智协同", "适合标准商品和品牌门店即时履约"],
    tradeoffs: ["合同与配送成本因城市门店而异", "活动补贴归属和取消退款需逐项核对"],
    selectionAdvice: "与美团闪购同时评估覆盖和配送方案，用真实门店客单价而非全国平均值测算。",
    recentSignal: "即时零售入口进一步整合，线上曝光与线下门店履约正在形成统一经营链路。",
    benefitNote: "入驻、配送与阶段性合作政策以京东到家商家中心当前签约信息为准。",
    officialLabel: "京东到家商家中心", officialUrl: "https://store.jddj.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "eleme-retail", rank: 15, name: "饿了么零售", shortName: "饿了么", model: "即时零售", paths: ["local"], barrier: "招商/合同",
    positioning: "从餐饮到商超、药店与本地零售的即时到家渠道。",
    costModel: "合同服务费 + 蜂鸟或自配送 + 商家活动承担 + 竞价推广 + 包装与售后。",
    bestFor: "有实体门店、即时需求商品和稳定出单拣配流程的本地商家。",
    notIdealFor: "远距离发货、低频高考虑商品或无法承担峰时配送波动的卖家。",
    strengths: ["本地用户即时需求明确", "配送网络和门店经营工具较成熟"],
    tradeoffs: ["满减与配送补贴的承担方容易误算", "区域、时段和门店合同差异大"],
    selectionAdvice: "把商家满减、包装和配送分开录入，重点观察实付客单价与高峰履约成本。",
    recentSignal: "非餐零售持续进入即时配送场景，门店商品结构与在线可售率更加重要。",
    benefitNote: "新店权益、配送方案和活动报名以开店入口及签约后台为准。",
    officialLabel: "饿了么开店", officialUrl: "https://kaidian.ele.me/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "suning", rank: 16, name: "苏宁易购开放平台", shortName: "苏宁易购", model: "综合货架", paths: ["brand"], barrier: "中",
    positioning: "家电、家居和标准零售品类心智较强的开放平台。",
    costModel: "保证金 + 平台使用费 + 类目技术服务费 + 支付推广 + 物流仓储与售后。",
    bestFor: "家电数码、家居品牌或能提供安装、配送和售后服务的商家。",
    notIdealFor: "非标准小商品、缺乏售后网络或库存深度不足的个人卖家。",
    strengths: ["家电家居和线下零售基础仍具识别度", "适合需要安装配送等服务的标准商品"],
    tradeoffs: ["类目适配度差异明显", "固定平台与仓配费用需要按订单合理摊销"],
    selectionAdvice: "仅在目标品类和履约能力匹配时纳入候选，先核验当前招商状态和完整费用表。",
    recentSignal: "经营重点仍围绕家电家居与零售服务协同，平台适配比单纯流量规模更重要。",
    benefitNote: "开放类目、招商政策和活动资源以开放平台当前公告为准。",
    officialLabel: "苏宁开放平台", officialUrl: "https://sop.suning.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "dangdang", rank: 17, name: "当当开放平台", shortName: "当当", model: "垂直平台", paths: ["brand"], barrier: "招商/合同",
    positioning: "以图书心智为核心并覆盖部分百货品类的垂直零售平台。",
    costModel: "保证金 + 平台使用费 + 类目佣金/技术服务费 + 营销 + 物流退换货。",
    bestFor: "出版社、图书经销商、文教用品及与阅读人群高度相关的品牌。",
    notIdealFor: "与阅读消费关联弱、无正规供货资质或追求超大流量的通用商品。",
    strengths: ["图书和阅读消费人群心智集中", "垂直场景可降低部分无关竞争"],
    tradeoffs: ["非核心类目的流量与适配性有限", "招商审核和合同费率需单独确认"],
    selectionAdvice: "图书文教优先评估，其他品类只有在人群高度重合时才值得作为补充渠道。",
    recentSignal: "图书仍是平台最清晰的用户资产，商家应围绕阅读场景而非泛铺货经营。",
    benefitNote: "开放类目、促销档期和合作政策以开放平台审核信息为准。",
    officialLabel: "当当开放平台", officialUrl: "https://open.dangdang.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "baidu-aicaigou", rank: 18, name: "百度爱采购", shortName: "爱采购", model: "批发与获客", paths: ["b2b"], barrier: "招商/合同",
    positioning: "依托搜索需求连接企业采购线索与供应商的 B2B 获客平台。",
    costModel: "会员/固定服务费摊销 + 推广消耗 ÷ 有效线索 + 销售跟进成本；交易费用另算。",
    bestFor: "工业品、原材料、机械设备和有线索跟进团队的企业供应商。",
    notIdealFor: "只做即时零售成交、没有销售跟进能力或客单价不足以覆盖线索成本的卖家。",
    strengths: ["承接主动搜索的采购需求", "适合高客单、长决策的 B2B 品类"],
    tradeoffs: ["线索不等于订单，转化率决定真实获客成本", "会员与推广成本不能套用商城佣金模型"],
    selectionAdvice: "用有效线索率、成交率和客单毛利倒推预算；没有跟进流程时不要只买曝光。",
    recentSignal: "B2B 搜索获客仍强调供给内容质量、响应速度和线索转化闭环。",
    benefitNote: "会员方案、行业专区和推广权益以商家入驻与销售合同为准。",
    officialLabel: "爱采购商家入驻", officialUrl: "https://kaidian.baidu.com/mallplat/index.html", reviewedAt: REVIEWED_AT,
  },
  {
    id: "weidian", rank: 19, name: "微店", shortName: "微店", model: "私域店铺", paths: ["low-barrier", "content"], barrier: "低",
    positioning: "适合个人、小团队搭建轻店铺并承接私域、内容和分销成交。",
    costModel: "SaaS/店铺套餐 + 支付服务 + 平台流量场景费 + 分销佣金 + 推广物流售后。",
    bestFor: "已有社群、公众号、内容账号或分销网络，希望快速形成交易闭环的卖家。",
    notIdealFor: "完全依赖平台自然公域流量、没有触达渠道或不愿做私域维护的项目。",
    strengths: ["开店轻量，私域承接灵活", "自营、内容与分销组合空间大"],
    tradeoffs: ["公域流量能力与头部综合平台不同", "私域成交和平台流量场景费用不可混用"],
    selectionAdvice: "已有流量来源时很实用；没有私域时，先确定获客渠道再选择店铺工具。",
    recentSignal: "轻店铺价值越来越取决于商家自己的内容、社群与客户资产，而非单一平台分发。",
    benefitNote: "套餐、新商任务和分销活动以商家平台当前展示为准。",
    officialLabel: "微店商家平台", officialUrl: "https://d.weidian.com/", reviewedAt: REVIEWED_AT,
  },
  {
    id: "kongfz", rank: 20, name: "孔夫子旧书网", shortName: "孔夫子", model: "垂直平台", paths: ["low-barrier"], barrier: "中",
    positioning: "面向旧书、古籍、文献和收藏交易的专业垂直市场。",
    costModel: "店铺等级/周期服务费摊销 + 交易服务费 + 支付推广 + 包装物流 + 纠纷损失。",
    bestFor: "旧书店、藏书经营者、古籍文献和收藏品专业卖家。",
    notIdealFor: "标准新品、快消品或缺少版本鉴别与专业描述能力的卖家。",
    strengths: ["图书收藏用户精准，长尾价值突出", "专业目录和卖家信誉有助于高信息密度交易"],
    tradeoffs: ["上架描述、品相与版本判断耗时", "周期费用和长尾库存需按实际周转摊销"],
    selectionAdvice: "专业货源匹配度高时优先；普通图书先比较当当与闲鱼的成交效率。",
    recentSignal: "垂直社区的核心仍是专业信息和信誉积累，精确描述比泛化铺货更有效。",
    benefitNote: "店铺等级、服务费和推广活动以卖家中心当前规则为准。",
    officialLabel: "孔夫子卖家中心", officialUrl: "https://seller.kongfz.com/", reviewedAt: REVIEWED_AT,
  },
];

export function getPlatformGuide(platformId: PlatformGuide["id"]): PlatformGuide {
  const guide = PLATFORM_GUIDES.find((platform) => platform.id === platformId);

  if (!guide) {
    throw new Error(`Missing platform guide for ${platformId}`);
  }

  return guide;
}
