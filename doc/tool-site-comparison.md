# 国内外在线工具站对照

调研日期为 2026-11-27。选取 4 个中文站和 5 个国际站，覆盖综合目录、开发者工具、PDF 和图像专用工具。通过公开网页搜索和 GitHub 仓库搜索发现候选，依据官网页面、公开前端资源、项目 README 和许可证核对。表中的隐私和部署结论以所列资料为限。本次对照未逐个执行工具或抓包审计。 [网页搜索](https://www.bing.com/search?q=%E5%9C%A8%E7%BA%BF%E5%B0%8F%E5%B7%A5%E5%85%B7+%E9%9A%90%E7%A7%81+GitHub+IT-Tools+OmniTools) · [GitHub 仓库搜索结果](https://api.github.com/search/repositories?q=it-tools+in:name+user:CorentinTh+fork:true&per_page=5)

小站工具目前有 79 个目录入口，覆盖 71 条工具路径。线上首页已经采用顶部搜索、分类侧栏和工具卡片。仓库按静态站点发布，文件工具在浏览器本机处理，M3U8 播放自填地址时会连接流源及播放清单指定的资源。从这套基线出发，优先改进工具查找、文件处理反馈和相邻任务跳转。 [线上首页](https://tool.xiaozhan.info/) · [本地实现与验收](betool-reference.md) · [发布配置](deployment.md)

| 站点 | 风格与布局 | 优势 | 隐私与部署 | 小站工具可借鉴 | 一手资料 |
| --- | --- | --- | --- | --- | --- |
| 中国 · BeTool | 顶部搜索、分类侧栏、分组卡片。卡片显示工具名、类别和一句用途。 | 开发、文件、图表和日常需求共用一套查找方式。与小站工具现有目录最接近。 | 官网将 PDF 合并和图片压缩标为本地处理。首页 HTML 含百度统计脚本。未确认公开部署源码或许可证。 | 保留目录结构，先清理重复的类别文案。卡片名直接说明动作，简述交代输入或输出，例如“合并 PDF · 按文件顺序导出一个 PDF”。 | [首页](https://www.betool.cn/) · [合并 PDF](https://www.betool.cn/mergepdf/) |
| 中国 · UU 工具箱 | 首页突出多关键词搜索，另有最新、热门和收藏入口。 | 目录很大时仍提供快速搜索和复用路径。搜索框会提示以空格分隔关键词。 | 隐私政策称绝大多数工具在浏览器本地处理，并披露可能收集访问和操作统计。未确认公开部署源码或许可证。 | 给搜索添加中文别名、大小写兼容和多词匹配。收藏与最近使用可仅存工具路径，支持清空。 | [首页](https://uutool.cn/) · [我的收藏](https://uutool.cn/favorite/) · [隐私政策](https://uutool.cn/privacy-policy.html) |
| 中国 · 即时工具 | 分类和搜索面向办公、音视频、图片与文档。PDF 合并页有操作区和同类工具入口。 | 合并页说明文件可拖拽排序，拆分、压缩、提取、排序等后续操作容易找到。官网另有会员和开放平台入口。 | 合并页声明纯浏览器实现。站点政策另说明需服务端处理的文件会临时存储并于 3 小时后删除。未确认可自托管。 | 合并页增加拖拽导入、清楚的队列顺序和单文件移除，保留键盘可操作的移动按钮。在结果旁放拆分或整理入口。 | [首页](https://www.67tool.com/) · [合并 PDF](https://www.67tool.com/pdf/merge) · [隐私政策](https://www.67tool.com/privacy) · [会员定价](https://www.67tool.com/price/) |
| 中国 · MKLab | 偏开发者工作台，入口按文本、图片和编码等用途分组，同时覆盖 API 文档与导航。JSON 页用明确动作命名。 | 格式化、压缩、编辑围绕同一份 JSON，减少在页面间搬运数据。 | 所查页面可确认功能，处理位置、项目许可和自托管方式未确认。 | 在现有 JSON 工具内并列放置格式化、压缩和复制，复用当前输入。增加可操作的错误定位和一键填入样例。 | [首页](https://www.mklab.cn/) · [JSON 工具](https://www.mklab.cn/utils/json) |
| 国际 · IT Tools | 开发者目录围绕分类、工具卡、搜索和收藏组织。工具标题及说明简短。 | 编码、格式化、转换等高频任务容易直接定位。源码提供新工具脚手架。 | Vue 项目，README 提供 Docker 自托管与构建方式，GPL-3.0。单项工具联网行为需要按实现核对。 | 把分类、搜索别名和相关工具统一维护在现有目录数据中。可参考其收藏动作与工具命名。 | [官网](https://it-tools.tech/) · [GitHub README](https://api.github.com/repos/CorentinTh/it-tools/readme) · [许可证](https://api.github.com/repos/CorentinTh/it-tools/license) |
| 国际 · OmniTools | Material UI 风格。工具按文件类型和数据任务归类，主页与分类有独立入口。 | 图片、音视频、PDF 和结构化数据共用目录与入口模式。与小站工具覆盖面接近。 | README 声明文件在客户端处理，提供 Docker 与 Compose，MIT。公开演示页含 Google Tag Manager 和 Amplitude 脚本。 | 给图片、PDF 和文本工具统一文件导入、处理中、错误和下载反馈。做同类工具时参考组件和模块边界。 | [公开演示](https://omnitools.app/) · [GitHub README](https://raw.githubusercontent.com/iib0011/omni-tools/main/README.md) · [许可证](https://raw.githubusercontent.com/iib0011/omni-tools/main/LICENSE) |
| 国际 · PDF24 Tools | 垂直 PDF 目录。合并页主操作是选择文件，另有页面模式、说明、FAQ 和相关工具。 | 文件级合并与按页组合对应两种清楚的用户意图。支持从合并继续到拆分、压缩或整理。 | Web 合并将文件交给德国服务器处理，文件和结果在最后一次使用后最多保留 1 小时。官方另提供 Windows 离线版 Creator。公开 Web 处理服务的自托管方式未确认。 | 先提高现有文件队列的可读性，显示页数和最终顺序。需要跨文件选页时，再验证带缩略图的独立页面模式。 | [工具目录](https://tools.pdf24.org/en/) · [合并 PDF](https://tools.pdf24.org/en/merge-pdf) · [Windows Creator](https://tools.pdf24.org/en/creator) |
| 国际 · Squoosh | 单任务图片工作台。突出选图、原图与结果的直观比较，以及格式和压缩选项。 | 调整参数时可以同时判断画质与文件大小。 | README 声明图片压缩在本地，公开站使用 Google Analytics，统计包含压缩前后体积。源码 Apache-2.0，README 提供本地构建方式。 | 在现有批量列表保留体积变化和 ZIP 下载，给当前选中图补充原图与结果预览、节省比例及输出格式。 | [官网](https://squoosh.app/) · [GitHub README](https://raw.githubusercontent.com/GoogleChromeLabs/squoosh/dev/README.md) · [许可证](https://api.github.com/repos/GoogleChromeLabs/squoosh/license) |
| 国际 · CyberChef | 左侧操作列表、中间配方、右侧输入与输出。支持搜索步骤、拖拽编排和逐步查看结果。 | 多个转换能组成可复用流程，适合重复清理文本。 | 官方称输入与配方在浏览器处理，支持静态下载、闭网部署和 Docker，Apache-2.0。公共页面含统计脚本。其分享 URL 可编码原始输入。 | 在现有文本工作流中增加常用预设、保存步骤和可选的逐步预览。分享功能只编码步骤和设置，用户文本留在编辑区。 | [官网](https://gchq.github.io/CyberChef/) · [GitHub README](https://raw.githubusercontent.com/gchq/CyberChef/master/README.md) · [许可证](https://api.github.com/repos/gchq/CyberChef/license) |

## 小站工具的改进顺序

| 优先级 | 改进 | 验收方式 |
| --- | --- | --- |
| 第一轮 | 提高搜索命中率。为工具补中文别名和英文常用词，在现有标题与描述匹配上支持多词查询。无结果时给出常见搜索词和分类入口。 | `合并pdf`、`pdf 合并`、`PDF压缩`、`JSON 美化` 各能进入对应工具。验证手机搜索和现有键盘导航。 [站内搜索实现](../components/betool/BeToolSearch.tsx) |
| 第一轮 | 补齐 PDF 合并关键反馈。把“在此设备处理文件”放到选文件处，文件列表显示顺序、页数和大小，处理后给出下载结果与下一步。 | 三份 PDF 经拖拽或按键重排后，下载结果中的实际页序与队列一致。损坏、加密和大文件样例返回对应提示。 [当前实现](../components/betool/media/PdfTools.tsx) · [验收待办](betool-roadmap.md) |
| 第二轮 | 让高频工具可复用。浏览器内保存收藏或最近使用的工具路径。在图片压缩中增加单图对照，在 JSON 工具中补充样例和错误定位。 | 清空浏览器中的工具记录后相应入口恢复初始状态。选定图片后可对照压缩前后效果，批量下载继续可用。错误样例能定位到需要修正的位置。 [图片压缩实现](../components/betool/media/ImageTools.tsx) · [开发工具实现](../components/betool/devText/code-tools.tsx) |
| 后续 | 为现有文本工作流提供“去空行并去重”等预设，支持保存和重新载入步骤。 | 刷新后载入预设可复现步骤顺序。分享链接只包含步骤配置。 [现有工作流](../components/betool/devText/text-tools.tsx) |

上述改进可沿用 GitHub Pages 静态发布。引入外部实现时，先从对应仓库的许可证判断可复用范围，再检查依赖和素材的许可。目录、操作流程和交互可作为自行实现的参考。 [发布配置](deployment.md) · [IT Tools GPL-3.0](https://api.github.com/repos/CorentinTh/it-tools/license) · [OmniTools MIT](https://raw.githubusercontent.com/iib0011/omni-tools/main/LICENSE) · [Squoosh Apache-2.0](https://api.github.com/repos/GoogleChromeLabs/squoosh/license)

## 访问记录

- 表中九个官网首页均获取到 HTTP 200。IT Tools 和 OmniTools 的首页以 JavaScript 渲染，此次查阅了公开页面、前端资源与 README。部分 `github.com` 网页或文件请求超时，相关结论使用取得 HTTP 200 的 GitHub API 或 `raw.githubusercontent.com` 资料。
- `https://tool.lu/` 本次返回 HTTP 204，未获取可核对的页面，因此未列入表格。 [在线工具](https://tool.lu/)
- 小站工具的单数域名首页返回 HTTP 200，GitHub Pages 默认项目地址跳转到该首页。首页链接指向的 `/mergepdf` 和 `/privacy` 均返回 HTTP 200，对应末尾加斜杠的地址均返回 HTTP 404。调研环境请求复数域名 `tools.xiaozhan.info` 时未解析。 [线上首页](https://tool.xiaozhan.info/) · [合并 PDF](https://tool.xiaozhan.info/mergepdf) · [隐私说明](https://tool.xiaozhan.info/privacy) · [GitHub Pages 默认地址](https://wangabing.github.io/mini-tools/) · [仓库站点配置](../src/config/site.ts)
