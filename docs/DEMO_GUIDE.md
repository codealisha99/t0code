# Demo guide

## Start locally

Requirements: Bun `^1.3.9`, Node.js `^24.13.1`, Git, and one provider CLI. Codex is the default; install it and complete its own sign-in before launching t0code. No API key or `.env` is needed for the standard local demo.

```bash
git clone https://github.com/codealisha99/t0code.git
cd t0code
bun install
bun dev
```

Open the web URL printed by the runner (usually `http://localhost:5733`). The server is usually on `http://localhost:3773`. The dev runner can choose nearby free ports if those defaults are occupied; use the printed URL. Data is retained under `~/.t3` unless `T3CODE_HOME` is set. In development, the server automatically adds its working directory as a project with a starter thread; the dev runner launches it from `apps/server`, so add your intended repository with **Add project** for the demo.

## Walkthrough

1. Select **Add project** and choose the local Git repository you want to demonstrate; open its starter thread.
2. Check the provider selector shows an available Codex provider; choose another provider only if it is installed and authenticated.
3. Ask: **“Summarize this repository, then identify one small improvement and explain the files you would change.”**
4. Watch the assistant response and tool activity arrive; inspect the referenced files and any generated diff.
5. If time permits, send a second prompt while the first turn runs. It should queue and start after that turn finishes.
6. Review the project changes in the Git/diff controls. Do not accept or apply proposed edits unless you intend to change the demo repository.

Expected result: a real provider response grounded in the selected repository, streamed activity in the conversation, and reviewable tool/diff state when the provider makes changes. There is no seeded conversation or fake model response.

## 60-second pitch

“t0code is a local workspace for coding agents. It puts a provider-backed conversation next to the actual repository, with streamed tool activity, approvals, Git diffs, checkpoints, and terminals. A single local server owns provider sessions and persistence, while the web and terminal interfaces share a typed WebSocket contract. The desktop shell wraps the same web experience. It is an active early-stage project, so integrations and test coverage are still evolving.”

**Technical summary:** Bun/Turbo monorepo; Effect-based TypeScript server; event-sourced orchestration persisted in SQLite; typed WebSocket API; provider subprocesses including Codex app-server and ACP adapters; React/Vite web UI and OpenTUI client.

## Common demo failures

| Symptom                                             | Likely fix                                                                                                                                                       |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provider unavailable or sign-in prompt              | Install the provider CLI and finish its authentication in that CLI; restart t0code.                                                                              |
| Server/web port already occupied                    | Use the dev runner's printed URLs; it can select alternate ports.                                                                                                |
| Server reports a SQLite missing-column/schema error | Try a separate empty data directory with `T3CODE_HOME=/tmp/t0code-demo bun dev`. Keep the original data directory intact; it may need a migration investigation. |
| Browser opens but cannot connect                    | Keep the server process running and open the web URL printed by `bun dev`.                                                                                       |
| Project actions fail                                | Choose a readable local folder; install Git and check that the folder is a Git repository for Git-specific features.                                             |
| No release list on marketing page                   | It fetches the latest public GitHub release; check network access and whether the repository has a published release.                                            |

## Verification commands

```bash
bun fmt
bun lint
bun typecheck
bun run test
```

## Verified in this checkout

- `bun fmt`: passed.
- `bun lint`: passed with 12 existing warnings.
- `bun typecheck`: passed across all 11 packages (Effect suggestions remain).
- `TURBO_CONCURRENCY=1 bun run test`: failed: 751 passed, 17 failed, 5 skipped. The failures are in the server package, including ACP child-process exits, server test timeouts, and assertions. With parallel Turbo tasks, an additional ACP test timed out; serial execution passed that package.
- `bun dev` with an isolated `T3CODE_HOME` and telemetry disabled: server and Vite started, and the web workspace rendered in the preview browser with an auto-created project/thread. A provider prompt was not sent, so live model response is unverified.
- `bun dev` with this machine's existing default `~/.t3` data failed during startup with `SQLiteError: no such column: provider_instance_id`; preserve that data and use a separate data directory for a clean demo.

These are local environment results, not claims that all installations have the same failure. No provider usage was incurred for the verification.
