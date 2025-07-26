# 🤖 Commit Assistant (Svelte Edition)

一个使用现代化技术栈重构的 VS Code 扩展，旨在帮助你更轻松、更规范地编写 commit message。

这个版本使用 **Svelte + TypeScript + Tailwind CSS** 构建，提供了极致的性能、优秀的可维护性和现代化的开发体验。

## ✨ 特性

- 🚀 **现代化技术栈**: 使用 Svelte、TypeScript 和 Tailwind CSS 构建，性能卓越，代码简洁。
- 📝 **结构化表单**: 引导用户按照 Conventional Commits 规范填写 commit message。
- 📄 **自由文本编辑**: 同时提供纯文本编辑模式，满足不同需求。
- 🔄 **实时预览**: 边写边看最终的 commit message 效果。
- 💾 **状态持久化**: 自动保存编辑内容，关闭后不丢失。
- 🎨 **VS Code 主题适配**: UI 风格与编辑器无缝融合。
- ⌨️ **快捷键支持**:
  - `Ctrl+Enter` / `Cmd+Enter` - 保存
  - `Escape` - 取消

## 🏗️ 项目架构

```
commit-assistant/
├── webview/                # 📦 前端 (Svelte + TS)
│   ├── App.svelte          # 主组件
│   ├── main.ts             # 入口文件
│   ├── app.css             # Tailwind CSS 全局样式
│   └── tsconfig.json       # 前端TS配置
├── extension.ts            # 🚀 扩展后端 (VS Code API)
├── rollup.config.mjs       # 🛠️ 前端构建配置
├── tailwind.config.js      # 🎨 样式配置
├── package.json            # ⚙️ 项目配置与依赖
└── tsconfig.json           # 🔧 后端TS配置
```

### 架构优势

✅ **高性能**: Svelte 作为编译器，产出极小、无运行时的原生 JS，加载和运行速度飞快。
✅ **强类型**: 全程使用 TypeScript，代码更健壮，错误更少。
✅ **易维护**: 组件化的代码结构和声明式的 Svelte 语法，让逻辑更清晰。
✅ **开发高效**: Tailwind CSS 提供了强大的样式工具，UI 开发更迅速。
✅ **易于扩展**: 清晰的架构为未来集成 AI 功能（如自动生成 commit）等高级特性打下坚实基础。

## 🚀 开发指南

### 1. 安装依赖

```bash
npm install
```

### 2. 编译与构建

```bash
# 运行一次完整的构建 (编译后端 + 打包前端)
npm run build

# 或者，在开发时监听后端文件变化
npm run watch

# (需要新开一个终端) 监听并自动打包前端文件
npm run build:webview -- --watch
```

### 3. 启动与调试

1.  完成构建后，在 VS Code 中按 `F5` 启动一个“扩展开发宿主”窗口。
2.  在新窗口中，打开任何一个包含 Git 仓库的项目。
3.  点击“源代码管理”面板上的 "Assistant" 按钮，即可看到新的 UI 界面。

## 🔮 未来计划

- 🤖 **AI 自动生成**: 基于代码变更自动生成高质量的 commit message。
- 🎯 **智能建议**: 根据项目历史和规范提供动态建议。
- 🔧 **自定义模板**: 允许用户或团队自定义 commit 模板。

---

**开始你的现代化 commit message 助手之旅吧！** 🚀
