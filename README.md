# copilot-tui 🚀

> A visual TUI wrapper for GitHub Copilot CLI — making it easier and more accessible without losing any functionality.

**copilot-tui** wraps the real GitHub Copilot CLI in a beautiful, paneled terminal interface with a sidebar, command palette, and keyboard shortcuts. Think of it as a friendlier front door to the same powerful tool.

## ✨ Features

- **📋 Sidebar with all commands** — Browse every slash command organized by category (Code, Session, Models, Agent, Permissions, Help). No memorization needed.
- **🔍 Command Palette (Ctrl+K)** — Fuzzy search across all commands, just like VS Code.
- **💬 Chat Panel** — Copilot responses rendered in a clean, scrollable panel with user/copilot message indicators.
- **🎨 Dark & Light Themes** — Toggle with Ctrl+T. Dark mode by default.
- **⌨️ 7 Navigation Methods** — Tab, arrow keys, mouse, Ctrl+1/2/3, number keys, auto-focus, scroll wheel. Use whatever feels natural.
- **🚀 Welcome Screen** — First-launch tips so new users know exactly what to do.
- **💯 Zero Feature Loss** — Every Copilot CLI feature works exactly the same. We add visual structure, never remove functionality.

## 📦 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or later
- [GitHub Copilot CLI](https://github.com/github/copilot-cli) installed and authenticated

### Install from npm
```bash
npm install -g copilot-tui
```

### Or run directly
```bash
npx copilot-tui
```

### Build from source
```bash
git clone https://github.com/Rolling2405/copilot-tui.git
cd copilot-tui
npm install
npm run build
npm start
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Tab** | Cycle panels (sidebar → chat → input) |
| **Ctrl+1/2/3** | Jump to sidebar / chat / input |
| **Ctrl+K** | Open command palette |
| **Ctrl+B** / **F2** | Toggle sidebar |
| **Ctrl+T** | Switch dark/light theme |
| **1-9** | Quick-select sidebar commands |
| **↑ ↓** | Navigate within panels / command history |
| **◄ ►** | Switch command categories in sidebar |
| **Enter** | Send message / select command |
| **Ctrl+C ×2** | Exit |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│  copilot-tui (TypeScript + Ink)                 │
│                                                  │
│  ┌──────────┬──────────────────────────────┐    │
│  │ Sidebar  │  Chat Panel                  │    │
│  │ Commands │  (parsed Copilot output)     │    │
│  ├──────────┴──────────────────────────────┤    │
│  │ Status Bar                              │    │
│  ├─────────────────────────────────────────┤    │
│  │ Input Bar                               │    │
│  └─────────────────────────────────────────┘    │
│         │                  ▲                     │
│         │ stdin            │ stdout (PTY)        │
│         ▼                  │                     │
│  ┌─────────────────────────────────────────┐    │
│  │  copilot (real CLI — full power)        │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

**Key principle:** copilot-tui spawns the real `copilot` binary as a child process using a pseudo-terminal (PTY). All your input goes directly to copilot. All copilot's output gets parsed and rendered in our panels. Nothing is modified — we just add a visual layer.

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

[MIT](LICENSE) © Rolling2405

## 💡 Why This Exists

GitHub Copilot CLI is an incredibly powerful tool, but its blank terminal prompt can be intimidating for users who aren't comfortable with command lines. copilot-tui makes every feature discoverable through a sidebar and command palette — like putting a dashboard on a race car. Same engine, friendlier controls.

This project was built as a proof-of-concept to demonstrate that a visual TUI layer could make Copilot CLI more accessible. We've filed a [feature request](https://github.com/github/copilot-cli/issues) proposing that similar functionality be built natively into the CLI.
