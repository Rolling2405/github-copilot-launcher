/**
 * Theme definitions for GitHub Copilot Launcher
 */

export interface Theme {
  name: string;
  border: string;
  borderFocused: string;
  text: string;
  textDim: string;
  textBold: string;
  background: string;
  userMessage: string;
  copilotMessage: string;
  statusBar: string;
  statusBarText: string;
  sidebarHeader: string;
  sidebarItem: string;
  sidebarItemSelected: string;
  inputBorder: string;
  inputText: string;
  placeholder: string;
  error: string;
  success: string;
  warning: string;
  codeBlock: string;
  spinner: string;
}

export const darkTheme: Theme = {
  name: "dark",
  border: "gray",
  borderFocused: "cyan",
  text: "white",
  textDim: "gray",
  textBold: "whiteBright",
  background: "",
  userMessage: "greenBright",
  copilotMessage: "white",
  statusBar: "bgBlue",
  statusBarText: "white",
  sidebarHeader: "cyanBright",
  sidebarItem: "white",
  sidebarItemSelected: "yellowBright",
  inputBorder: "gray",
  inputText: "white",
  placeholder: "gray",
  error: "redBright",
  success: "greenBright",
  warning: "yellowBright",
  codeBlock: "gray",
  spinner: "cyan",
};

export const lightTheme: Theme = {
  name: "light",
  border: "gray",
  borderFocused: "blue",
  text: "black",
  textDim: "gray",
  textBold: "black",
  background: "",
  userMessage: "green",
  copilotMessage: "black",
  statusBar: "bgBlue",
  statusBarText: "white",
  sidebarHeader: "blue",
  sidebarItem: "black",
  sidebarItemSelected: "magenta",
  inputBorder: "gray",
  inputText: "black",
  placeholder: "gray",
  error: "red",
  success: "green",
  warning: "yellow",
  codeBlock: "gray",
  spinner: "blue",
};
