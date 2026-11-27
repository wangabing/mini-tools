# 小站工具部署与运维

## 发布流程

Next.js 生成 `out/` 静态站点。GitHub Actions 读取 Pages 的公开地址，构建并上传静态产物。推送到 `main` 会触发发布，也可以手动运行 [Deploy to GitHub Pages](../.github/workflows/deploy-pages.yml)。执行发布前，请先确认要上线的提交。

| 地址 | 构建路径前缀 |
| --- | --- |
| `https://tool.xiaozhan.info/` | 根路径 |
| `https://wangabing.github.io/mini-tools/` | `/mini-tools` |

仓库 **Settings → Pages → Build and deployment** 的 **Source** 使用 **GitHub Actions**。工作流依次执行 `npm ci`、`npm run build` 和 Pages 部署。构建前会从依赖包复制 PDF.js 的 worker、字体、字符映射和 WebAssembly 到静态资源目录。

## 本地预览

使用 Node.js 20.19 或更高版本。

```bash
npm ci
npm run lint
npm run typecheck
npm test
GITHUB_PAGES=true NEXT_PUBLIC_SITE_URL=https://tool.xiaozhan.info npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory out
```

打开 <http://127.0.0.1:4173/>。如需检查 GitHub 默认项目路径的资源前缀，把 `NEXT_PUBLIC_SITE_URL` 改为 `https://wangabing.github.io/mini-tools` 重新构建。该产物需要挂载到 `/mini-tools/` 才能正常浏览。

## 域名和 HTTPS

- 在 GitHub 账号的 **Settings → Pages** 中查看 `xiaozhan.info` 的归属验证。首次配置时，将 GitHub 提供的 TXT 记录加到域名的 DNS 解析并完成验证，随后保留记录。
- 在仓库的 **Settings → Pages → Custom domain** 中确认 `tool.xiaozhan.info`。阿里云 DNS 的 `tool` CNAME 指向 `wangabing.github.io`。
- 域名或公开路径发生变化时，重新运行部署工作流。Pages 通过 DNS 检查并签发证书后，启用 **Enforce HTTPS**。

## 发布验收

1. 在 Pages 和 Actions 中确认本次部署的提交及站点地址，使用该地址打开首页并刷新 `/mergepdf/`、`/base64/` 和 `/unit/?active=length`。
2. 在桌面及手机上检查百灵鸟图标、工具搜索、分类入口，以及站内跳转和返回。
3. 用两份已知页数和顺序的 PDF 进行合并，确认下载正常。检查 PDF 转图片和 M3U8 站内示例，核对所需静态资源加载成功。
4. 检查 `/robots.txt`、`/sitemap.xml` 和 `/icon.png`。站点地图应使用部署对应的域名及路径前缀。
5. 通过自定义域名打开时检查证书、HTTPS 跳转和手机可访问性。记录部署提交、已验证地址及仍有问题的工具。

## 回滚

出现发布回归时，对问题提交执行 `git revert`，将回滚提交按正常流程发布，再在公开地址复查问题场景。站点由静态文件组成，浏览器保存的本地设置不需要服务端迁移。

## 参考

- [GitHub Actions 发布 Pages](https://docs.github.com/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages 自定义域名](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)
