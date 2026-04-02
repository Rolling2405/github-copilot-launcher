# Contributing to GitHub Copilot Launcher

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

5. **Run the launcher:**
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── cli.tsx              # Entry point (main loop: show menu → launch copilot → repeat)
├── app.tsx              # Root layout component (sidebar + info panel + input)
├── components/
│   ├── Sidebar.tsx      # Command browser (45+ commands in 7 categories)
│   ├── InputBar.tsx     # User input
│   ├── StatusBar.tsx    # Status display + key hints
│   ├── CommandPalette.tsx # Ctrl+K fuzzy search
│   └── WelcomeScreen.tsx  # First-launch guide
├── copilot/
│   └── commands.ts      # Command registry (all slash commands + descriptions)
├── hooks/
│   ├── useNavigation.ts # Panel navigation
│   └── useTheme.ts      # Theme management
└── themes/
    └── themes.ts        # Dark/light theme definitions
```

## Architecture

GitHub Copilot CLI is itself a full-screen TUI app (alternate screen buffer, mouse tracking, animated logo, dialog boxes). You **cannot** embed it inside another TUI — it causes rendering conflicts.

The launcher uses a **menu → launch → return** pattern:
1. Ink renders the command browser
2. User picks a command and presses Enter
3. Ink unmounts, copilot spawns with `stdio: 'inherit'` (full terminal control)
4. When copilot exits, the launcher re-renders

## Guidelines

- **TypeScript:** All code must be TypeScript with strict mode.
- **Type-check before submitting:** Run `npm run typecheck`.
- **Launcher only:** Never modify what copilot does — copilot runs natively with full terminal control.
- **Keyboard-first:** Ensure all features work with keyboard-only navigation.

## Submitting Changes

1. Fork the repo and create a feature branch
2. Make your changes
3. Run `npm run build && npm run typecheck` to verify
4. Open a pull request with a clear description

## Code of Conduct

Be kind, be respectful, be helpful. We're all here to make Copilot CLI better for everyone.
