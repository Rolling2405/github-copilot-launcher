/**
 * ChatPanel — renders the conversation between user and copilot.
 * Shows messages with role indicators, code blocks, and streaming buffer.
 */
import React from "react";
import { Box, Text } from "ink";
import type { ChatMessage } from "../copilot/parser.js";
import type { Theme } from "../themes/themes.js";

interface ChatPanelProps {
  messages: ChatMessage[];
  streamingBuffer: string;
  focused: boolean;
  theme: Theme;
  scrollOffset?: number;
}

function MessageBubble({ message, theme }: { message: ChatMessage; theme: Theme }) {
  const isUser = message.role === "user";
  const roleLabel = isUser ? "You" : "Copilot";
  const roleColor = isUser ? theme.userMessage : theme.copilotMessage;

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={roleColor}>
        {isUser ? "👤" : "🤖"} {roleLabel}
      </Text>
      <Box marginLeft={3}>
        <Text color={theme.text} wrap="wrap">
          {message.content}
        </Text>
      </Box>
    </Box>
  );
}

export function ChatPanel({
  messages,
  streamingBuffer,
  focused,
  theme,
}: ChatPanelProps) {
  const borderColor = focused ? theme.borderFocused : theme.border;

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      borderStyle="round"
      borderColor={borderColor}
      paddingX={1}
    >
      <Box marginBottom={1}>
        <Text bold color={theme.sidebarHeader}>
          💬 Chat {focused ? "(focused)" : ""}
        </Text>
      </Box>

      {messages.length === 0 && !streamingBuffer && (
        <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
          <Text color={theme.textDim}>Waiting for copilot to start...</Text>
          <Text color={theme.textDim}>Type a message below to begin.</Text>
        </Box>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} theme={theme} />
      ))}

      {streamingBuffer && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color={theme.copilotMessage}>
            🤖 Copilot
          </Text>
          <Box marginLeft={3}>
            <Text color={theme.textDim} wrap="wrap">
              {streamingBuffer}▋
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
