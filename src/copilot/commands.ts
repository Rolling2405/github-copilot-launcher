/**
 * Slash command registry — all copilot CLI commands organized by category.
 * These are displayed in the sidebar and command palette.
 */

export interface SlashCommand {
  command: string;
  description: string;
  category: CommandCategory;
}

export type CommandCategory =
  | "Code"
  | "Session"
  | "Models"
  | "Permissions"
  | "Help"
  | "Agent"
  | "Other";

export const COMMANDS: SlashCommand[] = [
  // Code
  { command: "/diff", description: "Review changes in current directory", category: "Code" },
  { command: "/pr", description: "Operate on pull requests", category: "Code" },
  { command: "/review", description: "Run code review agent", category: "Code" },
  { command: "/ide", description: "Connect to an IDE workspace", category: "Code" },
  { command: "/lsp", description: "Manage language servers", category: "Code" },
  { command: "/plan", description: "Create implementation plan before coding", category: "Code" },

  // Session
  { command: "/resume", description: "Switch to a different session", category: "Session" },
  { command: "/rename", description: "Rename the current session", category: "Session" },
  { command: "/context", description: "Show token usage", category: "Session" },
  { command: "/usage", description: "Display session usage metrics", category: "Session" },
  { command: "/session", description: "View and manage sessions", category: "Session" },
  { command: "/compact", description: "Summarize history to save context", category: "Session" },
  { command: "/share", description: "Share session to file or gist", category: "Session" },
  { command: "/copy", description: "Copy last response to clipboard", category: "Session" },
  { command: "/rewind", description: "Undo last turn and revert changes", category: "Session" },
  { command: "/new", description: "Start a new conversation", category: "Session" },
  { command: "/clear", description: "Abandon session and start fresh", category: "Session" },

  // Models
  { command: "/model", description: "Select AI model", category: "Models" },
  { command: "/delegate", description: "Send session to GitHub for a PR", category: "Models" },
  { command: "/fleet", description: "Enable parallel subagent execution", category: "Models" },
  { command: "/tasks", description: "View background tasks", category: "Models" },

  // Agent
  { command: "/init", description: "Initialize Copilot instructions", category: "Agent" },
  { command: "/agent", description: "Browse and select agents", category: "Agent" },
  { command: "/skills", description: "Manage skills", category: "Agent" },
  { command: "/mcp", description: "Manage MCP servers", category: "Agent" },
  { command: "/plugin", description: "Manage plugins", category: "Agent" },
  { command: "/instructions", description: "View custom instruction files", category: "Agent" },

  // Permissions
  { command: "/allow-all", description: "Enable all permissions", category: "Permissions" },
  { command: "/add-dir", description: "Add directory to allowed list", category: "Permissions" },
  { command: "/list-dirs", description: "Show allowed directories", category: "Permissions" },
  { command: "/cwd", description: "Change working directory", category: "Permissions" },
  { command: "/reset-allowed-tools", description: "Reset allowed tools", category: "Permissions" },

  // Help
  { command: "/help", description: "Show help for commands", category: "Help" },
  { command: "/changelog", description: "Display version changelog", category: "Help" },
  { command: "/feedback", description: "Submit feedback survey", category: "Help" },
  { command: "/theme", description: "View or set color mode", category: "Help" },
  { command: "/update", description: "Update CLI to latest version", category: "Help" },
  { command: "/version", description: "Display version information", category: "Help" },
  { command: "/experimental", description: "Toggle experimental features", category: "Help" },

  // Other
  { command: "/research", description: "Deep research with web sources", category: "Other" },
  { command: "/terminal-setup", description: "Configure multiline input", category: "Other" },
  { command: "/login", description: "Log in to Copilot", category: "Other" },
  { command: "/logout", description: "Log out of Copilot", category: "Other" },
  { command: "/restart", description: "Restart the CLI", category: "Other" },
  { command: "/streamer-mode", description: "Hide sensitive info for streaming", category: "Other" },
];

export const CATEGORIES: CommandCategory[] = [
  "Code",
  "Session",
  "Models",
  "Agent",
  "Permissions",
  "Help",
  "Other",
];

export function getCommandsByCategory(category: CommandCategory): SlashCommand[] {
  return COMMANDS.filter((cmd) => cmd.category === category);
}

export function searchCommands(query: string): SlashCommand[] {
  const lower = query.toLowerCase();
  return COMMANDS.filter(
    (cmd) =>
      cmd.command.toLowerCase().includes(lower) ||
      cmd.description.toLowerCase().includes(lower) ||
      cmd.category.toLowerCase().includes(lower)
  );
}
