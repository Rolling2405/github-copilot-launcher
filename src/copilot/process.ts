/**
 * Copilot process manager — spawns and manages the real copilot CLI
 * as a PTY child process so it thinks it's in a real terminal.
 */
import * as pty from "node-pty";
import { EventEmitter } from "node:events";

export interface CopilotProcessEvents {
  data: (data: string) => void;
  exit: (code: number) => void;
  error: (err: Error) => void;
}

export class CopilotProcess extends EventEmitter {
  private ptyProcess: pty.IPty | null = null;
  private _isRunning = false;

  get isRunning(): boolean {
    return this._isRunning;
  }

  /**
   * Spawn the copilot CLI in a pseudo-terminal.
   * @param cwd Working directory for copilot
   * @param args Additional CLI args (e.g., ["--experimental"])
   */
  start(cwd: string = process.cwd(), args: string[] = []): void {
    if (this.ptyProcess) {
      throw new Error("Copilot process is already running");
    }

    const shell = process.platform === "win32" ? "copilot.exe" : "copilot";

    try {
      this.ptyProcess = pty.spawn(shell, args, {
        name: "xterm-256color",
        cols: Math.max(process.stdout.columns || 120, 80),
        rows: Math.max(process.stdout.rows || 40, 24),
        cwd,
        env: {
          ...process.env,
          // Tell copilot it's in a terminal with color support
          TERM: "xterm-256color",
          FORCE_COLOR: "1",
        },
      });

      this._isRunning = true;

      this.ptyProcess.onData((data: string) => {
        this.emit("data", data);
      });

      this.ptyProcess.onExit(({ exitCode }) => {
        this._isRunning = false;
        this.ptyProcess = null;
        this.emit("exit", exitCode);
      });
    } catch (err) {
      this._isRunning = false;
      this.emit("error", err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Send input to copilot's stdin (keystrokes, commands, etc.)
   */
  write(data: string): void {
    if (this.ptyProcess) {
      this.ptyProcess.write(data);
    }
  }

  /**
   * Resize the PTY (call when terminal window resizes)
   */
  resize(cols: number, rows: number): void {
    if (this.ptyProcess) {
      this.ptyProcess.resize(cols, rows);
    }
  }

  /**
   * Gracefully stop the copilot process
   */
  stop(): void {
    if (this.ptyProcess) {
      // Send Ctrl+C then Ctrl+D
      this.ptyProcess.write("\x03");
      setTimeout(() => {
        if (this.ptyProcess) {
          this.ptyProcess.write("\x04");
          setTimeout(() => {
            if (this.ptyProcess) {
              this.ptyProcess.kill();
              this.ptyProcess = null;
              this._isRunning = false;
            }
          }, 500);
        }
      }, 200);
    }
  }
}
