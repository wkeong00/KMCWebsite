# KMC 63 Trading — Website

KMC 63 Trading 官网。业务包括：

- 不锈钢 / 铝合金烤盘定制（Bun Tray、Steamer、Trolley 等）
- 烤盘喷漆涂层与翻新（PTFE 水性双层不粘涂层）
- 烤盘与烘焙设备维护服务

线上域名：<https://kmcbakingtray.com>

## 技术栈

- React 18
- Create React App (`react-scripts` 5)
- React Router 6
- 原生 CSS

## 本地开发

### 环境要求

- Node.js **24.x**（与 Vercel 构建环境一致）
- npm 11+

项目已通过 `engines.node` 指定 Node 24。

### 安装与启动

```powershell
cd C:\Users\wkeong\Desktop\Workprojects\KMC-draft
npm ci --legacy-peer-deps
npm start
```

打开：

```
http://localhost:3000
```

### 生产构建

```powershell
npm run build
npx serve -s build
```

## 页面路由

| 页面 | 路由 |
|---|---|
| 首页 | `/` |
| 关于我们 | `/aboutUs` |
| 服务 | `/Services` |
| 产品 | `/Products` |

## 设计状态

设计决策已确认：深青绿 + 铜色、Space Grotesk / Inter / Noto Sans SC、服务页 EN / 中文 Tab、产品页轻量详情 Modal。当前进入 Phase 1。

## 文档

- [前端重设计方案](docs/FRONTEND_REDESIGN_PLAN.md)
- [本地运行指南](docs/LOCAL_DEV_GUIDE.md)
- [内容与素材准备清单](docs/CONTENT_CHECKLIST.md)
- [文档索引](docs/README.md)

## 部署

代码仓库：<https://github.com/wkeong00/KMCWebsite>

新部署使用 Vercel，导入该仓库并选择 `main` 为生产分支。根目录的 `vercel.json` 已配置：

- 框架：Create React App
- 安装：`npm ci --legacy-peer-deps`
- 构建：`npm run build`
- 输出目录：`build`
- SPA 路由回退，支持直接访问及刷新 `/aboutUs`、`/Services`、`/Products`

在 Vercel 的 Production / Preview 环境配置 `REACT_APP_WEB3FORMS_KEY`（参考 `.env.example`）；不要将 `.env.local` 提交到仓库。环境变量修改后需要重新部署。

先使用 `.vercel.app` 地址验收，再迁移 `kmcbakingtray.com` 与 `www` 的 DNS。旧 GitHub Pages 在切换完成前保持运行；本地 remote 的修改不会自动迁移域名或停止旧站。

`gh-pages` 脚本和根目录 `CNAME` 暂时保留作迁移参考。**不要运行 `npm run deploy`**：它现在会向新仓库的 `gh-pages` 分支推送，而不是更新旧站。日后通过推送到 `main` 触发 Vercel 部署。

## 联系信息

- Email: kmc63trading@gmail.com
- Phone / WhatsApp: +60163585326
- Address: No.1, Jalan Com Industrial Park 2/1, Com Industrial Park 2, Kawasan Perindustrian Kg. Baru Balakong, 43300 Seri Kembangan, Selangor Darul Ehsan, Malaysia
