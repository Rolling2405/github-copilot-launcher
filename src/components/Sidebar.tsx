/**
 * Sidebar — categorized list of slash commands.
 * Visible by default, toggleable with Ctrl+B or F2.
 * Supports number keys 1-9 for quick selection.
 */
import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  CATEGORIES,
  getCommandsByCategory,
  type CommandCategory,
  type SlashCommand,
} from "../copilot/commands.js";
import type { Theme } from "../themes/themes.js";

interface SidebarProps {
  focused: boolean;
  theme: Theme;
  onSelectCommand: (command: string) => void;
  onRequestFocusInput: () => void;
}

export function Sidebar({
  focused,
  theme,
  onSelectCommand,
  onRequestFocusInput,
}: SidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<CommandCategory>("Code");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const categoryCommands = getCommandsByCategory(selectedCategory);
  const categoryIndex = CATEGORIES.indexOf(selectedCategory);

  useInput(
    (input, key) => {
      if (!focused) return;

      // Arrow up/down to navigate commands within category
      if (key.upArrow) {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      }
      if (key.downArrow) {
        setSelectedIndex((prev) =>
          Math.min(categoryCommands.length - 1, prev + 1)
        );
      }

      // Arrow left/right to switch categories
      if (key.leftArrow) {
        const newIdx = Math.max(0, categoryIndex - 1);
        setSelectedCategory(CATEGORIES[newIdx]!);
        setSelectedIndex(0);
      }
      if (key.rightArrow) {
        const newIdx = Math.min(CATEGORIES.length - 1, categoryIndex + 1);
        setSelectedCategory(CATEGORIES[newIdx]!);
        setSelectedIndex(0);
      }

      // Enter to select command
      if (key.return && categoryCommands[selectedIndex]) {
        onSelectCommand(categoryCommands[selectedIndex].command);
        onRequestFocusInput();
      }

      // Number keys 1-9 for quick select
      const num = parseInt(input, 10);
      if (num >= 1 && num <= 9 && num <= categoryCommands.length) {
        onSelectCommand(categoryCommands[num - 1]!.command);
        onRequestFocusInput();
      }
    }
  );

  const borderColor = focused ? theme.borderFocused : theme.border;

  return (
    <Box
      flexDirection="column"
      width={32}
      borderStyle="round"
      borderColor={borderColor}
      paddingX={1}
    >
      <Text bold color={theme.sidebarHeader}>
        📋 Commands {focused ? "(focused)" : ""}
      </Text>

      {/* Category tabs */}
      <Box marginY={1} flexWrap="wrap">
        {CATEGORIES.map((cat) => (
          <Text
            key={cat}
            color={
              cat === selectedCategory ? theme.sidebarItemSelected : theme.textDim
            }
            bold={cat === selectedCategory}
          >
            {cat === selectedCategory ? `[${cat}]` : ` ${cat} `}
          </Text>
        ))}
      </Box>
      <Text color={theme.textDim}>◄ ► switch category</Text>

      {/* Commands in selected category */}
      <Box flexDirection="column" marginTop={1}>
        {categoryCommands.map((cmd, idx) => {
          const isSelected = focused && idx === selectedIndex;
          const prefix = isSelected ? "❯" : " ";
          const numKey = idx < 9 ? `${idx + 1}` : " ";

          return (
            <Box key={cmd.command}>
              <Text color={isSelected ? theme.sidebarItemSelected : theme.textDim}>
                {prefix}
              </Text>
              <Text color={theme.textDim}>{numKey} </Text>
              <Text
                color={isSelected ? theme.sidebarItemSelected : theme.sidebarItem}
                bold={isSelected}
              >
                {cmd.command}
              </Text>
              <Text color={theme.textDim}> {cmd.description}</Text>
            </Box>
          );
        })}
      </Box>

      {/* Help text */}
      <Box marginTop={1} flexDirection="column">
        <Text color={theme.textDim}>────────────────────────────</Text>
        <Text color={theme.textDim}>↑↓ navigate  Enter select</Text>
        <Text color={theme.textDim}>1-9 quick select</Text>
        <Text color={theme.textDim}>Ctrl+B/F2 toggle sidebar</Text>
      </Box>

      {/* File context: @-mentionable files */}
      <FileContext theme={theme} />
    </Box>
  );
}

function FileContext({ theme }: { theme: Theme }) {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const entries = fs.readdirSync(process.cwd(), { withFileTypes: true });
      const fileList = entries
        .filter((e) => e.isFile() || e.isDirectory())
        .map((e) => (e.isDirectory() ? `📁 ${e.name}/` : `📄 ${e.name}`))
        .slice(0, 10);
      setFiles(fileList);
    } catch {
      setFiles(["(cannot read directory)"]);
    }
  }, []);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color={theme.textDim}>────────────────────────────</Text>
      <Text bold color={theme.sidebarHeader}>
        📎 Files (use @ to mention)
      </Text>
      {files.map((f, i) => (
        <Text key={i} color={theme.textDim}>
          {f}
        </Text>
      ))}
    </Box>
  );
}
