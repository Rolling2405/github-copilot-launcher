/**
 * App — root component.
 *
 * Architecture: copilot-tui is a LAUNCHER + COMPANION.
 * We show the sidebar and command palette first, then hand off
 * to copilot with full terminal control. This avoids the
 * "TUI inside a TUI" conflict since copilot is itself a full-screen app.
 *
 * Flow:
 * 1. Show welcome screen → sidebar with all commands
 * 2. User browses/selects a command, or just presses Enter
 * 3. We cleanup Ink, spawn copilot in the foreground
 * 4. Copilot runs natively with full terminal control
 */
import React, { useState, useCallback } from "react";
import { Box, Text, useInput, useApp } from "ink";
import { Sidebar } from "./components/Sidebar.js";
import { StatusBar } from "./components/StatusBar.js";
import { CommandPalette } from "./components/CommandPalette.js";
import { WelcomeScreen } from "./components/WelcomeScreen.js";
import { InputBar } from "./components/InputBar.js";
import { useNavigation } from "./hooks/useNavigation.js";
import { useTheme } from "./hooks/useTheme.js";

interface AppProps {
  onLaunchCopilot: (initialCommand?: string) => void;
  onExit: () => void;
}

export function App({ onLaunchCopilot, onExit }: AppProps) {
  const { exit } = useApp();
  const { theme } = useTheme();
  const {
    focusedPanel,
    sidebarVisible,
    focusPanel,
    toggleSidebar,
    focusInput,
  } = useNavigation();

  const [showPalette, setShowPalette] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);

  // Handle command selection (from sidebar or palette)
  const handleSelectCommand = useCallback(
    (command: string) => {
      setSelectedCommand(command);
      setShowPalette(false);
      focusInput();
    },
    [focusInput]
  );

  // Launch copilot (with optional initial command)
  const handleLaunch = useCallback(
    (text: string) => {
      const cmd = text.trim() || selectedCommand || undefined;
      onLaunchCopilot(cmd);
    },
    [selectedCommand, onLaunchCopilot]
  );

  // Global key handlers
  useInput((input, key) => {
    // Dismiss welcome screen on any key
    if (showWelcome) {
      setShowWelcome(false);
      return;
    }

    // Ctrl+K to toggle command palette
    if (key.ctrl && input === "k") {
      setShowPalette((prev) => !prev);
      return;
    }

    // Ctrl+C or Ctrl+D to exit without launching copilot
    if (key.ctrl && (input === "c" || input === "d")) {
      onExit();
      return;
    }

    // Escape to close palette
    if (key.escape && showPalette) {
      setShowPalette(false);
      return;
    }

    // Enter on input panel with no text → launch copilot directly
    if (key.return && focusedPanel === "input") {
      // The TextInput onSubmit handles non-empty text.
      // This handles the empty-text case (just launch copilot).
      handleLaunch("");
      return;
    }
  });

  // Show welcome screen on first launch
  if (showWelcome) {
    return <WelcomeScreen theme={theme} />;
  }

  // Show command palette overlay
  if (showPalette) {
    return (
      <Box flexDirection="column" height="100%">
        <CommandPalette
          visible={showPalette}
          theme={theme}
          onSelect={handleSelectCommand}
          onClose={() => setShowPalette(false)}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      {/* Main content area: sidebar + info panel */}
      <Box flexGrow={1}>
        {sidebarVisible && (
          <Sidebar
            focused={focusedPanel === "sidebar"}
            theme={theme}
            onSelectCommand={handleSelectCommand}
            onRequestFocusInput={focusInput}
          />
        )}
        <Box
          flexDirection="column"
          flexGrow={1}
          borderStyle="round"
          borderColor={focusedPanel === "chat" ? theme.borderFocused : theme.border}
          paddingX={1}
        >
          <Text bold color={theme.sidebarHeader}>
            🚀 Ready to launch Copilot
          </Text>
          <Box marginTop={1} flexDirection="column">
            {selectedCommand ? (
              <>
                <Text color={theme.text}>
                  Selected command: <Text bold color={theme.sidebarItemSelected}>{selectedCommand}</Text>
                </Text>
                <Text color={theme.textDim}>
                  Press Enter to launch copilot with this command.
                </Text>
                <Text color={theme.textDim}>
                  Or type your own message below.
                </Text>
              </>
            ) : (
              <>
                <Text color={theme.text}>
                  Browse commands in the sidebar, or type a message below.
                </Text>
                <Text color={theme.text}>
                  Press Enter to launch copilot.
                </Text>
              </>
            )}
          </Box>
          <Box marginTop={1} flexDirection="column">
            <Text color={theme.textDim}>────────────────────────────────────</Text>
            <Text bold color={theme.sidebarHeader}>How it works:</Text>
            <Text color={theme.text}>
              1. Browse commands here (sidebar + Ctrl+K)
            </Text>
            <Text color={theme.text}>
              2. Pick one or type your own message
            </Text>
            <Text color={theme.text}>
              3. Press Enter → Copilot launches with full terminal control
            </Text>
            <Text color={theme.text}>
              4. When done, copilot-tui returns so you can pick another command
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Status bar */}
      <StatusBar
        status="disconnected"
        theme={theme}
        sidebarVisible={sidebarVisible}
      />

      {/* Input bar — Enter launches copilot */}
      <InputBar
        onSubmit={handleLaunch}
        focused={focusedPanel === "input"}
        theme={theme}
        placeholder={
          selectedCommand
            ? `Press Enter to launch with ${selectedCommand}, or type a different message...`
            : "Type a message for copilot, or press Enter to launch..."
        }
      />
    </Box>
  );
}
