# Contributing to copilot-tui

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Rolling2405/copilot-tui.git
   cd copilot-tui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build:**
   ```bash
   npm run build
   ```

4. **Run in dev mode (auto-rebuild on changes):**
   ```bash
   npm run dev
   ```

5. **Run the TUI:**
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── cli.tsx              # Entry point
├── app.tsx              # Root layout component
├── components/
│   ├── ChatPanel.tsx    # Conversation display
│   ├── Sidebar.tsx      # Command browser
│   ├── InputBar.tsx     # User input
│   ├── StatusBar.tsx    # Status display
│   ├── CommandPalette.tsx # Ctrl+K search
│   └── WelcomeScreen.tsx  # First-launch tips
├── copilot/
│   ├── process.ts       # PTY process manager
│   ├── parser.ts        # Output parser
│   └── commands.ts      # Command registry
├── hooks/
│   ├── useCopilot.ts    # Copilot process hook
│   ├── useNavigation.ts # Panel navigation
│   └── useTheme.ts      # Theme management
└── themes/
    └── themes.ts        # Dark/light theme definitions
```

## Guidelines

- **TypeScript:** All code must be TypeScript with strict mode.
- **Type-check before submitting:** Run `npm run typecheck`.
- **Additive only:** Never modify what copilot does — only add visual structure.
- **Accessibility:** Ensure all features work with keyboard-only navigation.

## Submitting Changes

1. Fork the repo and create a feature branch
2. Make your changes
3. Run `npm run build && npm run typecheck` to verify
4. Open a pull request with a clear description

## Code of Conduct

Be kind, be respectful, be helpful. We're all here to make Copilot CLI better for everyone.
