/**
 * Navigation hook — manages panel focus with all 7 navigation methods:
 * 1. Tab to cycle panels
 * 2. Arrow keys within panels
 * 3. Mouse click (handled by components)
 * 4. Ctrl+1/2/3 to jump to panel
 * 5. Auto-focus input after sidebar selection
 * 6. Number keys in sidebar
 * 7. Scroll wheel (handled by components)
 */
import { useState, useCallback } from "react";
import { useInput } from "ink";

export type Panel = "sidebar" | "chat" | "input";

const PANEL_ORDER: Panel[] = ["sidebar", "chat", "input"];

export function useNavigation() {
  const [focusedPanel, setFocusedPanel] = useState<Panel>("input");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const focusPanel = useCallback((panel: Panel) => {
    setFocusedPanel(panel);
  }, []);

  const focusNext = useCallback(() => {
    setFocusedPanel((current) => {
      const visiblePanels = sidebarVisible
        ? PANEL_ORDER
        : PANEL_ORDER.filter((p) => p !== "sidebar");
      const idx = visiblePanels.indexOf(current);
      return visiblePanels[(idx + 1) % visiblePanels.length]!;
    });
  }, [sidebarVisible]);

  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => {
      if (prev) {
        // Sidebar is being hidden — if it was focused, move to input
        setFocusedPanel((current) =>
          current === "sidebar" ? "input" : current
        );
      }
      return !prev;
    });
  }, []);

  const focusInput = useCallback(() => {
    setFocusedPanel("input");
  }, []);

  // Keyboard navigation
  useInput((input, key) => {
    // Tab to cycle panels
    if (key.tab) {
      focusNext();
      return;
    }

    // Ctrl+1/2/3 to jump to panel
    if (key.ctrl) {
      if (input === "1" || input === "!") {
        if (sidebarVisible) focusPanel("sidebar");
        return;
      }
      if (input === "2" || input === "@") {
        focusPanel("chat");
        return;
      }
      if (input === "3" || input === "#") {
        focusPanel("input");
        return;
      }
      // Ctrl+B or F2 to toggle sidebar
      if (input === "b") {
        toggleSidebar();
        return;
      }
    }
  });

  return {
    focusedPanel,
    sidebarVisible,
    focusPanel,
    focusNext,
    toggleSidebar,
    focusInput,
  };
}
