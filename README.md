# 🤖 Commit Assistant

A modern VS Code extension that helps you write better commit messages with ease and consistency.

Built with **Svelte + TypeScript + Tailwind CSS** for optimal performance, maintainability, and developer experience.

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/sunzhongyi.commit-assistant)](https://marketplace.visualstudio.com/items?itemName=sunzhongyi.commit-assistant)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/sunzhongyi.commit-assistant)](https://marketplace.visualstudio.com/items?itemName=sunzhongyi.commit-assistant)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/sunzhongyi.commit-assistant)](https://marketplace.visualstudio.com/items?itemName=sunzhongyi.commit-assistant)

## ✨ Features

### 📝 **Structured Form Mode**
- **Conventional Commits** compliant form with type, scope, description, body, and footer fields
- **Smart type selector** with predefined commit types (feat, fix, docs, etc.)
- **AI-powered generation** for scope and body fields
- **Custom flags system** for additional metadata

### 📄 **Free Text Mode**
- **Pure text editor** for those who prefer writing commit messages directly
- **Auto-growing textarea** that adapts to content length
- **Flag integration** that works seamlessly with text mode

### 🤖 **AI Integration**
- **OpenAI & Google AI** support for intelligent commit message generation
- **Context-aware suggestions** based on your code changes
- **Configurable AI models** (GPT-4, GPT-3.5, Gemini Pro, etc.)
- **Field-specific generation** for targeted assistance

### 🎨 **Modern UI/UX**
- **VS Code theme integration** - perfectly matches your editor's appearance
- **Responsive design** that works on different screen sizes
- **Real-time preview** of your final commit message
- **Intuitive tabbed interface** for easy mode switching

### 💾 **Smart State Management**
- **Auto-save functionality** - never lose your work
- **Session persistence** across VS Code restarts
- **Workspace-specific settings** for team consistency

### ⌨️ **Keyboard Shortcuts**
- `Ctrl+Enter` / `Cmd+Enter` - Save commit
- `Escape` - Cancel and close
- Full keyboard navigation support

## 🚀 Quick Start

### Installation

1. **From VS Code Marketplace**: Search for "Commit Assistant" in the Extensions view (`Ctrl+Shift+X`)
2. **From Command Line**: `code --install-extension sunzhongyi.commit-assistant`

### Usage

1. **Open the Assistant**: Click the "Assistant" button in the Source Control panel
2. **Choose your mode**: 
   - **Form Mode**: Fill out structured fields for conventional commits
   - **Text Mode**: Write commit messages in free text format
   - **Flags Mode**: Configure custom flags for your workflow
3. **Use AI assistance**: Click the AI trigger buttons for intelligent suggestions
4. **Save your commit**: Press `Ctrl+Enter` or click the Save button

## ⚙️ Configuration

### AI Settings

You can configure AI providers in VS Code settings in GUI way.

### Commit Types

Customize available commit types:

```json
{
  "commitAssistant.commitTypes": [
    {
      "value": "feat",
      "label": "feat",
      "description": "A new feature"
    },
    {
      "value": "fix", 
      "label": "fix",
      "description": "A bug fix"
    }
    // ... more types
  ]
}
```

## 📸 Screenshots

### Form Mode
![Form Mode](https://via.placeholder.com/800x600/1e1e1e/ffffff?text=Form+Mode+Screenshot)

*Structured form with conventional commit fields and AI assistance*

### Text Mode  
![Text Mode](https://via.placeholder.com/800x600/1e1e1e/ffffff?text=Text+Mode+Screenshot)

*Free text editor with auto-growing textarea and flag support*

### Settings
![Settings](https://via.placeholder.com/800x600/1e1e1e/ffffff?text=Settings+Screenshot)

*Comprehensive settings for AI configuration and commit types*

## 🏗️ Architecture

```
commit-assistant/
├── webviews/
│   ├── commit-editor/          # 📝 Main commit editor
│   │   ├── components/         # Svelte components
│   │   ├── App.svelte         # Main app component
│   │   └── main.ts            # Entry point
│   └── settings/              # ⚙️ Settings panel
├── extension.ts               # 🚀 VS Code extension logic
├── rollup.config.mjs         # 🛠️ Build configuration
└── package.json              # 📦 Extension manifest
```

### Technical Highlights

- **🚀 Svelte**: Compile-time optimized, minimal runtime overhead
- **📘 TypeScript**: Full type safety across the entire codebase  
- **🎨 Tailwind CSS**: Utility-first styling with VS Code theme integration
- **🤖 AI SDK**: Unified interface for multiple AI providers
- **⚡ Rollup**: Optimized bundling for webview components

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- VS Code 1.70+
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/joisun/commit-assistant.git
cd commit-assistant

# Install dependencies
npm install

# Build the extension
npm run build
```

### Development Workflow

```bash
# Start TypeScript compiler in watch mode
npm run watch

# In another terminal, start webview build in watch mode  
npm run build:watch

# Press F5 in VS Code to launch Extension Development Host
```

### Testing

```bash
# Run tests (if available)
npm test

# Package extension for testing
npm run package
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines

1. **Code Style**: We use TypeScript strict mode and Prettier for formatting
2. **Commits**: Follow conventional commit format that this extension helps create!
3. **Testing**: Add tests for new features and bug fixes
4. **Documentation**: Update README and inline docs for any changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Conventional Commits** specification for commit message standards
- **Svelte** team for the amazing compile-time framework
- **VS Code** team for the excellent extension API
- **OpenAI** and **Google** for AI capabilities

---

**Start writing better commits today!** 🚀

[Install from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sunzhongyi.commit-assistant)
