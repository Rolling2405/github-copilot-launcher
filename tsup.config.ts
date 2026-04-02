import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.tsx"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  // node-pty is a native module — must not be bundled
  external: ["node-pty"],
  // React JSX transform
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
