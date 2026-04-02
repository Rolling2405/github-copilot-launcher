/**
 * StatusBar — displays connection status, model, mode, and key hints.
 */
import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import type { ConnectionStatus } from "../hooks/useCopilot.js";
import type { Theme } from "../themes/themes.js";

interface StatusBarProps {
  status: ConnectionStatus;
  theme: Theme;
  sidebarVisible: boolean;
  errorMessage?: string;
}

function StatusIcon({ status, theme }: { status: ConnectionStatus; theme: Theme }) {
  switch (status) {
    case "connecting":
      return (
        <Text color={theme.warning}>
          <Spinner type="dots" /> Connecting...
        </Text>
      );
    case "connected":
      return <Text color={theme.success}>● Connected</Text>;
    case "error":
      return <Text color={theme.error}>✖ Error</Text>;
    case "disconnected":
      return <Text color={theme.textDim}>○ Disconnected</Text>;
  }
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
          copilot-tui
        </Text>
        <StatusIcon status={status} theme={theme} />
        {errorMessage && (
          <Text color={theme.error}>{errorMessage}</Text>
        )}
      </Box>
      <Box gap={2}>
        <Text color={theme.textDim}>
          Tab:panels  Ctrl+K:commands  Ctrl+B:sidebar{sidebarVisible ? "(on)" : "(off)"}  Ctrl+T:theme
        </Text>
      </Box>
    </Box>
  );
}
