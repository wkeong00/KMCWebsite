# KMC 63 Trading 前端重设计方案

> 项目：KMC 63 Trading（不锈钢烤盘定制 + 烤盘喷漆涂层 / 翻新）
> 仓库：`thingamajiggg/KMC-draft`
> 技术栈：Create React App + React 18 + React Router 6 + 原生 CSS
> 文档版本：v1.2
> 状态：用户已确认方案并授权实施；前端第一版已完成，进入本地视觉验收（2026-10-26）。部署与 DNS 保持不变，实施记录见 FRONTEND_REDESIGN_IMPLEMENTATION.md

---

## 1. 项目背景与目标

### 1.1 业务定位

KMC 63 Trading 是一家马来西亚的 B2B 制造与服务工厂，核心业务：

1. **Coating / Refurbishment**：旧烤盘翻新、重新喷涂、PTFE 水性双层不粘涂层。
2. **Custom Stainless Steel Fabrication**：白钢 / 铝合金烤盘、异形烤盘、定制尺寸与图案。
3. **Maintenance / Repair**：烤盘与相关烘焙设备的维护服务。
4. **Standard Products**：Bun Tray、Steamer、Trolley 等标准产品。

目标客户是烘焙厂、食品工厂、中央厨房、经销商，而不是普通消费者。因此网站气质应该更接近：
**精密制造 + 食品级卫生 + 工业可靠 + 可定制能力**，而不是普通餐饮店或电商网站。

### 1.2 本次重设计目标

| 目标 | 说明 |
|---|---|
| 现代化视觉 | 建立统一的设计系统，摆脱“图片 + 深色遮罩 + 圆角卡片”的旧式观感 |
| 强化信任 | 用 30+ 年经验、工厂实拍、工艺步骤、材料与涂层能力建立 B2B 信任 |
| 突出两项核心业务 | Coating 与 Custom Fabrication 必须一眼可辨，而不是混在三个卡片里 |
| 提升转化 | 每个页面都有清晰的 Quote / WhatsApp / Contact 行动入口 |
| 可维护 | CSS token 化、组件化，解决全局样式互相污染的问题 |
| 可访问 & 响应式 | 键盘可用、对比度达标、320px–1920px 全断点正常 |
| 性能 | 控制 19MB 图片资产，首屏加载与 CLS 达标 |

### 1.3 非目标（本期不做）

- 不接后台 CMS、不做线上下单与支付。
- 不做多语言路由（`/en`、`/zh`）；本期用页面内 **EN / 中文 Tab** 解决。
- 不迁移到 Next.js / Vite（降低风险；如后续需要再单独评估）。
- 不重构联系表单后端（仍使用 Web3Forms）。

---

## 2. 现状审查

### 2.1 页面与路由

| 路由 | 页面 | 入口文件 |
|---|---|---|
| `/` | 首页 | `src/Components/Home/Home.jsx` |
| `/aboutUs` | 关于我们 | `src/Components/AboutPage/AboutPage.jsx` |
| `/Services` | 服务 | `src/Components/ServicePage/ServicePage.jsx` |
| `/Products` | 产品 | `src/Components/Product/ProductPage.jsx` |

共用：`Navbar`、`Footer`、`Contact`、`CompanyPhoto`、`Title`。

### 2.2 主要问题清单

#### 视觉层

1. **全站缺少设计系统**：颜色、字号、间距、圆角、阴影均为散落硬编码。
2. **Hero 使用全屏深色照片 + 遮罩**：视觉沉重，文字与背景对比不稳定，且首屏图片体积大。
3. **卡片阴影过重**：`0 4px 6px rgba(0,0,0,.5)` 产生廉价感。
4. **图片比例不统一**：服务卡片、画廊、产品图尺寸不一致，容易跳动。
5. **图标混用 PNG 与 FontAwesome**：风格不统一，且 PNG 图标在高分屏发虚。
6. **页面头部不一致**：About / Services / Products 三个页头分别实现，布局与遮罩不统一。
7. **字体只有 Outfit**：缺少中文覆盖，中文会回退到系统字体，观感不稳定。
8. **Contact 区块在多个页面重复且样式相同**：缺少页面级 CTA 层次。

#### 结构与交互层

9. **Navbar 永远白字**：滚动到浅色内容区时对比度不足；移动端抽屉没有遮罩、没有键盘关闭。
10. **Contact 按钮使用 `react-scroll` 的 `Button`**：在 `/aboutUs`、`/Services`、`/Products` 页面点击时，页面里没有 `contact` 锚点，可能无反应。
11. **产品筛选逻辑有 bug**：`setItems(newItems)` 后，`menuItems` 由已筛选结果推导，分类会逐渐消失；应保留完整数据源，派生筛选结果。
12. **客户 slider 用硬编码 `tx` 百分比**：项目数量变化时容易失效；箭头图标是 PNG 圆形按钮，视觉突兀。
13. **ServiceCustom 页面中英内容整段重复堆叠**：信息密度过高，用户需要滚动很久。
14. **图片缺少 `alt`**：大量 `alt=""`，对 SEO 与可访问性不友好。
15. **导航没有 active 状态同步路由**：刷新或直接访问子页面时，菜单下划线状态不准确。

#### CSS 工程层

16. `ProductFilter.css` 里存在全局 `*`、`body`、`h1`、`.row`、`.card`、`.container` 重置，污染全站。
17. `.container` 同时承担“页面左右 padding”和“内容宽度”两个职责，嵌套时出现双重 padding。
18. `About.css` 同时被首页 About 和 AboutPage 复用，改一处会影响两处。
19. 存在注释掉的大段旧 CSS，后续维护困难。
20. 媒体查询断点不统一（`1200 / 1000 / 850 / 840 / 800 / 700 / 650 / 600`）。

### 2.3 内容问题

- 首页 Hero 文案偏长，缺少明确的价值主张与主 CTA。
- About 文案重复（同一段话在首页与 About 页重复出现）。
- Services 页把中文和英文两套完整内容顺序排列，没有语言切换或折叠。
- 产品只有型号与一句描述，缺少尺寸、材质、槽数、适用场景等 B2B 决策信息。
- 页脚只有版权与三个链接，没有导航、服务、联系方式等 SEO/可用性内容。

---

## 3. 设计方向

### 3.1 核心概念：Precision Industrial（精密工业）

关键词：

> **Stainless · Precise · Durable · Food-safe · Custom**

视觉上不是“黑底大字 + 发光”，也不是“电商模板”，而是：

- **大面积留白 + 深色工业文本**
- **白钢质感的冷灰渐变**
- **深青绿色作为品牌主色**（延续现有品牌色）
- **铜色 / 琥珀色作为唯一暖色强调**（呼应烘焙与涂层）
- **细线网格、编号、技术标签**作为工业细节
- **真实工厂与产品照片**作为主要视觉资产
- 克制的圆角与阴影，强调“精密”而不是“可爱”

### 3.2 视觉关键词

