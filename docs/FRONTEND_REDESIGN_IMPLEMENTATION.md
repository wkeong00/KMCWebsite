# 前端改版第一版 · 本地验收

日期：2026-10-26。依据 FRONTEND_REDESIGN_PLAN.md v1.2，用户已确认实施。

## 本地查看

开发服务：<http://localhost:3000>，备用 <http://127.0.0.1:3000>。

四条路由保持原样：`/`、`/aboutUs`、`/Services`、`/Products`。

以后重新启动：在项目目录运行 `npm start`。Web3Forms 使用 `.env.local` 内的 `REACT_APP_WEB3FORMS_KEY`，已从现有表单迁入；该文件不提交，其他环境参考 `.env.example` 配置。

## 本次实现

- 深青/铜色 token、Space Grotesk/Inter、中文系统字体回退、响应式页面与共用按钮。
- 新首页：浅色左文右图、能力条、两项核心服务、维护入口、About、四步流程、产品入口与工厂图库。
- About：统一 PageHero、故事、能力与价值；不编造年份或时间线。
- Services：Coating/Custom/Maintenance 锚点导航、可键盘操作的 EN/中文 Tab、独立工艺示例。现有照片未视为已核实的同物件配对，不做对比滑块。
- Products：保留原 12 条记录及重复型号，数据抽到 src/data/products.js；分类、搜索、数量、重置、空结果和详情 Modal。
- 产品或服务询价自动带入表单；WhatsApp 编码附带产品信息。
- 移动菜单与 Modal：Esc、焦点锁、背景隔离、关闭后恢复焦点、滚动锁定。
- 共用 Contact：电话、邮箱、地址、可展开地图、服务选择；发送状态、网络异常/超时、保留失败输入、防重复提交和 honeypot。
- 路由 title/description、静态 OG 信息、真实公司信息 JSON-LD、应用 NotFound。
- 现有照片/产品图生成 WebP，原图保留；Hero 工厂照片约 210KB，产品图保留透明度并完整显示。
- 新增 lucide-react；package-lock.json 为本轮使用的 npm 锁文件，未清理原有 yarn.lock。

## 已验证

- `node node_modules/react-scripts/bin/react-scripts.js build`：生产构建成功。
- `node node_modules/eslint/bin/eslint.js --ext '.js,.jsx' ...`：本次新增/修改的 JS/JSX 通过，无规则错误。
- Jest 6 项通过：组合筛选和重置；Modal 键盘/焦点/询价；服务语言与询价；移动菜单；模拟表单失败/重试/重复提交；404。
- 浏览器首页检查 320/375/390/768/1024/1280/1440/1920px；三个子页面检查 320/390/768/1024/1440px。未发现横向溢出或已加载图片损坏，每页一个 H1 和 Contact。
- 浏览器实际操作核对筛选切换、Trolley + 720 搜索、详情/询价、手机语言切换、菜单 Esc 与焦点恢复。
- 截图保存到本地 artifacts/，该目录已忽略。

## 本轮边界与后续

- 这是本地视觉验收版本。高清图、完整产品规格、FAQ、客户授权与新增真实数据可在之后补充。
- 客户 Logo 因展示依据尚未核实，第一版隐藏；不展示虚构数字、认证、时间线或未提供规格。
- 表单通过模拟请求验证，未向真实邮箱发送测试消息。正式交付前再核对 Web3Forms 账户限制并进行一次真实提交。
- 尚未执行 Lighthouse 或真实用户性能测量，不把分数/INP 写成已达标。
- CRA 工具链仍有原有的 Browserslist/Babel/Node 弃用提示；未为了消除提示更换框架或调整部署工具链。
- 旧组件保留但不再由新 App 引用，旧全局 CSS 不参与当前页面；视觉验收后再集中清理。
- GitHub Pages、homepage、CNAME、发布脚本与 DNS 均未改动；Vercel 仍是最后一步。
