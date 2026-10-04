## Why

网站目前缺少明确的联系入口，用户遇到费率、计算或使用问题时只能离开页面，也没有可持续收集产品反馈的通道。同时，项目需要在不购买云主机和域名的前提下公开上线，以较低成本验证访问与运营效果。

## What Changes

- 新增简洁的联系与留言页面，公开展示 `mrwbz@sina.com`，并提供姓名、回复邮箱和留言内容表单。
- 使用可配置的托管表单端点发送留言；未配置或提交失败时，始终提供直接发送邮件的退路。
- 明确告知用户留言发送范围，且不把计算器输入或结果附加到留言中。
- 为 Cloudflare Pages 和 GitHub Pages 增加静态导出配置；GitHub Pages 工作流兼容仓库子路径访问。
- 在 `doc/` 中提供从 GitHub、Cloudflare Pages、Formspree 注册到首次上线的完整部署文档，并说明 GitHub Pages 与 Vercel 的商业使用限制及其他备选方案。
- 更新全站导航、站点地图、README、隐私说明和用户文档，使联系入口和部署方式可发现。

## Capabilities

### New Capabilities

- `contact-feedback`: 规定联系信息、留言表单、提交状态、失败退路和留言隐私边界。
- `static-site-deployment`: 规定 Cloudflare Pages 主部署、GitHub Pages 备选部署、静态导出、仓库子路径兼容及配置缺失时的行为。

### Modified Capabilities

- `calculator-experience`: 补充公共联系入口，并区分本地计算数据与用户主动提交的留言信息。

## Impact

- 新增 `/contact` 页面及一个轻量客户端表单组件。
- 调整 Next.js 配置、站点元数据、导航、页脚、隐私页面和全局样式。
- 新增通用静态导出配置、GitHub Actions Pages 工作流与环境变量配置说明。
- 不新增运行时后端、数据库或前端框架；留言由外部托管表单服务处理。
