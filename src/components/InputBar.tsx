/**
 * InputBar — text input that sends messages to copilot.
 * Supports command history with up/down arrows.
 */
import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import type { Theme } from "../themes/themes.js";

interface InputBarProps {
  onSubmit: (text: string) => void;
  focused: boolean;
  theme: Theme;
  placeholder?: string;
}

export function InputBar({
  onSubmit,
  focused,
  theme,
  placeholder = "Type a message or /command... (Ctrl+K for command palette)",
}: InputBarProps) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleSubmit = useCallback(
    (text: string) => {
      onSubmit(text);
      if (text.trim().length > 0) {
        setHistory((prev) => [text, ...prev]);
      }
      setHistoryIndex(-1);
      setValue("");
    },
    [onSubmit]
  );

  // History navigation with up/down arrows (only when focused)
  useInput(
    (_input, key) => {
      if (!focused) return;

      if (key.upArrow && history.length > 0) {
        const newIdx = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(newIdx);
        setValue(history[newIdx]!);
      }
      if (key.downArrow) {
        if (historyIndex <= 0) {
          setHistoryIndex(-1);
          setValue("");
        } else {
          const newIdx = historyIndex - 1;
          setHistoryIndex(newIdx);
          setValue(history[newIdx]!);
        }
      }
    }
  );

  const borderColor = focused ? theme.borderFocused : theme.border;

  return (
    <Box
      borderStyle="round"
      borderColor={borderColor}
      paddingX={1}
    >
      <Text color={theme.userMessage} bold>
        {"❯ "}
      </Text>
      {focused ? (
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder={placeholder}
        />
      ) : (
        <Text color={theme.placeholder}>
          {value || placeholder}
        </Text>
      )}
    </Box>
  );
}
