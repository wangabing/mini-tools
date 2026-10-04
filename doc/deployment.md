# GitHub Pages 部署与运维文档

> 版本：3.0  
> 更新日期：2026-10-04  
> 当前方案：Next.js 静态导出 + GitHub Actions + GitHub Pages

## 1. 当前部署方式

网站不需要云主机、后端进程、数据库或第三方表单服务。GitHub Actions 在每次推送到 `main` 后执行 `next build`，把生成的 `out/` 静态文件发布到 GitHub Pages。

```text
推送 main
  -> GitHub Actions 构建 out/
  -> GitHub Pages 发布 HTML / CSS / JavaScript
  -> 浏览器本地完成利润计算
```

联系页只公开 `mrwbz@sina.com`。点击邮箱会打开访客设备上的邮件应用，网站不接收或转发邮件内容。

首次上线可以先使用：

```text
https://wangabing.github.io/mini-tools/
```

正式地址为 `https://tool.xiaozhan.info/`。域名通过阿里云 DNS 解析到同一站点，整个过程只需要 GitHub 和阿里云提供的 DNS 管理功能。

## 2. 上线前准备

需要：

- 能管理仓库 `wangabing/mini-tools` 的 GitHub 账号。
- Node.js 20.19 或更高版本，用于本地检查。
- 已完成实名认证和审核的域名 `xiaozhan.info`。

