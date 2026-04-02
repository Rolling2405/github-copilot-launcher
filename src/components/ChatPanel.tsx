/**
 * ChatPanel — renders the conversation between user and copilot.
 * Shows messages with role indicators, code blocks, and streaming buffer.
 * Supports syntax-highlighted code blocks and collapsible tool calls.
 */
import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { ChatMessage, CodeBlock } from "../copilot/parser.js";
import type { Theme } from "../themes/themes.js";

interface ChatPanelProps {
  messages: ChatMessage[];
  streamingBuffer: string;
  focused: boolean;
  theme: Theme;
  scrollOffset?: number;
}

function CodeBlockDisplay({ block, theme }: { block: CodeBlock; theme: Theme }) {
  return (
    <Box flexDirection="column" marginY={1} paddingX={1} borderStyle="single" borderColor={theme.codeBlock}>
      <Text color={theme.textDim} dimColor>
        {block.language ? `── ${block.language} ──` : "── code ──"}
      </Text>
      <Text color={theme.text}>{block.code}</Text>
    </Box>
  );
}

function ToolCallDisplay({
  message,
  theme,
}: {
  message: ChatMessage;
  theme: Theme;
}) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={theme.warning}>
        ⚙️ Tool Call {collapsed ? "(collapsed — Enter to expand)" : "(expanded)"}
      </Text>
      {!collapsed && (
        <Box marginLeft={3}>
          <Text color={theme.textDim} wrap="wrap">
            {message.content}
          </Text>
        </Box>
      )}
    </Box>
  );
}

function DiffLine({ line, theme }: { line: string; theme: Theme }) {
  if (line.startsWith("+")) {
    return <Text color={theme.success}>{line}</Text>;
  }
  if (line.startsWith("-")) {
    return <Text color={theme.error}>{line}</Text>;
  }
  return <Text color={theme.textDim}>{line}</Text>;
}

function MessageBubble({ message, theme }: { message: ChatMessage; theme: Theme }) {
  const isUser = message.role === "user";
  const roleLabel = isUser ? "You" : "Copilot";
  const roleColor = isUser ? theme.userMessage : theme.copilotMessage;

  // Check if this looks like a tool call
  if (message.isToolCall) {
    return <ToolCallDisplay message={message} theme={theme} />;
  }

  // Check if content contains diff-like output
  const isDiff = message.content.includes("@@") && 
    (message.content.includes("+") || message.content.includes("-"));

  // Split content to render code blocks separately
  const parts = message.content.split(/```\w*\n[\s\S]*?```/);
  const codeBlocks = message.codeBlocks;

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={roleColor}>
        {isUser ? "👤" : "🤖"} {roleLabel}
      </Text>
      <Box marginLeft={3} flexDirection="column">
        {codeBlocks.length === 0 ? (
          isDiff ? (
            // Render diff lines with color
            <Box flexDirection="column">
              {message.content.split("\n").map((line, i) => (
                <DiffLine key={i} line={line} theme={theme} />
              ))}
            </Box>
          ) : (
            <Text color={theme.text} wrap="wrap">
              {message.content}
            </Text>
          )
        ) : (
          // Interleave text and code blocks
          <>
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                {part.trim() && (
                  <Text color={theme.text} wrap="wrap">
                    {part.trim()}
                  </Text>
                )}
                {codeBlocks[i] && (
                  <CodeBlockDisplay block={codeBlocks[i]} theme={theme} />
                )}
              </React.Fragment>
            ))}
          </>
        )}
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
          💬 Chat {focused ? "(focused — ↑↓ to scroll)" : ""}
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
