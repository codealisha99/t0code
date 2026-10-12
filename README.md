# t0code

t0code is a local coding-agent workspace. It connects a WebSocket server to a React web app, terminal UI, and optional Electron shell. Use installed coding-agent CLIs against a real project, with conversation history, tool activity, diffs, approvals, Git tools, and terminals.

## Quick start

Requirements: Bun `^1.3.9`, Node.js `^24.13.1`, Git, and at least one installed and authenticated provider CLI (Codex is the default).

```bash
git clone https://github.com/codealisha99/t0code.git
cd t0code
bun install
bun dev
```

Open the web URL printed by the dev runner (normally `http://localhost:5733`). The server listens on port `3773`. No `.env` file is required for a local demo; provider credentials are managed by each provider CLI. To use another shell, run `bun dev:tui` or `bun dev:desktop`.

## Checks

```bash
bun fmt
bun lint
bun typecheck
bun run test
```

## Guides

- [Project guide](docs/PROJECT_GUIDE.md): features, architecture, data flow, and project status.
- [Demo guide](docs/DEMO_GUIDE.md): setup, walkthrough, pitch, and troubleshooting.
- [API dependencies](docs/API_DEPENDENCIES.md): integrations, credentials, environment variables, and optional services.
