# t0code

Terminal-first coding-agent client with an OpenTUI UI.

## Run from this repo

```bash
bun install
bun dev:tui
```

Requires Bun `>=1.3.9`.

Linux notes:

- t0code follows XDG defaults on Linux:
  `XDG_CONFIG_HOME/t1code` for prefs, `XDG_STATE_HOME/t1code` for logs and image state, and `XDG_DATA_HOME/t1code` for app data.
- Opening links uses desktop helpers such as `xdg-open` or `gio open`.
- Clipboard image paste works with `wl-paste` on Wayland or `xclip` on X11.

## What you get

- Native-feeling terminal UI built on OpenTUI
- Bundled server and web client for local use
- Codex-first workflow, plus Claude, Cursor, and OpenCode

## Source

- Repo: https://github.com/codealisha99/t0code
- Issues: https://github.com/codealisha99/t0code/issues
