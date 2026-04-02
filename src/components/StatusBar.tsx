/**
 * StatusBar — displays key hints and branding.
 */
import React from "react";
import { Box, Text } from "ink";
import type { Theme } from "../themes/themes.js";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface StatusBarProps {
  status: ConnectionStatus;
  theme: Theme;
  sidebarVisible: boolean;
  errorMessage?: string;
}

export function StatusBar({
  status,
  theme,
  sidebarVisible,
  errorMessage,
}: StatusBarProps) {
  return (
    <Box paddingX={1} justifyContent="space-between">
      <Box gap={2}>
        <Text bold color={theme.sidebarHeader}>
          copilot-launcher
        </Text>
        <Text color={theme.textDim}>
          {status === "disconnected" ? "Ready to launch" : status}
        </Text>
        {errorMessage && (
          <Text color={theme.error}>{errorMessage}</Text>
        )}
      </Box>
      <Box gap={2}>
        <Text color={theme.textDim}>
          Tab:panels  Ctrl+K:commands  Ctrl+B:sidebar{sidebarVisible ? "(on)" : "(off)"}  Ctrl+T:theme  Enter:launch
        </Text>
      </Box>
    </Box>
  );
}
