import { Command } from './Command';

const PLAIN_KEYS: Record<string, Command> = {
  ArrowLeft: Command.GoEarlier,
  ArrowRight: Command.GoLater,
  Enter: Command.Follow,
  ArrowUp: Command.PreviousEntry,
  ArrowDown: Command.NextEntry,
  Home: Command.FirstEntry,
  End: Command.LastEntry,
  Backspace: Command.Back,
  ' ': Command.Summary,
  d: Command.Description,
  t: Command.Tags,
  l: Command.Location,
  p: Command.Path,
  i: Command.ReadDetails,
  '?': Command.Help,
};

/**
 * Maps key presses to commands. Lists are switched with Ctrl+Arrow on Windows
 * and Option+Arrow on macOS, where Ctrl+Arrow switches desktops (DES-KEY-003).
 */
export class KeyBindings {
  readonly isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);

  /** The name of the key held to switch lists, for keyboard help. */
  get listModifierName(): string {
    return this.isMac ? 'Option' : 'Ctrl';
  }

  commandFor(event: KeyboardEvent): Command | undefined {
    if (event.metaKey) {
      return undefined;
    }
    const listModifier = this.isMac ? event.altKey : event.ctrlKey;
    const otherModifier = this.isMac ? event.ctrlKey : event.altKey;
    if (otherModifier) {
      return undefined;
    }
    if (listModifier) {
      if (event.key === 'ArrowLeft') return Command.PreviousList;
      if (event.key === 'ArrowRight') return Command.NextList;
      return undefined;
    }
    // Question mark needs Shift on most layouts, so Shift is allowed through.
    return PLAIN_KEYS[event.key.length === 1 ? event.key.toLowerCase() : event.key];
  }
}
