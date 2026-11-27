# 线上兼容性验收

验收时间为 2026-11-27，正式地址为 [tool.xiaozhan.info](https://tool.xiaozhan.info/)。GitHub Pages 默认项目地址会跳转到此处。环境使用桌面 Chrome，并在 Chrome 中用 390 × 844 视口复测手机布局。

## 线上结果

| 项目 | 结果 |
| --- | --- |
| 首页与导航 | 首页返回 200。通过搜索进入合并 PDF 页面并刷新成功。首页、品牌图标、站点地图和站内 HLS 清单可读取。 |
| 路由 | 首页使用的 `/mergepdf` 和 `/privacy` 返回 200，站点地图列出的 `/mergepdf/` 返回 404。抽查的 `/base64/`、`/privacy/` 和 `/unit/?active=length` 也返回 404。 |
| PDF 合并 | 将三个合成文件重排后下载，得到 4 页。重新解析输出，横竖页尺寸、页序、90° 旋转和可提取的中文字符均与样本一致。手机宽度下也完成了合并和下载。 |
| 扫描页与 PDF.js | 将合并结果转为四张 PNG 并下载 ZIP。解包后检查了扫描页图像的已知像素，验证了线上渲染资源和导出路径。 |
| 较大样本 | 约 10.2 MiB 的 12 页图像样本加 1 页文字文件，下载后重新解析得到 13 页。桌面一次点击至下载完成约 0.27 秒，实际耗时取决于文件和设备。 |
| 异常输入 | 密码保护的 PDF 显示解锁提示。损坏 PDF 会停止处理，当前线上版本显示 PDF 库的英文错误。 |
| 文档级信息 | 样本的书签和可编辑表单在合并后缺失。样本里的签名字段没有有效签名，本次没有核验真实数字签名。 |
| 网络行为 | 测试期间只观察到站内 GET、HEAD 请求和浏览器生成的下载，未观察到文件上传或第三方 HTTP 请求。 |

样本均为合成文件。使用 Chrome 打印带标记的中文 PDF，使用 pdf-lib 生成含旋转页、书签和表单的样本，使用 Canvas 生成可核对像素的扫描页和多页图像样本，并用 pypdf 生成一份密码保护的样本。

## 已修复待发布

- 工作流通过 Pages Action 获取公开地址，使用仓库的 `next.config.ts` 生成静态产物。此前 Action 的 Next.js 自动配置只检测 JavaScript 配置文件，在此仓库生成了额外的配置文件。修复后，本地导出的 `out/mergepdf/index.html` 与站点地图中的 `/mergepdf/` 一致。 [工作流](../.github/workflows/deploy-pages.yml) · [Pages Action 源码](https://github.com/actions/configure-pages/blob/v5/src/set-pages-config.js)
- 损坏和加密文件显示包含文件名的中文错误。错误处理区分 PDF.js 的密码异常和 pdf-lib 的加密文档错误。 [实现](../components/betool/media/pdfBrowser.ts) · [回归测试](../tests/betool-media.test.ts)

## 待复验

发布修复后，从线上站点地图抽查尾斜杠链接和 PDF 异常提示。WebKit 在本次环境中超时，Safari 和实体手机尚无通过记录。后续还需检查更大文件、真实数字签名以及书签和表单保真的需求。 [迭代清单](betool-roadmap.md)