| 维度 | 方向 |
|---|---|
| 气质 | 精密、可靠、干净、专业、国际 B2B |
| 布局 | 12 栏网格、左对齐标题、宽留白、非对称双栏 |
| 图片 | 真实工厂 / 产品细节 / 工艺过程，避免 generic stock photo |
| 装饰 | 1px 网格线、编号 `01–04`、尺寸标注线、材质标签 |
| 动效 | 淡入上移、图片轻微 zoom、数字计数；不超过 500ms |
| 禁止 | 重阴影、彩虹渐变、过多胶囊按钮、全屏暗色遮罩、闪烁轮播 |

### 3.3 情绪板关键词（给设计师/自己找参考）

- Industrial design system
- Stainless steel product catalog
- B2B manufacturing website
- Swiss grid editorial layout
- Dark teal + copper accent
- Technical blueprint details

---

## 4. 设计系统（Design Tokens）

所有 token 放在 `src/styles/tokens.css`，通过 CSS 变量使用。

### 4.1 颜色

```css
:root {
  /* Ink / 深色工业色 */
  --ink-950: #071014;
  --ink-900: #0b1a1e;
  --ink-800: #12333a;
  --ink-700: #1b4650;

  /* Brand / 品牌深青 */
  --brand-700: #0e4a52;
  --brand-600: #11606a;
  --brand-500: #177a80;
  --brand-100: #dff0f1;

  /* Accent / 铜色暖强调 */
  --accent-600: #a95f28;
  --accent-500: #c97b3d;
  --accent-100: #f6e7da;

  /* Surface / 背景 */
  --surface-0: #ffffff;
  --surface-1: #f4f6f7;
  --surface-2: #e9edef;
  --surface-3: #dde3e6;

  /* Text */
  --text-strong: #0f1f24;
  --text: #25373d;
  --text-muted: #5b6b72;
  --text-inverse: #f7fafb;
  --text-inverse-muted: #a9b8be;

  /* Border */
  --border: #dde3e6;
  --border-strong: #c3ced3;

  /* Semantic */
  --success: #1f7a4d;
  --warning: #b26a00;
  --danger: #b42318;

  /* Steel gradient / 白钢质感 */
  --steel-gradient: linear-gradient(
    135deg,
    #f8fafb 0%,
    #dce3e7 32%,
    #ffffff 52%,
    #c9d2d7 100%
  );
}
```

#### 使用规则

- 页面背景：`--surface-0` / `--surface-1` 交替。
- 正文：`--text`；标题：`--text-strong`；次要说明：`--text-muted`。
- 主按钮：`--brand-700` 背景 + 白字。
- 强调 / 装饰：`--accent-500`；不默认搭配白色小字。文字按钮使用已验证对比度的深青色。
- 深色区块：`--ink-900`，文字用 `--text-inverse`。
- 不使用纯黑 `#000` 与纯灰 `#ccc`。

### 4.2 字体

```css
:root {
  --font-display: "Space Grotesk", "Noto Sans SC", system-ui, sans-serif;
  --font-body: "Inter", "Noto Sans SC", system-ui, sans-serif;
}
```

| 用途 | 字号 | 字重 | 行高 | 字距 |
|---|---|---|---|---|
| Display / Hero H1 | `clamp(2.75rem, 6vw, 5rem)` | 600 | 1.02 | `-0.04em` |
| Page H1 | `clamp(2.25rem, 4.5vw, 3.5rem)` | 600 | 1.05 | `-0.03em` |
| Section H2 | `clamp(1.75rem, 3vw, 2.5rem)` | 600 | 1.15 | `-0.02em` |
| Card H3 | `1.25rem–1.5rem` | 600 | 1.25 | `-0.01em` |
| Body | `1rem` | 400 | 1.7 | `0` |
| Small | `0.875rem` | 400 | 1.6 | `0` |
| Eyebrow / Label | `0.75rem` | 600 | 1.2 | `0.14em` 大写 |

中文使用 `Noto Sans SC`，英文展示字体使用 `Space Grotesk`。建议只加载必要字重（400/500/600），并使用 `display=swap`。

### 4.3 间距

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 120px;
  --space-11: 160px;
}
```

#### Section 节奏

| 断点 | 上下 padding |
|---|---|
| Desktop ≥ 1024px | `96px` |
| Tablet 768–1023px | `72px` |
| Mobile < 768px | `48px` |

### 4.4 容器与网格

```css
:root {
  --container-max: 1200px;
  --container-wide: 1360px;
  --container-narrow: 760px;
  --gutter: 24px;
}
```

- 12 栏网格，`gap: 24px`。
- 页面左右安全边距：Desktop `32px`，Tablet `24px`，Mobile `20px`。
- 不再用 `.container` 同时承担 padding 与 max-width；改为 `.container` + `.section`。

### 4.5 圆角、边框、阴影

```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  --shadow-sm: 0 1px 2px rgba(7, 16, 20, 0.06);
  --shadow-md: 0 8px 30px rgba(7, 16, 20, 0.08);
  --shadow-lg: 0 24px 60px rgba(7, 16, 20, 0.12);
}
```

- 卡片默认 `1px solid var(--border)` + `--shadow-sm`，hover 才升到 `--shadow-md`。
- 图片统一 `--radius-md` 或 `--radius-lg`。
- 避免所有元素都做成胶囊；胶囊只用于 tag / filter chip。

### 4.6 动效

```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 500ms;
}
```

- Hover：`transform: translateY(-4px)` + 阴影提升。
- 图片 hover：`scale(1.04)`，外层 `overflow: hidden`。
- 滚动 reveal：`opacity 0 → 1` + `translateY(16px → 0)`，最多 500ms；正文默认可见，增强失败不能隐藏内容。
- 必须支持 `prefers-reduced-motion: reduce`，关闭位移与无限动画。

### 4.7 焦点与可访问性

```css
:focus-visible {
  outline: 2px solid var(--accent-500);
  outline-offset: 3px;
}
```

- 所有可点击元素必须是 `<button>` 或 `<a>`，不要用 `div onClick`。
- 移动菜单：`aria-expanded`、`aria-controls`、Esc 关闭、焦点锁。
- 表单：`label` 与 input 关联，错误信息用 `aria-live="polite"`。
- 图片：有信息量的图必须有 `alt`，纯装饰图才用 `alt=""`。
- iframe 必须有 `title`。

---

## 5. 信息架构

### 5.1 顶部导航

```
Logo
Home
About
Services
Products
[Get a Quote]  ← 主 CTA
```

- 桌面：Logo 左，导航居中偏右，CTA 最右。
- 移动：Logo 左，汉堡按钮右；点击后全屏抽屉。
- 导航滚动行为：
  - 全站默认浅色背景 + 深色字，匹配左文右图的浅色 Hero。
  - 滚动超过 24px：增加轻微阴影或底部细边框；不切换成白字。
- 当前路由高亮：细下划线或小圆点，不使用 `<hr>`。
- `Get a Quote` 在所有页面都可用：
  - 首页：平滑滚动到 `#contact`。
  - 子页面：跳转 `/#contact`。
