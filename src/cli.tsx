/**
 * CLI entry point — shows the TUI launcher, then hands off to copilot.
 *
 * Flow:
 * 1. Render Ink TUI (sidebar, command palette, welcome)
 * 2. User picks a command or types a message
 * 3. Cleanup Ink, spawn copilot in foreground with full stdio
 * 4. When copilot exits, show TUI again (loop)
 */
import React from "react";
import { render } from "ink";
import { spawn } from "node:child_process";
import { App } from "./app.js";

// Simple arg parsing
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
copilot-tui — A visual companion for GitHub Copilot CLI

Usage:
  copilot-tui            Start the launcher TUI
  copilot-tui --help     Show this help message
  copilot-tui --version  Show version

How it works:
  1. copilot-tui shows a sidebar with all 45+ copilot commands
  2. Browse commands by category, search with Ctrl+K
  3. Pick a command or type your own message, press Enter
  4. Copilot launches with full terminal control
  5. When copilot exits, copilot-tui returns for another round

Keyboard Shortcuts (in the launcher):
  Tab           Cycle panels (sidebar → chat → input)
  Ctrl+1/2/3    Jump to sidebar / chat / input
  Ctrl+K        Open command palette
  Ctrl+B / F2   Toggle sidebar
  Ctrl+T        Switch dark/light theme
  1-9           Quick-select sidebar commands (when sidebar focused)
  Ctrl+C        Exit

copilot-tui wraps no features — copilot gets full terminal control.
All copilot features work exactly the same — just easier to discover.
`);
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  console.log("copilot-tui v0.1.0");
  process.exit(0);
}

/** Show the Ink TUI. Resolves with a command string, or null to exit. */
function showTUI(): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    const inkInstance = render(
      React.createElement(App, {
        onLaunchCopilot: (cmd?: string) => {
          inkInstance.unmount();
          inkInstance.cleanup();
          resolve(cmd ?? "");
        },
        onExit: () => {
          inkInstance.unmount();
          inkInstance.cleanup();
          resolve(null);
        },
      }),
      { exitOnCtrlC: false }
    );
  });
}

/** Spawn copilot in the foreground with full terminal control. */
function launchCopilot(initialCommand?: string): Promise<void> {
  return new Promise<void>((resolve) => {
    console.clear();
    console.log("🚀 Launching GitHub Copilot CLI...\n");

    const copilotBin = process.platform === "win32" ? "copilot.exe" : "copilot";
    const copilotArgs: string[] = [];

    if (initialCommand) {
      copilotArgs.push("--prompt", initialCommand);
    }

    const child = spawn(copilotBin, copilotArgs, {
      stdio: "inherit",
      cwd: process.cwd(),
      env: process.env,
      shell: true,
    });

    child.on("error", (err) => {
      console.error(`\n❌ Failed to launch copilot: ${err.message}`);
      console.error(
        "Make sure GitHub Copilot CLI is installed: winget install GitHub.Copilot"
      );
      resolve();
    });

    child.on("close", () => {
      resolve();
    });
  });
}

/** Main loop: show TUI → launch copilot → repeat. */
async function main(): Promise<void> {
  while (true) {
    const command = await showTUI();

    // null means user pressed Ctrl+C to exit
    if (command === null) {
      process.exit(0);
    }

    await launchCopilot(command || undefined);

    console.log("\n✨ Copilot session ended. Returning to copilot-tui...\n");
    // Brief pause so the user can read the message
    await new Promise((r) => setTimeout(r, 1500));
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
