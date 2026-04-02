/**
 * useCopilot hook — React hook wrapping the copilot process.
 * Provides state management for the chat interface.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { CopilotProcess } from "../copilot/process.js";
import { OutputParser, type ChatMessage } from "../copilot/parser.js";

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface CopilotState {
  messages: ChatMessage[];
  streamingBuffer: string;
  status: ConnectionStatus;
  errorMessage: string;
}

export function useCopilot(cwd: string = process.cwd()) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingBuffer, setStreamingBuffer] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [errorMessage, setErrorMessage] = useState("");

  const processRef = useRef<CopilotProcess | null>(null);
  const parserRef = useRef(new OutputParser());
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start copilot process
  useEffect(() => {
    const copilot = new CopilotProcess();
    processRef.current = copilot;
    setStatus("connecting");

    copilot.on("data", (data: string) => {
      setStatus("connected");
      parserRef.current.feed(data);
      setStreamingBuffer(parserRef.current.getCleanBuffer());

      // Auto-flush after a pause in output (message complete)
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
      }
      flushTimerRef.current = setTimeout(() => {
        const msg = parserRef.current.flush();
        if (msg) {
          setMessages((prev) => [...prev, msg]);
          setStreamingBuffer("");
        }
      }, 300);
    });

    copilot.on("exit", (code: number) => {
      setStatus("disconnected");
      if (code !== 0) {
        setErrorMessage(`Copilot exited with code ${code}`);
      }
    });

    copilot.on("error", (err: Error) => {
      setStatus("error");
      setErrorMessage(err.message);
    });

    copilot.start(cwd);

    return () => {
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
      copilot.stop();
    };
  }, [cwd]);

  // Send a message to copilot
  const sendMessage = useCallback((text: string) => {
    if (!processRef.current?.isRunning) return;

    // Create user message for display
    const userMsg = parserRef.current.createUserMessage(text);
    setMessages((prev) => [...prev, userMsg]);

    // Send to copilot's stdin with Enter
    processRef.current.write(text + "\r");
  }, []);

  // Send raw input (for Ctrl+C, etc.)
  const sendRaw = useCallback((data: string) => {
    processRef.current?.write(data);
  }, []);

  return {
    messages,
    streamingBuffer,
    status,
    errorMessage,
    sendMessage,
    sendRaw,
  };
}