- 建议把 `Contact` 区块统一做成 `ContactSection`，id 固定为 `contact`。

### 5.2 页面结构

```
/                 Home
/aboutUs          About
/Services         Services
/Products         Products
```

建议保留现有 URL，避免影响 SEO 与已发布的链接（`/aboutUs`、`/Services` 大小写也先保留，后续可加 redirect）。

### 5.3 全站内容层级

每个页面统一使用：

1. `PageHero`：eyebrow + H1 + 描述 + 面包屑（子页面）。
2. `Section`：eyebrow + H2 + 描述 + 内容。
3. `CTASection`：深色行动区。
4. `ContactSection`：联系方式 + 表单。
5. `Footer`：多栏页脚。

---

## 6. 页面改造方案

### 6.1 首页 `/`

#### 目标

- 3 秒内让访客知道：KMC 做白钢烤盘定制 + 烤盘涂层翻新。
- 首屏建立“30+ 年、工厂直供、可定制、食品级涂层”的信任。
- 引导到 Services / Products / Quote。

#### 版块顺序

```
1. Navbar
2. Hero（左文右图）
3. Capability strip（能力标签，不重复客户 Logo）
4. Services（3 张服务卡）
5. About（2 栏 + 4 个价值点）
6. Process（4 步流程）
7. Gallery（Bento 图片墙）
8. Clients（Logo 网格）
9. CTA Band（深色）
10. Contact
11. Footer
```

#### Hero 线框

```
┌──────────────────────────────────────────────────────────────┐
│ Navbar                                                       │
├──────────────────────────────────────────────────────────────┤
│  [30+ YEARS · STAINLESS STEEL & COATING]                     │
│                                                              │
│  Baking trays built          ┌────────────────────────────┐  │
│  precise. Coatings           │                            │  │
│  built to last.              │      工厂 / 产品大图        │  │
│                              │                            │  │
│  Custom stainless steel      │  ┌──────────────────────┐  │  │
│  trays and PTFE coating      │  │ PTFE Non-stick       │  │  │
│  for bakeries & food         │  │ 双层水性涂层          │  │  │
│  manufacturers.              │  └──────────────────────┘  │  │
│                              └────────────────────────────┘  │
│  [Request a Quote] [Explore Services]                        │
│                                                              │
│  30+ Years      Custom Sizes      PTFE Coating               │
└──────────────────────────────────────────────────────────────┘
```

#### 文案建议（可继续调整）

- Eyebrow：`STAINLESS STEEL FABRICATION & COATING · 30+ YEARS`
- H1：`Baking trays built precise. Coatings built to last.`
- 副文案：`Custom stainless steel trays, bun pans and PTFE coating services for bakeries, food factories and distributors.`
- 主 CTA：`Request a Quote`
- 次 CTA：`Explore Services`
- 三个信任点：`30+ Years Experience` / `Custom Dimensions` / `PTFE Non-stick Coating`

> 注意：不要编造“500+ clients”“99% satisfaction”等未经确认的数字。所有数据必须由客户确认。

#### Services 卡片

每张卡包含：

- 编号 `01 / 02 / 03`
- 图标（线性 SVG）
- 标题
- 1–2 句说明
- 2–3 个能力点
- `Learn more →`

服务分类建议：

1. **Coating & Refurbishment**
   - Old tray refurbishment
   - Water-based double-layer coating
   - PTFE non-stick finish
2. **Custom Fabrication**
   - Stainless steel & aluminum
   - Custom sizes and shapes
   - Patterns and grooves
3. **Maintenance & Repair**
   - Tray repair
   - Equipment servicing
   - Long-term support

#### About / Why KMC

- 左侧：1 张大图 + 1 张小图 + `30+ YEARS` 浮动徽章。
- 右侧：eyebrow、标题、2 段短文案、2×2 价值点：
  - Precision Engineering
  - Food-safe Materials
  - Durable Coating
  - Custom-made
- CTA：`More about us →`

#### Process

```
01 Consult & Measure → 02 Fabricate → 03 Coat & Cure → 04 Deliver & Support
```

- 横向 4 栏，之间有 1px 连接线。
- 每步：编号、标题、1 句说明。
- 移动端改为纵向时间线。

#### Gallery

- Bento 布局（1 大 + 3 小，或 2×2 不等高）。
- 图片 hover：轻微 zoom + 底部渐变 + 短 caption。
- 可选：点击打开 Lightbox（Phase 5）。

#### Clients

- 使用仓库已有客户 Logo，集中展示一次；采用静态网格，不做 marquee。现有展示不代表已核实授权，不新增客户或背书。
- 默认灰度，hover 恢复品牌色。
- 不使用左右箭头 PNG；移动端改为横向滚动 + scroll snap。

#### CTA Band

深色 `--ink-900` 背景 + 细网格 + 铜色小标签：

```
Have a custom tray in mind?
Tell us your dimensions, material and coating requirements.
[Request a Quote]  [WhatsApp us]
```

### 6.2 关于页 `/aboutUs`

#### 版块顺序

```
1. PageHero（面包屑 + 标题 + 描述 + 工厂图）
2. Story（2 栏：图片 + 文案）
3. Capability / Stats band
4. Values（3 张卡）
5. Timeline（可选，需客户提供真实年份）
6. Factory Gallery（Bento）
7. CTA Band
8. Contact
9. Footer
```

#### PageHero

- 使用内容驱动高度与统一上下留白，不固定高度截断文字。
- 浅色底、左文右图；图片不足时使用纯文字版本，统一到 PageHero。
- 面包屑：`Home / About us`。
- H1：`About KMC 63 Trading`
- 描述：`A Malaysian stainless steel fabricator serving bakeries and food manufacturers for over 30 years.`

#### Story

- 左图右文或左文右图，与首页 About 形成差异。
- 文案拆成 3 段，不再是两大段。
- 加一个引用块：`Precision in every bend. Durability in every coating.`（可选）

#### Capability band

用 4 个能力指标，而不是虚构业绩：

- `30+ Years` Experience
- `Custom` Dimensions
- `PTFE` Coating
- `B2B` Supply

#### Values

3 张卡：

1. **Precision** — 尺寸、角度、槽位按图生产。
2. **Durability** — 食品级涂层与耐高温材料。
3. **Partnership** — 从打样到量产的支持。

#### Timeline

只有在客户提供真实年份后才做：
`1990s 成立 → 2000s 扩展涂层线 → Today 服务海外客户`

如果年份不确定，用“Milestones”+ 描述，不写具体年份。

### 6.3 服务页 `/Services`

这是本次改版的重点页面。目标是把“涂层”和“定制”讲清楚，并让用户能快速询价。

#### 版块顺序

