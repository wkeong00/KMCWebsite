# KMC 63 Trading 本地运行指南

> 目的：把这项目在自己的电脑跑起来，在浏览器看到前端，并在改代码时自动刷新。
> 项目路径示例：`C:\Users\wkeong\Desktop\Workprojects\KMC-draft`
> 技术栈：Create React App + React 18 + React Router 6

---

## 1. 先确认你已经安装了什么

打开 **PowerShell**（推荐）或 **Git Bash**，执行：

```powershell
node -v
npm -v
git --version
```

你应该看到类似：

```text
v20.x.x
10.x.x
git version 2.x.x
```

### 版本建议

| 工具 | 建议版本 | 说明 |
|---|---|---|
| Node.js | **20 LTS**（推荐） | CRA 5 在 Node 20 最稳 |
| npm | 10.x | 随 Node 20 安装 |
| Git | 任意较新版本 | 用于分支与版本管理 |

> 你当前机器是 Node `v24.22.1`。本文档已在当前机器上用 `npm ci --legacy-peer-deps` + `npm start` 实测通过（首页返回 HTTP 200）。如果之后遇到奇怪的安装/启动错误，再切到 Node 20 LTS。

---

## 2. 安装 / 切换 Node 20（Windows）

### 方案 A：nvm-windows（推荐）

1. 下载安装：<https://github.com/coreybutler/nvm-windows/releases>
   选择 `nvm-setup.exe`。
2. 安装后**重新打开 PowerShell**。
3. 执行：

```powershell
nvm install 20.19.4
nvm use 20.19.4
node -v
npm -v
```

应该显示 `v20.19.4`。

> 如果提示版本不存在，先执行 `nvm list available` 看可用的 20.x 版本号，再安装。

### 方案 B：fnm

```powershell
winget install Schniz.fnm
fnm install 20
fnm use 20
node -v
```

### 方案 C：直接安装 Node 20 LTS 安装包

1. 打开 <https://nodejs.org/en/download>
2. 下载 **Node.js 20 LTS** 的 Windows Installer。
3. 安装时勾选 “Add to PATH”。
4. 重新打开终端，`node -v` 确认。

---

## 3. 进入项目目录

### PowerShell

```powershell
cd C:\Users\wkeong\Desktop\Workprojects\KMC-draft
```

### Git Bash

```bash
cd /c/Users/wkeong/Desktop/Workprojects/KMC-draft
```

确认文件存在：

```powershell
ls
```

你应该看到：

```text
package.json
package-lock.json
public
src
README.md
```

---

## 4. 安装依赖

项目**没有** `node_modules`，第一次必须安装。

### 推荐命令

因为仓库里有 `package-lock.json`，优先用：

```powershell
npm ci
```

如果 `npm ci` 报 lockfile 不同步或 peer dependency 错误，改用：

```powershell
npm install
```

如果仍然有 peer dependency 报错：

```powershell
npm install --legacy-peer-deps
```

### 安装大概需要多久？

- 首次 2–5 分钟，取决于网络。
- 会生成 `node_modules` 文件夹（很大，已被 `.gitignore` 忽略）。
- 安装完成后不应有红色 `ERR!`。

### 如果公司网络慢

可以临时使用镜像（仅在需要时）：

```powershell
npm config set registry https://registry.npmmirror.com
npm ci
```

安装完成后如果想恢复官方源：

```powershell
npm config set registry https://registry.npmjs.org
```

---

## 5. 启动前端（开发模式）

在项目根目录执行：

```powershell
npm start
```

正常情况下会看到：

```text
Compiled successfully!

You can now view my-react-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

浏览器会自动打开。如果没有自动打开，手动访问：

```
http://localhost:3000
```

### 你会看到什么

- 首页：Hero、Our Services、About、Gallery、Clients、Contact、Footer
- 顶部导航：Home / About us / Services / Products / Contact us
- 修改 `src` 下的文件并保存，浏览器会自动刷新（Hot Reload）。

### 停止开发服务器

在运行 `npm start` 的终端按：

```text
Ctrl + C
```

如果问 `Terminate batch job (Y/N)?`，输入 `Y` 回车。

---

## 6. 页面路由

启动后可以直接访问：

| 页面 | URL |
|---|---|
| 首页 | <http://localhost:3000/> |
| 关于我们 | <http://localhost:3000/aboutUs> |
| 服务 | <http://localhost:3000/Services> |
| 产品 | <http://localhost:3000/Products> |

> 注意 URL 大小写：`/Services` 和 `/Products` 是大写开头，和 `App.js` 里的路由一致。

---

## 7. 建议的查看方式

### 7.1 桌面视图

直接用 Chrome / Edge 打开 `http://localhost:3000`。

