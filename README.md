# 小站工具

日常小事，轻松搞定。

小站工具是一个静态工具网站，覆盖开发运维、图片、PDF、文本、教育、图表、随机选择和日常工具。首页的 79 个入口对应 71 条工具路径。单位换算的八个预选入口通过查询参数复用同一页面。

文件和文本在浏览器内处理。M3U8 播放器提供站内示例，播放自填地址时浏览器会连接对应的流源。

## 本地运行

需要 Node.js 20.19 或更高版本。

```bash
npm ci
npm run dev
```

默认地址为 <http://localhost:3000>。

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

生产构建输出到 `out/`，可用普通静态文件服务器预览。部署流程和自定义域名配置见 [部署与运维](doc/deployment.md)。

## 维护入口

| 需要了解 | 从这里开始 |
| --- | --- |
| 哪些功能已验证，和参考站有哪些差异 | [实现与验收基线](doc/betool-reference.md) |
| 下一轮做什么，怎么验收 | [迭代清单](doc/betool-roadmap.md) |
| 新增或调整工具 | [目录数据](src/data/betool.ts)、[工具路由](app/(betool-tools)/)、[工具组件](components/betool/) |
| 修改站名、口号或标志 | [品牌配置](src/config/brand.ts)、[百灵鸟图标](app/icon.png) |
| 发布、检查域名或回滚 | [部署与运维](doc/deployment.md) |

## 历史项目

旧电商计算器的页面集中在 `app/_liheng/`。历史需求和计算口径见 [电商计算器产品需求](doc/product-requirements.md) 和 [电商计算器技术设计](doc/product-design.md)，历史设计和变更记录位于 `openspec/`。