```
1. PageHero
2. Sticky service nav（Coating / Custom / Maintenance）
3. Coating & Refurbishment
   - 介绍
   - Before / After 对比滑块
   - 4 个涂层优势
   - 4 步工艺
   - 适用基材 / 规格表
   - 图片画廊
4. Custom Fabrication
   - 介绍
   - 材料与能力 chips
   - 4 个定制能力
   - 图片画廊
5. Maintenance & Repair
6. FAQ
7. CTA Band
8. Contact
9. Footer
```

#### 双语内容处理（已确定）

现状是中文整段 + 英文整段顺序排列，阅读负担大。

**已确定采用：EN / 中文 Tab**

```
[EN] [中文]
```

- 默认显示 **EN**，点击“中文”切换同一区块内容。
- 所有文案保留，不丢失信息。
- 保持当前页面滚动位置，只替换内容，不跳页。
- 不做 URL 变化，不做多语言路由。
- 实现：`LanguageTabs` 组件 + `servicesContent.en` / `servicesContent.zh` 两份内容对象。
- Tab 需符合可访问性：`role="tablist"`、`role="tab"`、`aria-selected`、方向键切换。
- 默认语言不持久化也可以；后续如需记住用户选择，再加 `localStorage`。

**不采用**“英文为主 + 中文折叠”方案，也不继续把中英文两套完整列表上下堆叠。

#### Before / After 对比滑块

- 使用两张同角度图片：`Old Baking Tray` / `After Coating`。
- 中间可拖动分割线，支持键盘（`input[type=range]`）。
- 标签：`BEFORE` / `AFTER`。
- 移动端保持 4:3 比例。

#### 涂层优势

- High corrosion resistance
- Heat resistance
- Excellent non-stick
- Waterproofing

用 2×2 图标卡，不要用普通 `<li>`。

#### 工艺步骤

```
01 Strip & Clean → 02 Pre-treatment → 03 Spray Coat → 04 Cure & Inspect
```

#### 定制能力

- Custom sizes
- Shapes & patterns
- Stainless steel / aluminum alloy
- Groove counts & tray profiles

#### FAQ（建议新增）

- What tray sizes can you customize?
- What is the minimum order quantity?
- How long does coating take?
- Can you match an existing tray sample?
- Do you deliver outside Selangor?

> 答案需客户确认后再写，避免承诺无法兑现的交期与 MOQ。

### 6.4 产品页 `/Products`

#### 目标

- 让经销商/工厂快速按分类找到产品。
- 每张产品卡提供足够信息发起询价。

#### 版块顺序

```
1. PageHero
2. Filter bar（分类 chips + 数量 + 搜索）
3. Product grid
4. Empty state
5. CTA Band
6. Contact
7. Footer
```

#### Filter Bar

- Chips：`All` / `Bun Tray` / `Steamer` / `Trolley`
- 每个 chip 显示数量，例如 `Bun Tray (6)`。
- 可选搜索框：按型号或描述过滤。
- 移动端横向滚动，不换行。

#### 产品卡

```
┌──────────────────────────┐
│  [Bun Tray]       JS20108│
│                          │
│      产品图（4:3）        │
│                          │
├──────────────────────────┤
│ Aluminized Steel Hot Dog │
│ Bun Tray (15 Grooves)    │
│                          │
│ [Request quote →]        │
└──────────────────────────┘
```

- 图片区域使用 `--surface-1` 或白钢渐变背景。
- 型号作为 overline，描述作为标题。
- **本期 v1：点击卡片打开轻量详情 Modal**（先做简单版本，验证效果后再增强）。
- 产品数据抽到 `src/data/products.js`，不要把数据放在组件函数里。

#### 产品详情 Modal（v1 范围）

目标：先做一个简单、够用的版本，确认交互观感后再决定是否增强。

**v1 包含：**

- 点击产品卡打开 Modal。
- 显示：产品图、分类、型号、描述。
- 有数据时显示：材质、尺寸、槽数、涂层选项、适用场景；缺字段自动隐藏，不显示空行。
- 主 CTA：`Request a quote` → 关闭 Modal 并滚动到 Contact。
- 次 CTA：`WhatsApp us` → 打开 WhatsApp，附带产品型号。
- 关闭方式：右上角 X、点击遮罩、Esc。
- 可访问性：`role="dialog"`、`aria-modal="true"`、焦点锁、关闭后焦点返回原卡片。

**v1 不做：**

- 多图轮播
- 3D / 缩放查看
- 在线下单
- PDF 下载（等有 datasheet 再加）

> 所有产品保持一致的详情入口；数据少时使用紧凑 Modal，只显示已有字段，不因缺规格而随机隐藏入口。

#### 修复筛选 bug

当前实现：

```js
const [item, setItems] = useState(Data());
const menuItems = [...new Set(item.map(v => v.category))];
```

筛选后 `item` 变小，分类就消失了。

改为：

```js
const allProducts = useMemo(() => getProducts(), []);
const [activeCategory, setActiveCategory] = useState("All");
const visibleProducts = useMemo(
  () => activeCategory === "All"
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory),
  [allProducts, activeCategory]
);
```

#### 产品内容补全（需客户提供）

每个产品建议补齐：

- Model / Code
- Category
- Material
- Dimensions (L × W × H)
- Groove count / capacity
- Coating options
- Use case
- Image (consistent angle, white/steel background)

### 6.5 共用组件

#### Navbar

- 浅色底深色字；滚动后增加边框或轻阴影。
- 路由 active 状态。
- 移动端全屏抽屉 + 背景遮罩。
- `Get a Quote` CTA。
- 修复跨页面 Contact 跳转。

#### Footer

多栏结构：

```
Logo + 一句话简介
Explore: Home / About / Services / Products
Services: Coating / Custom Fabrication / Maintenance
Contact: 地址 / 电话 / Email / WhatsApp
Bottom: 版权 + 已有注册号；Terms / Privacy 仅在已有真实页面时显示
```

深色 `--ink-900` 背景，文字 `--text-inverse`。

#### PageHero

统一子页面头部：

- 面包屑
- eyebrow
- H1
- 描述
- 可选背景图 / 右侧图片
- 统一高度与渐变

#### SectionHeading

- `eyebrow`、`title`、`description`、可选 `action`（右侧链接）。
- 默认左对齐；首页部分区块可居中。

#### Button

- `primary`：深青底白字。
- `secondary`：白底深色边框。
- `ghost`：纯文字 + 箭头。
- `inverse`：深色背景上的白底按钮。
- 统一高度 `48px`（sm 40px / lg 56px）。
- 不使用 emoji 或 PNG 箭头；使用 SVG 或 CSS 箭头。

#### ContactSection

- id 固定 `contact`。
- 左侧：联系方式 + 地图。
- 右侧：表单。
- 表单增加：
  - Subject / Service interest（下拉：Coating / Custom / Product / Other）
  - 提交状态：idle / sending / success / error
  - 错误信息 `aria-live`
  - 防 spam honeypot 字段
