# Smart Image Compressor

基于 Electron + React + TypeScript 的图片压缩桌面应用。

A image compression desktop app built with Electron, React, and TypeScript.

## ✨ 主要特性 / Features

- 支持批量压缩 WebP、AVIF、PNG、JPEG 格式图片
- 支持选择压缩格式与质量，支持自定义
- 直观的图片压缩前后对比展示
- 自定义输出目录，自动记忆上次选择
- 简洁现代的 UI，操作简单
- 跨平台支持：Windows、macOS、Linux

## 🚀 安装与运行 / Installation & Run

1. 克隆仓库 / Clone the repo

   ```bash
   git clone https://github.com/childrentime/imagemin
   cd imagemin
   ```

2. 安装依赖 / Install dependencies

   ```bash
   pnpm install
   ```

3. 启动开发环境 / Start in development

   ```bash
   pnpm dev
   ```

4. 打包应用 / Build for production

   ```bash
   pnpm build:mac   # macOS
   pnpm build:win   # Windows
   pnpm build:linux # Linux
   ```

## 🖼️ 使用说明 / Usage

1. 启动应用后，点击"选择图片"批量导入图片。
2. 可选择输出格式（保持原格式/WebP/AVIF/JPEG/PNG）和压缩质量。
3. 可自定义输出文件夹。
4. 点击"开始压缩"，完成后可对比原图与压缩图，查看压缩率。
5. 支持一键清空所有记录。

## 🛠️ 技术栈 / Tech Stack

- Electron
- React + TypeScript
- MUI (Material UI)
- sharp (图片处理)
- electron-store (本地存储)

## 📁 目录结构 / Project Structure

```
imagemin/
  ├─ src/
  │   ├─ main/        # Electron 主进程
  │   ├─ preload/     # 预加载脚本
  │   └─ renderer/    # 前端界面 (React)
  ├─ resources/       # 应用资源
  ├─ package.json     # 项目配置
  └─ ...
```

## 📄 License

MIT
