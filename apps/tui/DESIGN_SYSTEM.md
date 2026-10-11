# t0code terminal design system

t0code is a workspace for long coding sessions. The conversation is the primary
surface; navigation, agent activity, and controls support it. Use restrained
chrome, readable code, and visible state changes.

The system takes inspiration from [Carbon's semantic color roles and layering](https://www.carbondesignsystem.com/building-blocks/foundations/color/overview).
It uses native OpenTUI components and terminal cells, with no browser styling dependencies.

## Foundations

- **Color:** `theme.ts` owns semantic colors for dark, light, and Terminal Match.
  Slate canvas (#16181d), recessed navigation (#111318), raised panels (#1e2128),
  reading text (#edf0f7), secondary text (#b0b8c8), and focus blue (#82aaff)
  define the dark workspace. Light mode has independently tuned content,
  attachments, code, diff, and status colors.
- **Typography:** inherit the user's terminal font. Bold identifies the main
  heading; normal text carries content; muted text carries supporting context.
  Use sentence case. Do not depend on font size or a custom font for hierarchy.
- **Spacing:** `TUI_METRICS` in `designSystem.ts` defines one-cell inline gaps,
  two-cell panel gutters, and three-cell section spacing. Dense controls stay
  one row tall. Content determines height; long text must wrap or truncate.
- **Layers:** sidebar is recessed, conversation sits on the canvas, composer and
  menus are raised. Borders separate regions or show focus, never decorate text.
- **State:** blue identifies focus and selection, green success, amber attention,
  red failure. Always accompany state color with an icon or text.

## Components

`controlColors` resolves disabled, primary, selected, hover, and resting states
for shared icon and toolbar controls. Disabled takes precedence over every
other state. Primary action text uses its dedicated contrast token. Bare
controls retain hover feedback.

`syntaxColors` supplies semantic syntax colors to Markdown, code blocks, and
diffs. Never embed a dark-only hex value in a syntax renderer.

`WorkspaceWelcome` covers connecting, no project, and empty conversation states.
It explains the next action without submitting a prompt or changing a draft.

Existing `Badge`, `SectionLabel`, `SidebarRow`, and `PopupRow` use semantic
theme colors. New controls should use the same tokens and state precedence.

## Layout and interaction

Keep the conversation above the composer. Preserve the user's scroll position
and existing streaming behavior. The sidebar is 34 columns; existing responsive
rules collapse it when the conversation would have too little room. Introductions
remain in the scroll area so short terminals can still reach the composer.

Respect existing keyboard bindings and mouse handlers. Do not add animation
for decoration or change agent/network behavior to achieve a visual effect.

## Verification

`designSystem.test.ts` checks 4.5:1 contrast for reading text, code syntax,
attachment labels, and primary buttons in the built-in themes, plus disabled
control precedence. Terminal Match honors terminal-supplied colors, so its
contrast depends on the user's palette.

Run `bun fmt`, `bun lint`, `bun typecheck`, and
`bun run test --filter=@maria_rcks/t1code`. Use OpenTUI's test renderer to inspect
narrow and wide terminal frames; browser screenshots do not validate terminal layout.