- Web3Forms access key 移到 `.env`：
  `REACT_APP_WEB3FORMS_KEY=...`
  并在 Web3Forms 后台配置允许域名。

---

## 7. 技术实现方案

### 7.1 总体策略

**保留 CRA + React Router + 原生 CSS，不引入 Tailwind，不迁移框架。**

理由：

- 项目规模小，原生 CSS + token 足够。
- 避免 CRA 配置 Tailwind 的额外风险。
- 现有类名可渐进替换，不需要一次性重写全部。
- 你可以在本地 `npm start` 直接看到效果。

### 7.2 推荐目录结构

> 第一阶段先不动现有文件，新增文件；第二阶段再逐步迁移，避免大爆炸式重构。

```text
src/
  styles/
    tokens.css          # 设计变量
    base.css            # reset、字体、基础排版、焦点
    utilities.css       # 少量工具类（sr-only、stack、cluster）
  Components/
    layout/
      Navbar/
      Footer/
      Container/
      Section/
      PageHero/
    ui/
      Button/
      SectionHeading/
      Badge/
      Card/
      Reveal/
      Accordion/
      LanguageTabs/
      BeforeAfterSlider/
      Lightbox/
    sections/
      Hero/
      ServicesGrid/
      AboutSection/
      ProcessSection/
      Gallery/
      Clients/
      CTASection/
      ContactSection/
    Product/
      ProductGrid/
      ProductCard/
      ProductFilterBar/
      ProductModal/
  data/
    products.js
    services.js
    clients.js
    site.js             # 公司信息、电话、地址、社交链接
  hooks/
    useScrolled.js
    useReveal.js
    useLockBodyScroll.js
    useDocumentMeta.js
  pages/
    HomePage.jsx
    AboutPage.jsx
    ServicesPage.jsx
    ProductsPage.jsx
  App.jsx
  index.js
  index.css             # 只 import tokens + base
```

### 7.3 CSS 架构

- `src/index.css` 只保留：

```css
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/utilities.css";
```

- 组件样式与组件同目录，例如 `Navbar/Navbar.css`。
- 命名采用 BEM-ish：
  - `.navbar`
  - `.navbar__link`
  - `.navbar__link--active`
  - `.service-card__media`
- 禁止在组件 CSS 中写全局 `*`、`body`、`h1`、`.row`、`.card`。
- 删除 `ProductFilter.css` 中的全局 reset 与旧注释代码。
- 所有颜色、间距、圆角、阴影优先使用 token。

### 7.4 图标

已确定：**新增 `lucide-react`，按名称导入需要的图标**。

- 线性图标统一 `stroke-width: 1.5`，尺寸 20/24。
- 替换现有 PNG 图标：
  - `menuIcon.png` → `Menu` / `X`
  - `darkarrow.png` / `whiteArrow.png` → `ArrowRight`
  - `mail.png` / `email.png` / `telephone-call.png` / `location.png` → 对应线性图标
  - `serviceIcon*.png` → `SprayCan` / `PanelsTopLeft` / `Wrench`
- Footer 品牌图标继续用已安装的 `@fortawesome/free-brands-svg-icons`。
- 品牌 Logo 不用普通线性图标替代；装饰图标 aria-hidden，纯图标按钮有可访问名称。

### 7.5 图片策略

当前 `src/Assets` 约 19MB，首屏 `backgPic.jpg` 1.25MB、`factoryproducPic.jpg` 2.4MB，过大。

建议：

1. 保留原始文件作为备份。
2. 生成 WebP/AVIF 版本：
   - Hero: ≤ 250KB
   - Page header: ≤ 200KB
   - Card: ≤ 120KB
   - Gallery: ≤ 150KB
3. 使用固定宽高比容器，避免 CLS：

```css
.media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-lg);
}
.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

4. 首屏图：`fetchPriority="high"`；其余：`loading="lazy"` + `decoding="async"`。
5. 注意文件名大小写：Windows 不敏感，但 GitHub Pages/Linux 区分大小写。统一使用现有 `Assets` 路径，避免部署后 404。

### 7.6 动画

- 优先 CSS transition。
- 滚动 reveal 用 `IntersectionObserver` 封装 `<Reveal>`：

```jsx
<Reveal delay={100}>
  <SectionHeading ... />
</Reveal>
```

- 不引入 framer-motion，除非后续需要复杂手势。
- 客户 Logo 使用静态网格，不引入循环动画。
- Before/After 滑块用 range input，保证键盘可操作。

### 7.7 SEO 与元信息

- 新增 `useDocumentMeta(title, description)` hook，路由切换时更新：
  - `document.title`
  - `meta[name="description"]`
- 每个页面唯一 `<h1>`。
- 图片 alt 描述具体内容，例如：
  `Stainless steel bun tray with 15 grooves after PTFE coating`
- 在 `public/index.html` 增加 `LocalBusiness` JSON-LD（地址、电话、营业范围）。
- 更新 OG image 为品牌图，而不是 favicon。
- 最终部署使用 Vercel；为 BrowserRouter 配置 SPA rewrite，并保留静态资源正常解析；不采用 GitHub Pages 的 404.html 复制方案。
- 最后部署阶段再处理 homepage、CNAME 与 gh-pages 脚本。构建资源使用根路径，保证 vercel.app 预览不依赖生产域名。
- 增加应用级 NotFound 页面；未知地址不能显示空白。客户端 meta 有利于页面信息，但不能保证社交爬虫执行 JS；本期使用统一静态 OG 信息。

### 7.8 表单

- 保留 Web3Forms。
- Access key 放 `.env`：

```env
REACT_APP_WEB3FORMS_KEY=<existing-public-access-key>
```

- CRA 只暴露 `REACT_APP_` 前缀变量。
- 环境变量用于配置管理；CRA 构建后该 key 仍可被浏览器读取，不是保密措施。核对当前 Web3Forms 账户支持的防滥用功能，再配置域名限制；配合 honeypot。
- 增加 honeypot 字段：

```jsx
<input type="text" name="botcheck" tabIndex={-1} autoComplete="off" hidden />
```

- 提交状态用 `aria-live="polite"` 播报。
- 提交成功后显示明确的成功卡片，而不是一行 `span`。

### 7.9 组件复用与旧文件处理

| 旧文件 | 处理方式 |
|---|---|
| `Components/Home/Home.jsx` | 改为组合新 sections |
| `Components/Hero/Hero.jsx` | 重写为 `sections/Hero` |
| `Components/Services/Services.jsx` | 重写为 `ServicesGrid` |
| `Components/About/About.jsx` | 重写为 `AboutSection` |
| `Components/CompanyPhoto` | 重写为 `Gallery`（Bento） |
| `Components/ClientReview` | 重写为 `Clients`（logo 网格/marquee） |
| `Components/Contact` | 重写为 `ContactSection` |
| `Components/Footer` | 重写为多栏 Footer |
| `Components/Title` | 由 `SectionHeading` 取代 |
| `Components/AboutPage/*` | 复用 `PageHero` + 新 sections |
| `Components/ServicePage/*` | 重写为 Services 页面 |
| `Components/Product/*` | 重写为产品页 + 修复筛选 |
| `ProductFilter.css` 全局 reset | 删除 |

> 迁移期间可以保留旧文件，等新页面验证通过后再删除，降低风险。

---

## 8. 响应式设计

### 8.1 断点

```css
/* Mobile first */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### 8.2 各页面行为

