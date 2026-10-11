import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  checks: {
    legacyCjs: false,
  },
  outDir: "dist",
  sourcemap: true,
  clean: true,
  noExternal: (id) =>
    id.startsWith("@t3tools/") ||
    id.startsWith("effect-acp/") ||
    id.startsWith("effect-codex-app-server/"),
  inlineOnly: false,
  banner: {
    js: "#!/usr/bin/env node\n",
  },
});
