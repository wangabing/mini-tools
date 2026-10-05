# 接口与数据契约文档

> 版本：1.5
> 更新日期：2026-10-04

## 1. 当前接口状态

首版没有后端业务 API。计算值不会提交到服务器，联系页也只提供公开邮箱链接。当前可依赖的接口包括公开页面路由、纯 TypeScript 领域函数和静态预设数据。

## 2. 页面路由

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/` | 电商利润计算器 |
| GET | `/platforms` | 国内 20 个电商平台对比与选择指南 |
| GET | `/methodology` | 公式与费率口径 |
| GET | `/contact` | 联系邮箱 |
| GET | `/privacy` | 隐私政策 |
| GET | `/terms` | 使用条款 |
| GET | `/sitemap.xml` | 搜索引擎站点地图 |
| GET | `/robots.txt` | 抓取规则 |
| GET | `/manifest.webmanifest` | Web 应用清单 |

## 3. 利润计算接口

实现位置：`src/domain/profit/calculate.ts`

```ts
calculateProfit(input: ProfitInput): ProfitResult
normalizeProfitInput(input: ProfitInput): ProfitInput
```

`ProfitInput` 金额字段在当前国内版统一使用人民币 CNY，费率字段使用百分数而不是小数，例如 `15` 表示 15%。

主要输入：

```ts
type CalculationMode = "quick" | "professional"
type SalesChannel = "organic" | "advertising" | "creator"
type FeeBasis = "item-amount" | "buyer-paid" | "seller-settlement"