| 区块 | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navbar | 汉堡 + 全屏抽屉 | 汉堡 / 简化导航 | 完整导航 |
| Hero | 单栏，图在下 | 单栏 | 左文右图 |
| Services | 1 列 | 2 列 | 3 列 |
| About | 单栏，图在上 | 单栏 | 2 栏 |
| Process | 纵向时间线 | 2×2 | 4 列 |
| Gallery | 1–2 列 | 2 列 | Bento 4 图 |
| Clients | 横向滚动 | 2×2 | 4 列 |
| Products | 1 列 | 2 列 | 3 列 |
| Contact | 单栏 | 单栏 | 2 栏 |
| Footer | 单栏手风琴 / 堆叠 | 2 列 | 4 列 |

### 8.3 必须测试的宽度

`320 / 375 / 390 / 768 / 1024 / 1280 / 1440 / 1920`

检查：

- 无横向滚动。
- 标题不溢出。
- 按钮不换行错位。
- 图片不变形。
- 移动菜单可滚动。

---

## 9. 可访问性清单

- [ ] 每页有跳过导航链接（Skip to content）。
- [ ] 所有交互元素可键盘访问。
- [ ] 焦点样式可见。
- [ ] 移动菜单 Esc 关闭，焦点返回汉堡按钮。
- [ ] 图片 alt 有意义。
- [ ] 表单 label 关联 input。
- [ ] 表单错误用 `aria-live`。
- [ ] iframe 有 title。
- [ ] 颜色对比度 ≥ WCAG AA。
- [ ] 支持 `prefers-reduced-motion`。
- [ ] 标题层级不跳级（h1 → h2 → h3）。
- [ ] 链接文字有描述性，避免大量 “click here”。

---

## 10. 性能清单

- [ ] 首屏图片 ≤ 250KB，并预加载。
- [ ] 非首屏图片 lazy load。
- [ ] 所有图片容器有 `aspect-ratio`。
- [ ] 字体只加载必要字重 + `display=swap`。
- [ ] 删除未使用依赖与旧 CSS。
- [ ] 产品页按需渲染（数据量小可忽略）。
- [ ] Lighthouse Mobile：Performance ≥ 85，Accessibility ≥ 90，Best Practices ≥ 90，SEO ≥ 90。
- [ ] 无 console error / warning。

---

## 11. 分阶段实施计划

### Phase 0 — 准备（0.5 天）

- [ ] 新建分支：`git checkout -b codex/redesign-v1`
- [ ] 本地跑通项目（见 `docs/LOCAL_DEV_GUIDE.md`）
- [ ] 截图保存当前四个页面作为 before
- [ ] 盘点已有文案、产品和图片，记录待核实项；缺失内容按第 15.2 节降级，不等待新素材

### Phase 1 — 设计基础 + 导航/页脚（1 天）

- [ ] `styles/tokens.css`、`base.css`、`utilities.css`
- [ ] 字体引入（Space Grotesk + Inter + Noto Sans SC）
- [ ] `Container`、`Section`、`Button`、`SectionHeading`、`Reveal`
- [ ] 新 `Navbar`（滚动状态、active、移动抽屉）
- [ ] 新 `Footer`（多栏）
- [ ] 删除全局 CSS 污染

**验收**：全站字体、颜色、按钮、导航、页脚统一，移动菜单可用。

### Phase 2 — 首页（1.5–2 天）

- [ ] Hero
- [ ] Capability strip（仅能力标签）
- [ ] ServicesGrid
- [ ] AboutSection
- [ ] ProcessSection
- [ ] Gallery（Bento）
- [ ] Clients
- [ ] CTASection
- [ ] ContactSection

**验收**：首页在 320–1920px 正常，首屏信息清晰，CTA 可用。

### Phase 3 — 子页面框架 + About（1 天）

- [ ] `PageHero`
- [ ] About 页 Story / Capability / Values / Gallery
- [ ] 统一 CTA + Contact + Footer

**验收**：About 页与首页风格一致，无重复文案堆叠。

### Phase 4 — Services（1.5–2 天）

- [ ] Sticky service nav
- [ ] Coating 区块
- [ ] 检查已有 Before/After 图片；不满足同物件可比条件时改静态工艺图
- [ ] 优势卡片 + 工艺步骤
- [ ] Custom Fabrication 区块
- [ ] 双语切换
- [ ] FAQ accordion

**验收**：涂层与定制两条业务线清晰，双语可切换；采用滑块时必须键盘可用，无配对图则验收静态工艺展示。

### Phase 5 — Products（1–1.5 天）

- [ ] 产品数据抽离
- [ ] 修复筛选逻辑
- [ ] Filter chips + 数量 + 搜索
- [ ] ProductCard / Grid
- [ ] 详情 Modal（v1 轻量版：产品图 / 型号 / 描述 / 已有规格 / Quote CTA）
- [ ] Empty state

**验收**：筛选不丢分类，移动端 1 列，产品信息完整。

### Phase 6 — 内容、图片、SEO、性能（1 天）

- [ ] 图片压缩与 WebP
- [ ] alt 文案
- [ ] 页面 title / description
- [ ] JSON-LD
- [ ] 应用级 NotFound 页面（Vercel rewrite 留到最后部署阶段）
- [ ] 删除旧 CSS/组件

### Phase 7 — QA 与上线（1 天）

- [ ] 断点测试
- [ ] 键盘测试
- [ ] 表单真实提交测试
- [ ] Lighthouse
- [ ] `npm run build` + 本地 preview
- [ ] 用户验收前端效果；随后才进入 Phase 8，不自动合并或上线

### Phase 8 — Vercel 迁移与域名（最后一步）

仅在前端效果验收后进行，详见第 17 节。此前使用本地预览，不修改现有线上站点。

**工作量参考：8–10 个工作日**，仅作范围估算；新增高清图、规格、时间线等不作为本轮实施前置条件。

---

## 12. 验收标准

### 视觉

- [ ] 全站使用统一 token，无散落硬编码颜色。
- [ ] 所有页面头部使用同一个 `PageHero`。
- [ ] 卡片阴影、圆角、间距一致。
- [ ] 没有全屏深色遮罩 Hero。
- [ ] 图标风格统一（线性 SVG）。

### 功能

- [ ] 四个路由正常。
- [ ] 导航 active 正确。
- [ ] `Get a Quote` 在所有页面可用。
- [ ] 产品筛选不丢分类，可重置。
- [ ] 联系表单提交成功/失败都有反馈。
- [ ] 移动菜单可开、可关、可 Esc 关闭。

