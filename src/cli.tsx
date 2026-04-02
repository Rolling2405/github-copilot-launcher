/**
 * CLI entry point — parses args and renders the App with Ink.
 */
import React from "react";
import { render } from "ink";
import { App } from "./app.js";

// Simple arg parsing
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
copilot-tui — A visual TUI for GitHub Copilot CLI

Usage:
  copilot-tui            Start the TUI
  copilot-tui --help     Show this help message
  copilot-tui --version  Show version

Keyboard Shortcuts:
  Tab           Cycle panels (sidebar → chat → input)
  Ctrl+1/2/3    Jump to sidebar / chat / input
  Ctrl+K        Open command palette
  Ctrl+B / F2   Toggle sidebar
  Ctrl+T        Switch dark/light theme
  1-9           Quick-select sidebar commands (when sidebar focused)
  Ctrl+C ×2     Exit

copilot-tui wraps the real GitHub Copilot CLI in a visual interface.
All copilot features work exactly the same — just easier to discover.
`);
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  console.log("copilot-tui v0.1.0");
  process.exit(0);
}

// Render the full-screen Ink app
render(<App />, {
  // Enable full-screen mode
  exitOnCtrlC: false, // We handle Ctrl+C ourselves
});