发布前在项目根目录执行：

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run build` 会直接生成 `out/`，不需要运行 `next start`。`out/` 是构建产物，不提交到 Git。

## 3. 首次发布到 GitHub Pages

仓库已经包含 `.github/workflows/deploy-pages.yml`，无需手工上传 `out/`。

1. 打开 GitHub 仓库，进入 **Settings > Pages**。
2. 在 **Build and deployment** 下，把 **Source** 设为 **GitHub Actions**。
3. 把当前代码推送到 `main`；也可以进入 **Actions > Deploy to GitHub Pages**，选择 **Run workflow** 手动执行。
4. 等待 `build` 和 `deploy` 两个任务完成。
5. 回到 **Settings > Pages**，打开 GitHub 显示的站点地址。

工作流会自动完成以下事情：

- 使用锁定依赖执行 `npm ci`。
- 从 GitHub Pages 读取当前公开地址。
- 为项目站点自动设置 `/mini-tools` 路径前缀。
- 生成静态 `out/` 并上传 Pages artifact。
- 发布成功后在 Actions 页面显示公开地址。

GitHub Free 账号通常需要公开仓库才能使用 Pages；私有仓库是否可用取决于账号方案。

## 4. 绑定 `tool.xiaozhan.info`

### 4.1 验证域名归属

为了防止域名被其他 GitHub 仓库占用，先在 GitHub 账号中验证域名：

1. 打开 GitHub 头像菜单中的 **Settings > Pages**。
2. 在 **Add a domain** 中填写根域名 `xiaozhan.info`。
3. GitHub 会给出一条 TXT 记录名和值。
4. 打开阿里云 **云解析 DNS > 权威域名解析 > xiaozhan.info > 解析设置**。
5. 添加 TXT 记录：主机记录使用 GitHub 给出的前缀，通常是 `_github-pages-challenge-wangabing`；记录值使用 GitHub 生成的验证码；TTL 保持默认。
6. DNS 生效后回到 GitHub，点击 **Verify**。

保留这条 TXT 记录，不要在验证成功后删除。

### 4.2 在仓库中登记自定义域名

1. 打开仓库 **Settings > Pages**。
2. 在 **Custom domain** 中填写 `tool.xiaozhan.info` 并保存。
3. 此时 DNS 检查暂未通过是正常状态。

先在 GitHub 登记自定义域名，再公开 CNAME 解析，可以降低子域名被错误占用的风险。

### 4.3 在阿里云配置 CNAME

在阿里云 `xiaozhan.info` 的解析设置中添加：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | `tool` | `wangabing.github.io` |

解析请求来源选择默认，TTL 使用默认值。若已经存在主机记录为 `tool` 的 A、AAAA 或 CNAME 记录，应先处理冲突。

不要把 CNAME 指向 `wangabing.github.io/mini-tools`，DNS 记录值只能是主机名，不能包含仓库路径。

### 4.4 完成 Pages 和 HTTPS 配置

1. 等待 GitHub Pages 显示 **DNS check successful**。
2. 进入 **Actions > Deploy to GitHub Pages**，手动重新运行工作流。
3. 等待 GitHub 完成 HTTPS 证书签发。
4. 证书可用后勾选 **Enforce HTTPS**。

重新构建是必要的：默认项目地址位于 `/mini-tools/`，自定义域名位于 `/`。工作流读取自定义域名后会自动移除仓库路径前缀，并同步更新 canonical、分享地址、`robots.txt`、`sitemap.xml` 和 Web App Manifest。

DNS 与证书生效可能需要数分钟到 24 小时。在此期间不要反复删除、重加域名设置。

## 5. 发布验收

每次首次发布或绑定域名后检查：

- 首页、`/platforms/`、`/methodology/`、`/contact/`、`/privacy/` 和 `/terms/` 均可打开。
- 刷新任意子页面不会出现 404。
- 页面样式、图标、站内链接和浏览器后退正常。
- `/manifest.webmanifest`、`/robots.txt` 和 `/sitemap.xml` 可以访问。
- `sitemap.xml` 中的链接使用当前公开域名，且没有错误的 `/mini-tools` 前缀。
- 联系页只显示邮箱，不出现在线留言输入框或发送按钮。
- 修改计算器输入时，浏览器网络面板没有发送售价、成本、费率或利润结果。
- 在 320px、390px 和桌面宽度下没有横向滚动或文字遮挡。
- 自定义域名使用 HTTPS，HTTP 会跳转到 HTTPS。

## 6. 本地模拟 Pages 构建

模拟默认的 GitHub 项目站点：

```bash
GITHUB_PAGES=true \
GITHUB_REPOSITORY=wangabing/mini-tools \
NEXT_PUBLIC_SITE_URL=https://wangabing.github.io/mini-tools \
npm run build
```

模拟自定义域名：

```bash
GITHUB_PAGES=true \
GITHUB_REPOSITORY=wangabing/mini-tools \
NEXT_PUBLIC_SITE_URL=https://tool.xiaozhan.info \
npm run build
```

本地查看时，使用根路径构建，然后运行：

```bash
npm run build
python3 -m http.server 4173 --directory out
```

然后打开 <http://localhost:4173>。上面的 GitHub 项目站点构建用于核对生成的 `/mini-tools` 资源前缀；普通文件服务器不会模拟 GitHub Pages 的仓库路径挂载，因此不要直接用它预览该构建。

## 7. 日常发布与回滚

日常发布只需把通过检查的代码推送到 `main`。同一分支连续推送时，工作流会按顺序部署，避免多个版本同时写入。

新版本异常时：

1. 在 Git 中创建一个撤销问题提交的新提交。
2. 推送到 `main`，等待 Pages 工作流重新发布。
3. 或在修复完成后，从 Actions 页面手动重新运行最近一次正确提交的工作流。

当前站点没有数据库和服务端状态，回滚静态文件不会产生数据迁移问题。

## 8. 当前能力边界

- GitHub Pages 只能提供静态文件，不能运行 Next.js 服务端功能、API 路由或数据库。
- 联系页的 `mailto:` 链接依赖访客设备已配置邮件应用；暂不提供站内发送能力。
- 当前没有访问统计、广告请求、账号系统或用户数据采集。
- GitHub Pages 有站点大小、带宽、构建频率和可接受用途限制。准备规模化推广或商业化前，应重新核对当时的官方条款与限额。
- 面向中国大陆用户时，不同网络的访问速度和可达性可能波动；使用境内基础设施还涉及域名备案和相应合规要求。

以后增加在线留言时，需要先准备自己的后端接口或其他明确选定的接收服务，并同时完成服务端校验、垃圾信息防护、限流、隐私说明、数据保留与删除策略。在这些条件完成前，不在静态页面中恢复留言表单。

## 9. 官方参考

- GitHub Pages 快速入门：<https://docs.github.com/pages/quickstart>
- 使用 Actions 发布：<https://docs.github.com/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>
- 自定义域名配置：<https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site>
- 验证自定义域名：<https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages>
- GitHub Pages 限制：<https://docs.github.com/pages/getting-started-with-github-pages/github-pages-limits>
- Next.js 静态导出：<https://nextjs.org/docs/app/guides/static-exports>