### 响应式

- [ ] 320px 无横向滚动。
- [ ] 768px 布局合理。
- [ ] 1440px 不显得空旷。
- [ ] 移动端触控目标 ≥ 44×44px。

### 性能与质量

- [ ] Lighthouse Mobile 达标。
- [ ] 无 console error。
- [ ] 无明显布局跳动。
- [ ] `npm run build` 成功。

---

## 13. 风险与注意事项

| 风险 | 影响 | 应对 |
|---|---|---|
| CRA 与运行时兼容性 | 本地与部署构建不一致 | 最后部署前选择 Vercel 当时支持的 Node 版本，在本地验证并锁定；不盲目沿用旧运行指南 |
| 图片资产 19MB | 首屏慢、Lighthouse 低 | 压缩 + WebP + lazy load |
| BrowserRouter + Vercel | 直接访问或刷新子路由失败 | 最终部署配置 SPA rewrite 并实测四条路由 |
| 现有 URL 大小写 | 外部链接失效 | 保留 `/aboutUs`、`/Services`、`/Products` |
| 文案含中英双语 | 页面过长 | **EN / 中文 Tab** |
| 产品数据/规格缺失 | 产品页信息不足 | 先用已有信息，缺字段隐藏；不编造规格 |
| Web3Forms 公开 key 被滥用 | 垃圾提交 | honeypot + 账户支持的域名限制；环境变量仅管理配置 |
| 真实年份/客户 Logo | 不能编造 | 所有数据客户确认 |
| CSS 全局污染 | 改 A 坏 B | 先清理全局 reset，再组件化 |
| 文件名大小写 | Linux 部署 404 | 统一 `Assets` 大小写 |

---

## 14. Do & Don't

### Do

- 用真实工厂、产品、工艺照片。
- 用大标题 + 短句 + 充足留白。
- 用编号、标签、细线体现工业精密感。
- 每个 section 只讲一个重点。
- 每个页面都有明确 CTA。
- 移动端优先验证。

### Don't

- 不要用全屏深色照片 + 白字作为每个页面头部。
- 不要用 `box-shadow: 0 4px 6px rgba(0,0,0,.5)` 这种重阴影。
- 不要把所有按钮做成胶囊。
- 不要把中英文两大段直接上下堆叠。
- 不要编造客户数量、评价、认证。
- 不要在组件 CSS 里写全局 `*` / `body` / `.row`。
- 不要用 `div onClick` 当按钮。

---

## 15. 已确认的设计决策

> 确认日期：2026-10-26

### 15.1 已确认

| # | 决策项 | 结论 | 对实施的影响 |
|---|---|---|---|
| 1 | 主色 | **深青绿（现有品牌色）+ 铜色强调** | 使用第 4.1 节 token；主按钮深青，强调与 hover 用铜色 |
| 2 | 字体 | **Space Grotesk（英文标题）+ Inter（正文）+ Noto Sans SC（中文）** | 第 4.2 节生效；加载 400/500/600 字重，`display=swap` |
| 3 | 服务页双语 | **EN / 中文 Tab** | 新增 `LanguageTabs`；默认 EN；不做多语言路由 |
| 4 | 产品页详情 | **做轻量 v1 Modal，先看效果** | Phase 5 实现；只做产品图 / 型号 / 描述 / 已有规格 / Quote CTA |

### 15.2 本轮约束与已决定的处理方式

| 项目 | 最终方案 |
|---|---|
| 真实数据 | 先沿用现有站点信息；30+ 年已存在于 About 文案，可保留，不推算成立年份、不新增业绩数字。MOQ、交期、温度、认证等无依据时不展示 |
| 图片 | 只用现有 Assets，先调整裁切、比例、留白与压缩；后续可替换高清图，不以新图片阻塞前端 |
| 图标 | 允许新增 lucide-react |
| 产品规格 | 用现有型号、分类、描述与图片；原描述已有材质、槽数可保留，未知字段隐藏；不显示待补充占位行 |
| FAQ | 不编写 MOQ、交期或配送承诺；本轮隐藏缺乏答案的 FAQ，CTA 引导联系咨询 |
| 客户 Logo | 仅沿用当前站点已有素材，不增加未经提供的客户；发布前检查现有展示的使用依据，无法确认则隐藏此区块 |
| Before/After | 文件名不视为配对证据；核对画面后才决定，非同一物件/可比角度时使用独立说明的静态工艺图 |
| Timeline | 本轮不做；不使用示例年代或无依据里程碑 |
| 部署 | 最后从 GitHub Pages 迁移至 Vercel，再在 Vercel 添加自定义域名；代码仓库可以继续放 GitHub |
| 执行边界 | 用户已确认方案并授权改代码和启动本地预览；Vercel 与域名迁移仍留到前端效果验收后 |

### 15.3 确认后的实施顺序

1. 基础 token、样式作用域、导航与页脚，并完成首页第一版。
2. 本地展示桌面与移动端首页，让用户先判断整体视觉；调整后再推广到子页面。
3. 完成 About、Services、Products 与统一询价流程。
4. 完成响应式、键盘交互、表单和构建验收。
5. 前端效果通过后执行最后的 Vercel 与域名迁移。

更新：用户已确认并授权上述前端代码实施及本地启动；当前进入第一版视觉验收。

---

## 16. 附：推荐的首屏文案（可直接用）

**Eyebrow**
`STAINLESS STEEL FABRICATION & COATING · 30+ YEARS`

**H1**
`Baking trays built precise. Coatings built to last.`

**Subcopy**
`Custom stainless steel trays, bun pans and PTFE non-stick coating services for bakeries, food factories and distributors.`

**Primary CTA**
`Request a Quote`

**Secondary CTA**
`Explore Services`

**Trust points**
`30+ Years Experience` · `Custom Dimensions` · `PTFE Non-stick Coating`

**CTA Band**
`Have a custom tray in mind?`
`Tell us your dimensions, material and coating requirements.`
`[Request a Quote] [WhatsApp us]`

---

*v1.2 方案已获用户确认，前端第一版已实施；目前仅本地预览，最后再迁移部署。*


## 17. 最后阶段：Vercel 部署与域名迁移

