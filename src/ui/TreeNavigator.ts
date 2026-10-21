import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { NavigationState } from '../core/navigation/NavigationState';
import { Command } from './Command';
import { DetailsPanel } from './DetailsPanel';
import { HelpDialog } from './HelpDialog';
import { KeyBindings } from './KeyBindings';
import { LiveAnnouncer } from './LiveAnnouncer';

/**
 * The keyboard navigator: a single focusable widget (DES-SR-001) that turns
 * key presses into navigation, speaks the result, and keeps the Details
 * region and its own visible text up to date. A move that isn't possible
 * changes nothing and says nothing (DES-NAV-008).
 */
export class TreeNavigator {
  constructor(
    private readonly element: HTMLElement,
    private readonly state: NavigationState,
    private readonly keys: KeyBindings,
    private readonly words: AnnouncementBuilder,
    private readonly announcer: LiveAnnouncer,
    private readonly details: DetailsPanel,
    private readonly help: HelpDialog,
  ) {
    element.addEventListener('keydown', (event) => this.onKey(event));
    // Whenever focus arrives, by any route, say where the user is.
    element.addEventListener('focus', () => this.announcer.say(this.words.arrival(this.state)));
    element.ownerDocument.addEventListener('keydown', (event) => this.onPageKey(event));
  }

  /**
   * Puts focus in the navigator and says where the user is. The focus event
   * says it too, but may not fire if the window isn't active yet; the
   * announcer collapses the two into one.
   */
  start(): void {
    this.refresh();
    this.focus();
    this.announcer.say(this.words.arrival(this.state));
  }

  /**
   * Focus moves on the next turn of the event loop, so the screen reader has
   * finished with the key that caused it before it sees the focus change.
   */
  focus(): void {
    window.setTimeout(() => this.element.focus(), 0);
  }

  /** Escape from anywhere else on the page, except a dialog, returns to the navigator (DES-KEY-008). */
  private onPageKey(event: KeyboardEvent): void {
    const target = event.target as Node | null;
    const inNavigator = target !== null && this.element.contains(target);
    const inDialog = target instanceof Element && target.closest('dialog') !== null;
    if (event.key === 'Escape' && !inNavigator && !inDialog) {
      event.preventDefault();
      this.focus();
    }
  }

  private onKey(event: KeyboardEvent): void {
    const command = this.keys.commandFor(event);
    if (command === undefined) {
      return;
    }
    event.preventDefault();
    this.run(command);
  }

  private run(command: Command): void {
    const state = this.state;
    const list = state.activeList;
    switch (command) {
      case Command.GoEarlier: return this.moved(state.goEarlier());
      case Command.GoLater: return this.moved(state.goLater());
      case Command.Follow: return this.moved(state.follow());
      case Command.Back: return this.moved(state.goBack());
      case Command.PreviousEntry: return this.highlighted(list.moveBy(-1));
      case Command.NextEntry: return this.highlighted(list.moveBy(1));
      case Command.FirstEntry: return this.highlighted(list.moveToFirst());
      case Command.LastEntry: return this.highlighted(list.moveToLast());
      case Command.PreviousList: return this.switched(state.switchList(-1));
      case Command.NextList: return this.switched(state.switchList(1));
      case Command.Summary: return this.announcer.say(this.words.summary(state));
      case Command.Description: return this.announcer.say(this.words.description(state.currentMoment));
      case Command.Tags: return this.announcer.say(this.words.tags(state.currentMoment));
      case Command.Location: return this.announcer.say(this.words.location(state.currentMoment));
      case Command.Path: return this.announcer.say(this.words.path(state.path));
      case Command.ReadDetails: return this.details.focus();
      case Command.Help: return this.help.open();
    }
  }

  private moved(succeeded: boolean): void {
    if (succeeded) {
      this.refresh();
      this.announcer.say(this.words.arrival(this.state));
    }
  }

  private highlighted(succeeded: boolean): void {
    if (succeeded) {
      this.showStatus();
      this.announcer.say(this.words.position(this.state.activeList));
    }
  }

  private switched(succeeded: boolean): void {
    if (succeeded) {
      this.showStatus();
      this.announcer.say(this.words.listSwitch(this.state.activeList));
    }
  }

  private refresh(): void {
    this.details.show(this.state);
    this.showStatus();
  }

  /**
   * The navigator's only content is one line giving the current position,
   * worded like the arrival announcement, so the screen reader's "read
   * current line" command (NVDA+Up Arrow) reads it (DES-SR-005). Sighted
   * users see the same line.
   */
  private showStatus(): void {
    const line = document.createElement('p');
    line.textContent = this.words.arrival(this.state);
    this.element.replaceChildren(line);
  }
}
