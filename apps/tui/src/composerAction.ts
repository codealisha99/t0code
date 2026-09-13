export type ComposerPrimaryAction = "send" | "stop" | "queue";

export function resolveComposerPrimaryAction(options: {
  activeThreadIsRunning: boolean;
  hasSendableContent: boolean;
}): ComposerPrimaryAction {
  if (options.activeThreadIsRunning && options.hasSendableContent) {
    return "queue";
  }
  if (options.activeThreadIsRunning) {
    return "stop";
  }
  return "send";
}