- **当前不执行**：不建立 Vercel 项目、不修改 DNS、不关闭 GitHub Pages，也不修改部署文件。
- GitHub 可继续作为源码仓库；最终网站由 Vercel 托管，停止使用 GitHub Pages 发布。
- 前端验收后再配置 Vercel：CRA 项目，构建命令 `npm run build`、输出目录 `build`；核对锁文件、安装方式与平台支持的 Node 版本，进行干净构建。
- 部署阶段移除或调整指向生产域名的 CRA `homepage`，使静态资源从根路径读取；核查 `PUBLIC_URL`，保证预览域名可用。
- 新增 Vercel SPA rewrite，确保 `/aboutUs`、`/Services`、`/Products` 直接访问和刷新正常；未知路径交给应用 NotFound。核查图片、JS、CSS 与缺失资源响应，不能把失效资源当 HTML 正常加载。
- 在 Vercel 环境中配置 `REACT_APP_WEB3FORMS_KEY`，修改后重新构建。先在 vercel.app 地址验证资源、路由与表单，再连接正式域名。
- 在 Vercel 添加 `kmcbakingtray.com` 与 `www`，确定主域名并设置另一域名跳转。DNS 值以项目控制台当时提供的值为准，不在方案中硬编码 IP。
- 默认保留现有域名注册商与 DNS 服务，在当前 DNS 服务商更新 Vercel 要求的记录即可。若用户需要在 Vercel 管理整套 DNS，则最后迁移 nameservers，并先完整保留 MX、TXT 等邮件/验证记录；不要求转移域名注册商。
- HTTPS、主域跳转、四条路由、资源和表单通过后，再关闭 GitHub Pages，清理 gh-pages 发布脚本/依赖与 CNAME；切换前保存旧 DNS 和发布版本供回退。
- 当前 GitHub Pages 404.html 复制思路不作为新方案的一部分。

参考官方资料（实施时再次核对）：[CRA 部署](https://vercel.com/docs/frameworks/frontend/create-react-app)、[Rewrites](https://vercel.com/docs/routing/rewrites)、[自定义域名](https://vercel.com/docs/domains/set-up-custom-domain)、[Vercel DNS 管理](https://vercel.com/kb/guide/how-to-manage-vercel-dns-records)。

## 18. 审查后的统一实施细则

本节与第 15.2 节是 v1.2 的范围收敛规则；前文的候选模块、示例文案与目录不构成强制补齐数据的要求。

### 18.1 视觉与素材

- 保留深青 + 铜色的精密工业方向，首页采用浅色左文右图。服务突出 Coating 与 Custom 两项核心，Maintenance 使用较轻的第三项卡片，避免三项抢占相同视觉权重。
- 首页顺序：Hero → 能力条 → 两项核心服务 + 维护入口 → 简短 About → 服务流程 → 现有图库 → 单次客户展示（可隐藏）→ CTA + Contact → Footer。图库与 About 控制图片数量，不用重复照片凑版块。
- 原四步流程不强制表示每个订单均需 Fabricate + Coat；改为需求沟通 → 方案确认 → 按服务制作/翻新 → 交付跟进。
- 产品图使用 `object-fit: contain` 保留完整外形；工厂与工艺图才使用 cover。不放大低清图片充满巨幅 Hero，画质不足时缩小展示面积、采用留白与细线构图。
- 后续换图通过数据字段与固定比例容器完成，不需要重排页面。无图片时使用中性背景与分类信息，不引入虚构工厂/客户图片。
- 图片体积指标是压缩目标，不能为达标破坏产品细节；按源图尺寸生成适当候选，不将低清图伪造为高清。Hero 不 lazy load，其他图按需加载；不要同时强制 preload 多张大图。
- 中文标题单独设置行高与字距，不沿用英文 1.02 行高和负字距；320px 下使用更小的 fluid 字号。中文字体优先可靠系统回退，按需加载 Noto Sans SC，避免整套中文字库阻塞首屏。
- 铜色主要用于细节、标签与装饰。正文对比度至少 4.5:1，大字与交互边界按 AA 检查，不能仅凭 token 名称认为达标。

### 18.2 交互与内容

- 全站保留原始路由大小写；新增小写地址规范化时安排到最后部署阶段，避免文档同时承诺两套路由。
- 每页只有一个 ContactSection，`id="contact"`；页尾 CTA 紧凑处理，不连续堆叠两块大型询价区。
- 产品 Quote 关闭 Modal 后，将型号/产品说明传入该页表单；服务 Quote 可带入服务分类。跳转、表单聚焦与滚动统一处理，避免 ScrollToTop 抢占 hash 滚动；fixed 导航和服务导航使用 scroll-margin-top。
- WhatsApp 使用现有电话号码并编码询价内容；表单与 WhatsApp 使用同一份产品上下文。浮动入口如采用，必须避开移动端按钮和表单，不额外铺设多层固定栏。
- Modal 产品卡使用明确按钮入口，避免可点击卡片内部再嵌套按钮；背景不可聚焦，关闭时恢复焦点和页面滚动。
- 服务页一个 EN / 中文控件切换整套服务内容，标签关联 panel、方向键可切换；不引申为全站双语。Sticky 导航在手机可横向滚动，并确保目标标题不被遮挡。
- FAQ、Timeline、Before/After slider、Lightbox 均按素材决定；本轮默认不做 Lightbox，不为目录中已有组件名而额外开发。
- 不新增 food-safe 认证、耐温范围、保修、产能、出口覆盖等未经资料支持的承诺。已有 PTFE 与双层水性涂层描述可沿用，不扩展为认证结论。
- 产品现有 12 条记录使用稳定 id；型号不是唯一键。存在两条 JSGS01、且型号与图片文件名可能不同，先保留已有描述，不凭文件名自行改型号。尺寸字段须区分产品外形尺寸与“适配烤盘尺寸”。
- 搜索按现有型号、描述和分类匹配，能与筛选组合并一键重置；结果数量用 aria-live 提示，不依赖颜色表达选中状态。
- 表单处理网络异常、非正常响应与重复提交；失败保留输入并允许重试，成功后才清空。实现期间使用模拟响应验证，真实提交安排在最终 QA，避免向邮箱反复发送测试。

### 18.3 工程与验收

- 保留 CRA、React Router 与原生 CSS；目录为建议，按实际复用程度建组件，不为每层布局新增抽象。现有入口为 `src/App.js`，无须仅为统一扩展名改成 App.jsx。
- 首页视觉检查作为明确中间验收点；通过后才将版式推广到所有子页面。对照 390px 与 1440px 截图，再完成完整断点检查。
- 首轮新增只需 lucide-react；不额外引入动画库、轮播库或状态管理库。清理依赖前检查全仓引用。
- 本地与 Vercel 复用一套锁文件和安装方式；仓库同时存在 package-lock.json 与 yarn.lock，后续默认 npm，验证后再清理冗余锁文件。
- 字体、图片及地图加载失败仍保留文字、联系方式与正常布局；地图延迟加载。
- 单个 H1、路由 title/description、已知公司信息 JSON-LD；最终上线核对 canonical、robots、sitemap 与正式域名一致，预览部署避免被索引。结构化数据不填未知营业时间、评分或认证。
- 首屏最终目标：LCP ≤ 2.5s、CLS ≤ 0.1、INP ≤ 200ms；本地/Lighthouse 只作为实验室参考，INP 等真实用户指标需上线后观察，不将无真实流量的数据写成已达标。
- 验证重点为产品筛选组合、跨页/带型号询价、菜单与 Modal 键盘流程、表单失败重试以及部署后的直接刷新。方案审查阶段未改代码；用户后续已授权实施，当前功能与测试结果见实施记录。