interface ProfitInput {
  calculationMode: CalculationMode
  salesChannel: SalesChannel
  itemPrice: number
  buyerShipping: number
  discount: number
  platformSubsidy: number
  productCost: number
  fulfillmentCost: number
  packagingCost: number
  advertisingCost: number
  insuranceCost: number
  otherFixedCost: number
  platformFeeRate: number
  platformFeeFixed: number
  platformFeeBase: FeeBasis
  paymentFeeRate: number
  paymentFixedFee: number
  paymentFeeBase: FeeBasis
  creatorCommissionRate: number
  creatorCommissionFixed: number
  creatorCommissionBase: FeeBasis
  taxRate: number
  taxFeeBase: FeeBasis
  refundLossRate: number
  returnRate: number
  returnShippingCost: number
  returnHandlingCost: number
  returnValueLossRate: number
  nonRefundableFeeRate: number
  targetMarginRate: number
  monthlyOrders: number
  monthlyPlatformCost: number
  monthlyOperatingCost: number
}
```

数字更新函数使用映射类型 `ProfitNumericInputKey`，字符串枚举字段使用独立 setter，避免把数值错误写入核算模式、渠道或计费基数。

主要输出包括 `grossRevenue`、`itemAmount`、`buyerPaid`、`sellerSettlement`、`transactionFees`、`expectedReturnLoss`、`recurringCostAllocation`、`totalCosts`、`profit`、`profitMargin`、`roi`、`breakEvenItemPrice`、`targetItemPrice`、`maximumAdvertisingCost`、`breakEvenRoas`、`monthlyProfit` 和 `costBreakdown`。

快速模式保留单一订单收入基数和闭式反推公式。专业模式按各自基数计算平台、支付、达人和税费，按退货概率计算预期售后损失，并使用同一正向模型进行有边界的二分反推。当费率组合无法反推，或月成本因订单量为 0 无法分摊时，对应字段返回 `null`，并通过 `validationMessage` 返回具体原因。输入负数、非有限数和非整数月订单会被规范化。

界面使用 `src/domain/profit/readiness.ts` 的纯函数评估常见经营项目覆盖情况：

```ts
assessCalculationReadiness(input: ProfitInput, options: ReadinessOptions): CalculationReadiness
```

准备度结果包含覆盖项数量、建议确认项和平台费是否仍待核对。该结果不改变利润公式，也不把零值视为计算错误。

## 4. 费率预设接口

实现位置：`src/data/presets.ts`

```ts
getPlatform(platformId: PlatformId): PlatformOption
getCategories(platformId: PlatformId): readonly CategoryOption[]
resolvePreset(platformId: PlatformId, categoryId: CategoryId): ResolvedPreset
```

`ResolvedPreset.resolution` 取值：

- `category`：找到平台和分类的专属预设。
- `platform`：使用平台通用预设。
- `global`：使用全局通用预设。

每条非通用 `FeePreset` 必须包含市场、来源 URL、来源访问属性、已知生效日期、复核日期、版本、核验状态、核验提示和未覆盖规则。`sourceAccess` 取值为 `public`、`login-required` 或 `contract-only`；无法公开核验的 0 费率必须设置 `verificationRequired: true`。

专业字段模板实现于 `src/data/professional-templates.ts`：

```ts
getProfessionalTemplate(platformId: PlatformId): ProfessionalTemplate
isProfessionalTemplateReviewDue(template: ProfessionalTemplate, asOf?: Date): boolean
```

`ProfessionalTemplate` 包含平台/支付/达人字段名、四类建议计费基数、支持渠道、核对清单、版本、复核日期、下次复核日期和官方来源。首批覆盖淘宝、天猫、京东、拼多多、抖音和快手；其他平台使用通用字段，但继承当前平台的来源入口。模板不包含任何数字费率字段。

## 5. 平台指南数据

实现位置：`src/data/platform-guides.ts`

`PlatformGuide` 与计算器共用 `PlatformId`，包含排名、平台模式、经营路径、入驻门槛、定位、成本结构、适合/不适合人群、优点、取舍、选择建议、近期经营信号、权益说明、官方入口和复核日期。

`PLATFORM_GUIDES` 必须与 20 个非通用平台一一对应。近期信息不得写成长期承诺，界面统一提示以商家后台、审核结果和合同为准。

## 6. 联系方式契约

联系页公开 `mailto:mrwbz@sina.com` 链接。该链接只请求浏览器打开用户设备上的邮件应用，不向本站发起留言请求，也不读取计算器输入、结果、平台或分类字段。

## 7. 部署配置契约

| 变量 | 用途 |
| --- | --- |
| `GITHUB_PAGES=true` | 按 GitHub Pages 公开地址配置路径前缀 |
| `GITHUB_REPOSITORY=owner/repository` | 公开地址缺失时用于推导仓库子路径 |
| `NEXT_PUBLIC_SITE_URL` | 推导 `basePath`，并生成 canonical、分享地址、robots 和 sitemap |

所有构建均生成 `out/` 静态站点。GitHub Actions 会从 Pages 设置读取 `NEXT_PUBLIC_SITE_URL`；默认项目地址产生仓库子路径，自定义域名产生空路径。

## 8. 未来提交 API（拟议，未实现）

建议路径：`POST /api/v1/calculation-submissions`

该接口只能在隐私政策、用户同意、限流和持久化方案完成后实现。建议请求：

```json
{
  "consent": true,
  "platformId": "taobao",
  "categoryId": "electronics",
  "currency": "CNY",
  "presetVersion": "2026.10-cn",
  "manualFeeOverrides": ["platformFeeRate"],
  "input": {
    "itemPrice": 39.99,
    "productCost": 9.5,
    "fulfillmentCost": 6.2,
    "advertisingCost": 5
  }
}
```

服务器必须补全缺省字段、验证范围、根据同版本计算模型重新计算结果，并只保存允许的结构化字段。建议响应：

```json
{
  "submissionId": "opaque-id",
  "acceptedAt": "2026-10-03T12:00:00Z"
}
```

## 9. 未来 SQLite 数据边界

建议核心表：

- `calculation_submissions`：匿名提交、平台、分类、币种、输入快照、结果快照、预设版本、覆盖标记和同意时间。
- `fee_presets`：版本化费率、来源、适用市场、审核状态和生效区间。
- `aggregation_runs`：聚合口径、样本过滤条件、执行时间和结果版本。

不得保存商品名称、SKU、联系方式或原始 IP。公开聚合前需要处理重复提交、机器人、极端值、默认示例数据和样本量过小的分类。
