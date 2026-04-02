/**
 * Output parser — takes raw PTY output from copilot and extracts
 * structured data (messages, code blocks, tool calls, etc.)
 *
 * Copilot's output includes ANSI escape codes for colors and formatting.
 * We strip those for structured parsing but preserve them for display.
 */

export type MessageRole = "user" | "copilot" | "system" | "tool";

export interface CodeBlock {
  language: string;
  code: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  rawContent: string; // with ANSI codes for colored display
  codeBlocks: CodeBlock[];
  timestamp: Date;
  isToolCall?: boolean;
  isCollapsed?: boolean;
}

// Strip ANSI escape sequences
const ANSI_REGEX = /\x1b\[[0-9;]*[a-zA-Z]|\x1b\].*?(?:\x07|\x1b\\)|\x1b[()][0-9A-Z]|\x1b[>=<]|\x1b\[[\?]?[0-9;]*[hlrm]/g;

export function stripAnsi(text: string): string {
  return text.replace(ANSI_REGEX, "");
}

// Extract code blocks from text (```lang ... ```)
export function extractCodeBlocks(text: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || "text",
      code: match[2].trimEnd(),
    });
  }
  return blocks;
}

let messageCounter = 0;

/**
 * Parse a chunk of copilot output into displayable lines.
 * This is a streaming parser — it processes chunks as they arrive.
 */
export class OutputParser {
  private buffer = "";
  private messages: ChatMessage[] = [];

  /**
   * Feed raw PTY data into the parser
   */
  feed(data: string): void {
    this.buffer += data;
  }

  /**
   * Flush the current buffer as a copilot message
   */
  flush(): ChatMessage | null {
    if (this.buffer.trim().length === 0) {
      this.buffer = "";
      return null;
    }

    const raw = this.buffer;
    const clean = stripAnsi(raw);
    this.buffer = "";

    const msg: ChatMessage = {
      id: `msg-${++messageCounter}`,
      role: "copilot",
      content: clean,
      rawContent: raw,
      codeBlocks: extractCodeBlocks(clean),
      timestamp: new Date(),
      isToolCall: clean.includes("⚙") || clean.includes("Tool:") || clean.includes("Running"),
    };

    this.messages.push(msg);
    return msg;
  }

  /**
   * Create a user message (for display in chat)
   */
  createUserMessage(text: string): ChatMessage {
    const msg: ChatMessage = {
      id: `msg-${++messageCounter}`,
      role: "user",
      content: text,
      rawContent: text,
      codeBlocks: [],
      timestamp: new Date(),
    };
    this.messages.push(msg);
    return msg;
  }

  /**
   * Get all messages so far
   */
  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  /**
   * Get current buffer content (partial message being received)
   */
  getBuffer(): string {
    return this.buffer;
  }

  /**
   * Get clean (ANSI-stripped) buffer content
   */
  getCleanBuffer(): string {
    return stripAnsi(this.buffer);
  }
}
