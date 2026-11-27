# 利衡电商利润计算器

面向国内电商个体户和中小商家的轻量利润决策工具。默认快速估算只需售价和几项核心成本；需要对账时可切换专业核算，分别处理平台、支付、达人佣金、售后风险和月度固定成本。

国内版统一使用人民币 CNY。选择费用需要登录后台或按合同确认的平台时，结果先以“费用待核对”的预览状态显示；核算完整度会提示仍需确认的常见成本区域，避免把未知零费率误认为免佣。

项目同时提供国内 20 个电商平台的选择指南，可按经营路径筛选并保留最多三个候选平台进行比较。

计算全部在浏览器中完成。当前版本不上传、保存或分析用户输入。联系页只提供公开邮箱 `mrwbz@sina.com`，暂不包含在线留言功能。

## 技术栈

- Next.js 16 App Router
- React 19 + TypeScript
- 原生 CSS 设计系统
- Vitest + Testing Library
- Lucide React 图标

## 本地运行

需要 Node.js 20.19 或更高版本。

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

## 常用命令

```bash
npm run dev        # 本地开发
npm run lint       # 代码检查
npm run typecheck  # TypeScript 检查
npm test           # 单元与组件测试
npm run build      # 生成 out/ 静态站点
```

## 目录结构

```text
app/                     页面、元数据和全局样式
components/calculator/   计算器表单与结果界面
components/platforms/    平台筛选与候选对比界面
components/ui/           小型通用控件
src/domain/profit/       纯 TypeScript 利润计算模型
src/data/                平台与商品类目参考费率
src/config/              站点与静态部署配置
tests/                   领域和界面测试
doc/                     需求、设计、接口、操作与部署文档
openspec/                产品规格、设计决策和变更记录
.github/workflows/       GitHub Pages 自动部署工作流
```

## 项目文档

- [产品需求文档](doc/product-requirements.md)
- [产品与技术设计](doc/product-design.md)
- [接口与数据契约](doc/api-and-data-contracts.md)
- [用户操作文档](doc/user-guide.md)
- [部署与运维文档](doc/deployment.md)
- [开源项目调研](doc/ecommerce-profit-calculator-research.md)
- [中国电商平台 Top 20 与成本规则调研](doc/china-ecommerce-platform-fee-research.md)
- [产品改进与发展路线图](doc/product-improvement-roadmap.md)
- [产品评审与阶段规划](doc/product-review-and-planning.md)
- [公开证据验证方案与首轮结果](doc/public-evidence-validation.md)
- [上线与持续运营待提供信息](doc/project-input-checklist.md)

商家招募暂不可行时，可通过公开资料研究与独立案例推进工程验证。首轮证据及合成场景保存在 `doc/research/`；运行 `node scripts/audit-profit-scenarios.mjs` 可用当前领域引擎重新生成复算报告。当前14个案例中8个一致、6个存在退货口径差异，默认命令成功只表示审计完成；加 `--strict` 时，有差异将退出1。这些案例不是商家账单或用户反馈。

## 计算口径

快速模式保持简洁口径：

```text
订单收入 = 商品售价 + 买家支付运费 - 订单折扣
比例成本 = 订单收入 x (平台费率 + 支付费率 + 税费预留 + 退款损失率)
固定成本 = 商品 + 履约 + 包装 + 广告 + 其他 + 固定支付费
单笔利润 = 订单收入 - 比例成本 - 固定成本
利润率 = 单笔利润 / 订单收入
ROI = 单笔利润 / 总成本
```

保本售价和目标售价通过同一个正向利润公式反推，并由单元测试验证闭环。内部计算保留完整精度，仅在界面展示时进行金额格式化。

专业模式把收入拆为优惠后商品金额、买家实付和商家结算，允许平台、支付、达人和税费使用各自计费基数。退货损失按“退货率 × 单次损失”计算，月度平台/软件与运营成本按预计订单分摊；保本和目标售价通过同一专业正向模型数值求解。

## 费率预设

计算器支持通用模式和 20 个国内平台。平台与类目费率是可编辑的参考值，不是平台账单的替代品。需要后台或合同数据的平台在用户明确确认前不会显示为决策就绪。每条非通用预设包含：

- 适用平台、市场和商品分类
- 来源 URL
- 生效日期与复核日期
- 数据版本、访问属性、核验状态和未覆盖规则

匹配顺序为“平台 + 分类 -> 平台通用 -> 全局通用”。复杂阶梯、售价门槛、履约和仓储费用需要用户根据实际账单补充。

无法公开核验的费率保持为 0 并显示“待核对”，不表示平台免佣。

淘宝、天猫、京东、拼多多、抖音和快手提供版本化专业字段模板。模板只包含平台常用字段名称、建议计费基数、核对清单和复核日期，不包含未经核验的数字费率；其他平台使用通用专业模板。

## 隐私

当前版本不上传、保存或分析用户填写的售价、成本、费率和利润结果，也没有在线留言、访问统计或其他数据提交功能。联系页的邮箱链接只会打开访客设备上的邮件应用。

## 部署

项目通过 GitHub Actions 自动构建并发布到 GitHub Pages，正式地址为：

```text
https://tool.xiaozhan.info/
```

自定义域名生效前，可以使用 GitHub 提供的地址验收：

```text
https://wangabing.github.io/mini-tools/
```

域名通过阿里云 DNS 解析到 GitHub Pages，不需要额外的网站托管或表单服务。详细的首次发布、域名验证、HTTPS、验收和回滚步骤见 [部署与运维文档](doc/deployment.md)。

广告发布商标识没有写入源码。接入广告前应保留现有固定尺寸广告区域，并根据目标市场补充隐私与同意管理。

## 许可证与免责声明

计算结果仅供经营估算，不构成财务、税务、法律或会计建议。平台会随时调整费率，定价前请以平台官方政策和实际账单为准。
