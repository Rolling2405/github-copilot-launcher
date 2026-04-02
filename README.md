# GitHub Copilot Launcher 🚀

> A visual command menu for GitHub Copilot CLI — browse, search, and launch any copilot command without memorizing a thing.

GitHub Copilot CLI is incredibly powerful, but when you launch it you get a blank prompt that says *"Describe a task."* You're expected to already know what commands exist. **GitHub Copilot Launcher** fixes that by giving you a visual menu of all 45+ commands — organized by category, searchable, and one keypress away.

**You don't lose any features.** Copilot launches natively with full terminal control. The launcher is just the friendly front door.

## ✨ What It Does

```
┌─────────────────────────────────────────────────┐
│  GitHub Copilot Launcher (browse commands)       │
│                                                  │
│  ┌──────────┬──────────────────────────────┐    │
│  │ Sidebar  │  Info Panel                  │    │
│  │ 45+ cmds │  (selected command details)  │    │
│  ├──────────┴──────────────────────────────┤    │
│  │ Status Bar                              │    │
│  ├─────────────────────────────────────────┤    │
│  │ Input Bar                               │    │
│  └─────────────────────────────────────────┘    │
│                     │                            │
│              Press Enter                         │
│                     ▼                            │
│  ┌─────────────────────────────────────────┐    │
│  │  GitHub Copilot CLI (full native TUI)   │    │
│  │  100% of features, zero compromises     │    │
│  └─────────────────────────────────────────┘    │
│                     │                            │
│          Copilot exits (Ctrl+C)                  │
│                     ▼                            │
│           Back to launcher menu                  │
└─────────────────────────────────────────────────┘
```

- **📋 Command Sidebar** — All commands organized by category: Code, Session, Models, Agent, Permissions, Help, Other
- **🔍 Command Palette (Ctrl+K)** — Fuzzy search across all commands, like VS Code
- **📎 File Context** — Shows files in your current directory for easy reference
- **🎨 Dark & Light Themes** — Toggle with Ctrl+T
- **⌨️ Multiple Navigation Methods** — Tab, arrow keys, Ctrl+1/2/3, number keys, whatever feels natural
- **🚀 Welcome Screen** — First-launch guide so new users know exactly what to do
- **💯 Zero Feature Loss** — Copilot runs natively. Every feature works exactly the same.

## 📦 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or later
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) installed and authenticated

### Build from source
```bash
git clone https://github.com/Rolling2405/copilot-tui.git
cd copilot-tui
npm install
npm run build
npm start
```

## 🎮 How It Works

1. **Launch** — Run `copilot-launcher` (or `npm start`)
2. **Browse** — Scroll through 45+ commands in the sidebar, or press **Ctrl+K** to search
3. **Pick** — Select a command or type your own message
4. **Enter** — Copilot launches with full terminal control — it's the real thing
5. **Return** — When you exit copilot, the launcher menu comes back for another round

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Enter** | Launch copilot (with selected command or your typed message) |
| **Tab** | Cycle panels (sidebar → info → input) |
| **Ctrl+K** | Open command palette (fuzzy search) |
| **Ctrl+1/2/3** | Jump to sidebar / info / input |
| **Ctrl+B** / **F2** | Toggle sidebar visibility |
| **Ctrl+T** | Switch dark/light theme |
| **1-9** | Quick-select sidebar commands |
| **↑ ↓** | Navigate within panels |
| **◄ ►** | Switch command categories in sidebar |
| **Ctrl+C** | Exit |

## 🏗️ Architecture

GitHub Copilot CLI is itself a full-screen TUI application — it uses an alternate screen buffer, draws its own borders, shows animated logos, and manages its own input. You can't embed it inside another TUI without breaking its rendering.

So instead of wrapping copilot, **GitHub Copilot Launcher** acts as a **menu screen** that runs *before* copilot. Think of it like a Start Menu:

1. The launcher renders its own Ink-based UI (sidebar, command palette, etc.)
2. When you press Enter, the launcher **cleanly exits** and spawns copilot with `stdio: 'inherit'`
3. Copilot gets **full terminal control** — no rendering conflicts, no feature loss
4. When copilot exits, the launcher comes back

This is why it works perfectly — copilot is never modified or wrapped. It runs exactly as if you launched it yourself.

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

[MIT](LICENSE) © Rolling2405

## 💡 Why This Exists

GitHub Copilot CLI drops you at a blank prompt and expects you to know what to type. That's fine for power users, but intimidating for everyone else. This launcher puts a visual command browser in front of copilot — so you can *discover* features instead of memorizing them.

We've also filed a [feature request](https://github.com/github/copilot-cli/issues/2489) proposing that similar command discovery be built natively into the CLI.