### 7.2 手机视图

1. 按 `F12` 打开 DevTools。
2. 点击左上角“手机/平板”图标（Toggle device toolbar）。
3. 选择 `iPhone 12 Pro`、`Pixel 7` 或自定义宽度：
   - 320px
   - 375px
   - 390px
   - 768px
   - 1024px
   - 1440px
4. 刷新页面，检查是否有横向滚动、文字溢出、按钮错位。

### 7.3 用手机真机访问

1. 确保手机和电脑连同一个 Wi-Fi。
2. 运行 `npm start` 后，终端会显示 `On Your Network: http://192.168.x.x:3000`。
3. 手机浏览器输入这个地址。
4. 如果打不开，检查 Windows 防火墙是否允许 Node.js 通过专用网络。

---

## 8. 构建生产版本并在本地预览

开发模式 `npm start` 是给你改代码看的，不是最终性能。

### 构建

```powershell
npm run build
```

成功后生成 `build/` 文件夹。

### 本地预览 build

不要直接双击 `build/index.html`（会白屏），要用一个静态服务器：

```powershell
npx serve -s build
```

如果提示安装 `serve`，输入 `y`。

默认访问：

```
http://localhost:3000
```

如果 3000 被 `npm start` 占用，可以指定端口：

```powershell
npx serve -s build -l 5000
```

然后访问 `http://localhost:5000`。

> `-s` 表示 SPA fallback，刷新子路由不会 404。

---

## 9. 常用命令速查

| 命令 | 作用 |
|---|---|
| `npm start` | 启动开发服务器（localhost:3000） |
| `npm run build` | 生成生产版本到 `build/` |
| `npx serve -s build` | 本地预览生产版本 |
| `npm test` | 运行测试（当前项目基本没测试） |
| `npm run deploy` | 部署到 GitHub Pages（**不要随便运行**） |
| `Ctrl + C` | 停止当前命令 |

---

## 10. 端口被占用怎么办？

### 症状

```text
Something is already running on port 3000.
```

### 方案 A：换端口

**PowerShell：**

```powershell
$env:PORT=3001
npm start
```

**CMD：**

```cmd
set PORT=3001 && npm start
```

**Git Bash：**

```bash
PORT=3001 npm start
```

然后访问 <http://localhost:3001>。

### 方案 B：找出并结束占用进程

**PowerShell：**

```powershell
netstat -ano | findstr :3000
```

会看到最后一列是 PID，例如 `12345`，然后：

```powershell
taskkill /PID 12345 /F
```

### 方案 C：临时不自动打开浏览器

**PowerShell：**

```powershell
$env:BROWSER="none"
npm start
```

**Git Bash：**

```bash
BROWSER=none npm start
```

---

## 11. 常见问题排查

### 11.1 `npm start` 报 `react-scripts: not found`

说明依赖没装好：

```powershell
npm install
```

如果还不行：

```powershell
rm -r node_modules
npm install
```

PowerShell 删除目录：

```powershell
Remove-Item -Recurse -Force node_modules
```

### 11.2 `npm install` 报 peer dependency 错误

```powershell
npm install --legacy-peer-deps
```

或者：

```powershell
npm ci --legacy-peer-deps
```

### 11.3 报 `ERR_OSSL_EVP_UNSUPPORTED`

这是旧版 webpack 在较新 Node 上的 OpenSSL 兼容问题。先尝试切 Node 20。若仍然出现：

**PowerShell：**

```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm start
```

**Git Bash：**

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

> 这是临时方案，优先切 Node 20 LTS。

### 11.4 页面空白 / 白屏

依次检查：

1. 终端是否有 `Failed to compile`。
2. 浏览器 DevTools Console 是否有红色错误。
3. 是否在项目根目录运行 `npm start`（必须有 `package.json`）。
4. 尝试 `Ctrl + C` 后重新 `npm start`。
5. 删除缓存后重装：

```powershell
Remove-Item -Recurse -Force node_modules
npm cache verify
npm install
```

### 11.5 修改代码后没有自动刷新

1. 确认文件已保存。
2. 看终端是否在重新编译。
3. 手动刷新浏览器 `Ctrl + Shift + R`。
4. 重启 `npm start`。

### 11.6 图片不显示 / `Module not found`

- 检查 `import` 路径大小写是否和真实文件一致。
- Windows 对大小写不敏感，但 GitHub Pages（Linux）敏感。
- 现有目录是 `src/Assets`（大写 A），不要写成 `src/assets`。
- 移动/重命名文件后，重启开发服务器。

