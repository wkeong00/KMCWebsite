# KMC 63 Trading — Frontend Docs

本目录存放前端重设计的方案与本地开发文档。

| 文档 | 内容 |
|---|---|
| [FRONTEND_REDESIGN_PLAN.md](./FRONTEND_REDESIGN_PLAN.md) | 现状审查、设计方向、Design Tokens、页面改造方案、技术方案、实施阶段、验收标准 |
| [LOCAL_DEV_GUIDE.md](./LOCAL_DEV_GUIDE.md) | Node 环境、安装依赖、`npm start`、生产构建、端口冲突、常见报错排查 |
| [CONTENT_CHECKLIST.md](./CONTENT_CHECKLIST.md) | 上线前需要客户确认的公司信息、服务参数、产品规格、图片与资质清单 |

## 当前状态

- 阶段：**设计决策已确认（2026-10-26），待进入 Phase 1**
- 代码：尚未开始改动
- 下一步：从 Phase 1（Design Tokens + Navbar/Footer + 基础 UI 组件）开始

### 已确认决策

| 项目 | 结论 |
|---|---|
| 主色 | 深青绿 + 铜色强调 |
| 字体 | Space Grotesk + Inter + Noto Sans SC |
| 服务页双语 | **EN / 中文 Tab**（默认 EN） |
| 产品详情 | **轻量 v1 Modal**（先做简单版本看效果） |

## 快速开始

```powershell
cd C:\Users\wkeong\Desktop\Workprojects\KMC-draft
npm install
npm start
```

浏览器打开 <http://localhost:3000>。

完整步骤见 [LOCAL_DEV_GUIDE.md](./LOCAL_DEV_GUIDE.md)。

## 重设计一句话概括

把现有的“深色图片遮罩 + 散落样式 + 图片图标”升级为：

> **Precision Industrial** — 深青品牌色 + 白钢冷灰 + 铜色强调 + 大留白 + 技术网格细节 + 真实工厂照片

核心改动：

1. 建立 CSS Design Tokens，统一颜色/字体/间距/圆角/阴影。
2. 重做 Navbar / Footer / Button / SectionHeading / PageHero。
3. 首页改为左文右图 Hero + 服务卡 + 工艺流程 + Bento 画廊。
4. Services 页拆成 Coating / Custom / Maintenance，增加 Before/After 滑块与双语 Tab。
5. Products 页修复筛选 bug，增加分类 chips、数量、产品详情。
6. 全站响应式、可访问性、SEO、图片性能优化。

## 本地运行状态

已在当前机器实测：

- Node `v24.22.1` / npm `11.5.2`
- `npm ci --legacy-peer-deps` 安装成功
- `npm start` 编译成功，`http://localhost:3000` 返回 HTTP 200
- 现有 ESLint 警告不影响运行，会在重设计中清理
