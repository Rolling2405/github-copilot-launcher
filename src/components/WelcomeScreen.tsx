/**
 * WelcomeScreen — shown on first launch with quick-start tips.
 */
import React from "react";
import { Box, Text } from "ink";
import type { Theme } from "../themes/themes.js";

interface WelcomeScreenProps {
  theme: Theme;
}

export function WelcomeScreen({ theme }: WelcomeScreenProps) {
  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingX={4}
      paddingY={2}
    >
      <Text bold color={theme.sidebarHeader}>
        ╔══════════════════════════════════════════════════╗
      </Text>
      <Text bold color={theme.sidebarHeader}>
        ║     GitHub Copilot Launcher 🚀                  ║
      </Text>
      <Text bold color={theme.sidebarHeader}>
        ╚══════════════════════════════════════════════════╝
      </Text>

      <Box marginTop={1} flexDirection="column">
        <Text color={theme.text}>
          A visual command menu for GitHub Copilot CLI.
        </Text>
        <Text color={theme.text}>
          Browse all commands, pick one, and copilot launches natively.
        </Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text bold color={theme.sidebarItemSelected}>
          Quick Start:
        </Text>
        <Text color={theme.text}>
          • Browse commands in the sidebar (left panel)
        </Text>
        <Text color={theme.text}>
          • Press Ctrl+K to search all commands
        </Text>
        <Text color={theme.text}>
          • Press Enter to launch copilot
        </Text>
        <Text color={theme.text}>
          • When copilot exits, this menu returns
        </Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text bold color={theme.sidebarItemSelected}>
          Keyboard Shortcuts:
        </Text>
        <Text color={theme.text}>
          Tab         Cycle panels (sidebar → chat → input)
        </Text>
        <Text color={theme.text}>
          Ctrl+1/2/3  Jump to sidebar / chat / input
        </Text>
        <Text color={theme.text}>
          Ctrl+K      Open command palette
        </Text>
        <Text color={theme.text}>
          Ctrl+B/F2   Toggle sidebar
        </Text>
        <Text color={theme.text}>
          Ctrl+T      Switch dark/light theme
        </Text>
        <Text color={theme.text}>
          1-9         Quick-select sidebar commands
        </Text>
      </Box>

      <Box marginTop={1}>
        <Text color={theme.textDim}>
          Press any key to dismiss this welcome screen...
        </Text>
      </Box>
    </Box>
  );
}
