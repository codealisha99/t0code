# TODO

## Done in product

- Thread archiving (orchestration + TUI/web archive views)
- Sidebar project/thread sort by latest activity
- Cursor and OpenCode selectable in the web (and TUI) provider picker
- Basic text follow-up queue while a turn is running (reliability gaps below)
- Submitting new messages scrolls to bottom
- Expired WebSocket requests are removed before a connection can send them
- Disposed transports reject new requests immediately; failed socket writes clean up pending requests
- TUI prompts preserve internal code indentation, repeated spaces, and blank lines

## MVP blockers, in priority order

These findings come from the current implementation, not a completed live-provider acceptance run.
The MVP target is a reliable project → thread → prompt → approval → streamed result → diff workflow,
including stop, resume, and reconnect in the TUI. Web and desktop share the same server and must
retain compatible behavior.

- [ ] **Preserve complete queued submissions.** `FollowUpQueueItem` in
      `packages/client-core/src/followUpQueue.ts` stores only text. Both
      `apps/tui/src/ui.tsx` and `apps/web/src/components/ChatView.tsx` clear composer content after
      queueing without storing image attachments in the queue. Snapshot attachments and submission
      settings at enqueue time; dispatch that snapshot without borrowing or clearing a newer draft.
      Verify image-only follow-ups, file mentions, terminal context, and model changes before delivery.
- [ ] **Acknowledge queue delivery and expose failure recovery.** Both clients remove queued items
      before calling their send handler. The TUI failure path removes the optimistic message and only
      shows “Send failed”; it does not restore the queued entry. Introduce shared delivery state with
      stable command/message IDs, remove only after server acceptance, and expose retry/cancel. Verify
      disconnect before dispatch, disconnect after acceptance, pending approvals, and repeated sends.
      An ambiguous transport failure must be reconciled against server state before retrying.
- [ ] **Make queue lifetime independent of the selected view.** Queues currently live in React
      component state and drain for the active thread. Move ownership out of the composer; define
      persistence and recovery so switching threads or restarting does not silently lose pending work.
      Verify FIFO ordering, inactive threads, archive/delete, and a restart with pending submissions.
- [ ] **Run and record a real Codex acceptance pass.** Unit coverage is not release evidence for
      provider authentication, approvals, streaming, interruption, session resume, or checkpoint diffs.
      Use a disposable project: send a code edit, resolve an approval, inspect its diff, stop a turn,
      send again, restart the server, and resume the same thread. Repeat with a temporary WebSocket
      outage and confirm history has neither missing nor duplicate messages. See `ARCHITECTURE.md`.

## Validation for this reliability pass

- Transport regression coverage: timed-out queued commands never transmit; active requests still
  transmit; disposal rejects timeout-free requests; immediate and queued socket write failures
  settle their requests; disconnected commands are not automatically replayed.
- Composer regression coverage: code formatting survives ordinary submission and image extraction;
  unresolved image paths retain their surrounding formatting.

## Still open

- [ ] Hosted desktop releases on `codealisha99/t0code` (marketing download page now points here)
