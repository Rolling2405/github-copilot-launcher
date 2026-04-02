/**
 * CommandPalette — Ctrl+K overlay with fuzzy search for all commands.
 */
import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { searchCommands, COMMANDS, type SlashCommand } from "../copilot/commands.js";
import type { Theme } from "../themes/themes.js";

interface CommandPaletteProps {
  visible: boolean;
  theme: Theme;
  onSelect: (command: string) => void;
  onClose: () => void;
}

export function CommandPalette({
  visible,
  theme,
  onSelect,
  onClose,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = query.length > 0 ? searchCommands(query) : COMMANDS;
  const displayResults = results.slice(0, 12); // Show max 12 results

  useInput(
    (input, key) => {
      if (!visible) return;

      if (key.escape) {
        setQuery("");
        setSelectedIndex(0);
        onClose();
        return;
      }

      if (key.upArrow) {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      }
      if (key.downArrow) {
        setSelectedIndex((prev) =>
          Math.min(displayResults.length - 1, prev + 1)
        );
      }

      if (key.return && displayResults[selectedIndex]) {
        const cmd = displayResults[selectedIndex].command;
        setQuery("");
        setSelectedIndex(0);
        onSelect(cmd);
      }
    }
  );

  if (!visible) return null;

  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor={theme.borderFocused}
      paddingX={2}
      paddingY={1}
    >
      <Text bold color={theme.sidebarHeader}>
        🔍 Command Palette (Esc to close)
      </Text>
      <Box marginY={1}>
        <Text color={theme.text}>{"❯ "}</Text>
        <TextInput
          value={query}
          onChange={(val) => {
            setQuery(val);
            setSelectedIndex(0);
          }}
          placeholder="Search commands..."
        />
      </Box>
      <Box flexDirection="column">
        {displayResults.map((cmd, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <Box key={cmd.command}>
              <Text color={isSelected ? theme.sidebarItemSelected : theme.textDim}>
                {isSelected ? "❯" : " "}{" "}
              </Text>
              <Text
                color={isSelected ? theme.sidebarItemSelected : theme.text}
                bold={isSelected}
              >
                {cmd.command}
              </Text>
              <Text color={theme.textDim}> — {cmd.description}</Text>
              <Text color={theme.textDim}> [{cmd.category}]</Text>
            </Box>
          );
        })}
      </Box>
      <Text color={theme.textDim}>
        {results.length} result{results.length !== 1 ? "s" : ""}
      </Text>
    </Box>
  );
}
