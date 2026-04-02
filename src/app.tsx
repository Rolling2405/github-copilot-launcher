/**
 * App — root component that assembles all panels into the TUI layout.
 *
 * Layout:
 * ┌──────────┬────────────────────────┐
 * │ Sidebar  │ Chat Panel             │
 * │          │                        │
 * │          │                        │
 * ├──────────┴────────────────────────┤
 * │ Status Bar                        │
 * ├───────────────────────────────────┤
 * │ Input Bar                         │
 * └───────────────────────────────────┘
 */
import React, { useState, useCallback } from "react";
import { Box, useInput, useApp } from "ink";
import { ChatPanel } from "./components/ChatPanel.js";
import { InputBar } from "./components/InputBar.js";
import { Sidebar } from "./components/Sidebar.js";
import { StatusBar } from "./components/StatusBar.js";
import { CommandPalette } from "./components/CommandPalette.js";
import { WelcomeScreen } from "./components/WelcomeScreen.js";
import { useCopilot } from "./hooks/useCopilot.js";
import { useNavigation } from "./hooks/useNavigation.js";
import { useTheme } from "./hooks/useTheme.js";

export function App() {
  const { exit } = useApp();
  const { theme } = useTheme();
  const {
    focusedPanel,
    sidebarVisible,
    focusPanel,
    toggleSidebar,
    focusInput,
  } = useNavigation();

  const {
    messages,
    streamingBuffer,
    status,
    errorMessage,
    sendMessage,
    sendRaw,
  } = useCopilot();

  const [showPalette, setShowPalette] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [ctrlCCount, setCtrlCCount] = useState(0);

  // Handle command selection (from sidebar or palette)
  const handleSelectCommand = useCallback(
    (command: string) => {
      sendMessage(command);
      setShowPalette(false);
      focusInput();
    },
    [sendMessage, focusInput]
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

    // Ctrl+C handling: first clears input, second exits
    if (key.ctrl && input === "c") {
      if (ctrlCCount >= 1) {
        sendRaw("\x03");
        setTimeout(() => exit(), 100);
        return;
      }
      setCtrlCCount((prev) => prev + 1);
      setTimeout(() => setCtrlCCount(0), 1000);
      return;
    }

    // Ctrl+D to exit
    if (key.ctrl && input === "d") {
      sendRaw("\x04");
      setTimeout(() => exit(), 100);
      return;
    }

    // Escape to close palette
    if (key.escape && showPalette) {
      setShowPalette(false);
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
      {/* Main content area: sidebar + chat */}
      <Box flexGrow={1}>
        {sidebarVisible && (
          <Sidebar
            focused={focusedPanel === "sidebar"}
            theme={theme}
            onSelectCommand={handleSelectCommand}
            onRequestFocusInput={focusInput}
          />
        )}
        <ChatPanel
          messages={messages}
          streamingBuffer={streamingBuffer}
          focused={focusedPanel === "chat"}
          theme={theme}
        />
      </Box>

      {/* Status bar */}
      <StatusBar
        status={status}
        theme={theme}
        sidebarVisible={sidebarVisible}
        errorMessage={errorMessage}
      />

      {/* Input bar */}
      <InputBar
        onSubmit={sendMessage}
        focused={focusedPanel === "input"}
        theme={theme}
      />
    </Box>
  );
}