### 11.7 字体加载慢或中文不好看

当前 `src/index.css` 从 Google Fonts 加载 `Outfit`。如果网络访问 Google Fonts 慢：

- 页面仍会使用系统字体，不影响功能。
- 重设计后会改用本地/更稳定的字体加载策略。
- 开发时可以先忽略。

### 11.8 启动时的 ESLint 警告

项目现有代码会有一些警告，例如：

- `'React' is defined but never used`
- `'service1' is defined but never used`
- `<iframe> elements must have a unique title property`
- `Each child in a list should have a unique "key" prop`

这些**不影响本地运行**，属于现有代码质量问题，重设计时会一并清理。

### 11.9 安装时大量 `npm warn deprecated`

这是正常的。项目依赖树较旧（`react-scripts` 5、`gh-pages`、旧版 `pages` 等），会带出很多 deprecated 警告。只要最后显示 `added N packages` 且没有 `ERR!`，就可以继续。

实测安装结果（Node 24 / npm 11）：

```text
added 1976 packages in 1m
```

### 11.10 `npm run build` 成功但部署后刷新 404

GitHub Pages 不支持 SPA 路由回退。需要在部署时生成 `404.html`（复制 `build/index.html`），或者使用 HashRouter。详见设计文档第 7.7 节。

### 11.11 `npm run deploy` 做了什么？

`package.json` 中：

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

它会：

1. 先执行生产构建。
2. 把 `build/` 推到 `gh-pages` 分支。
3. 影响线上网站 `kmcbakingtray.com`。

**本地看效果不需要运行它。** 只在确认要上线时执行。

---

## 12. 改代码前建议做的事

### 12.1 新建分支

不要直接在 `main` 上大改：

```powershell
git status
git checkout -b design/redesign-v1
```

确认当前没有未提交的改动。如果有，先 commit 或 stash。

### 12.2 保存当前页面截图

在浏览器打开四个页面，各截一张图，放到：

```text
docs/before/
```

这样改完后可以对比。

### 12.3 确认 `.env` 不存在敏感信息

联系表单目前把 Web3Forms access key 写在 `Contact.jsx` 里。重设计时会移到 `.env`：

```env
REACT_APP_WEB3FORMS_KEY=your_key_here
```

`.env.local` 已被 `.gitignore` 忽略。不要把真实密钥提交到公开仓库。

---

## 13. 推荐的开发流程

```text
1. git checkout -b design/redesign-v1
2. npm ci
3. npm start
4. 浏览器打开 http://localhost:3000
5. 改代码 → 自动刷新 → 看效果
6. 每完成一个 Phase，git add / git commit
7. npm run build 验证生产构建
8. npx serve -s build 本地预览生产版本
9. 确认无误后合并 / 部署
```

### 推荐 commit 粒度

```bash
git add src/styles src/Components/layout
git commit -m "feat(design): add design tokens and new navbar/footer"

git add src/Components/sections/Hero
git commit -m "feat(home): redesign hero section"

git add src/Components/Product
git commit -m "fix(products): keep full product list when filtering"
```

---

## 14. 推荐的 VS Code 插件

| 插件 | 用途 |
|---|---|
| ESLint | 实时检查 JS/JSX |
| Prettier | 统一格式 |
| ES7+ React/Redux/React-Native snippets | React 代码片段 |
| Auto Rename Tag | 自动重命名 JSX 标签 |
| CSS Peek | 快速查看 CSS |
| GitLens | 查看 Git 历史（可选） |

### 建议的 VS Code 设置

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.eol": "\n"
}
```

> 注意：项目现有代码缩进不统一（2/4 空格混用），重设计时统一为 2 空格。

---

## 15. 一分钟快速开始（TL;DR）

如果你只想最快看到页面：

```powershell
cd C:\Users\wkeong\Desktop\Workprojects\KMC-draft
npm install
npm start
```

浏览器打开：

```
http://localhost:3000
```

如果出错：

```powershell
nvm install 20.19.4
nvm use 20.19.4
Remove-Item -Recurse -Force node_modules
npm ci
npm start
```

---

## 16. 下一步

本地跑起来后：

1. 先确认四个页面都能打开。
2. 对照 `docs/FRONTEND_REDESIGN_PLAN.md` 看现状问题。
3. 设计决策已确认（见设计文档第 15 节）：深青绿 + 铜色、Space Grotesk / Inter / Noto Sans SC、EN / 中文 Tab、产品轻量 v1 Modal。
4. 从 **Phase 1（设计 token + Navbar/Footer）** 开始改代码。

---

*最后更新：2026-10-26（设计决策确认）*
