import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { DateFormatter } from '../core/dates/DateFormatter';
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
    private readonly dates: DateFormatter,
  ) {
    element.addEventListener('keydown', (event) => this.onKey(event));
  }

  /** Puts focus in the navigator and announces where the user is. */
  start(): void {
    this.refresh();
    this.element.focus();
    this.announcer.say(this.words.arrival(this.state));
  }

  focus(): void {
    this.element.focus();
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

  /** Visible text for sighted users. Hidden from screen readers, which hear the announcements instead. */
  private showStatus(): void {
    const moment = this.state.currentMoment;
    const list = this.state.activeList;
    const entry = list.highlighted;
    const status = document.createElement('div');
    status.setAttribute('aria-hidden', 'true');
    const title = document.createElement('p');
    title.textContent = `${moment.name}, ${this.dates.written(moment.date)}`;
    const listLine = document.createElement('p');
    const listName = document.createElement('span');
    listName.className = 'list-name';
    listName.textContent = `${list.kind}: `;
    listLine.append(
      listName,
      entry ? `${entry.name}, ${this.dates.written(entry.date)} (${list.position} of ${list.size})` : 'none',
    );
    status.append(title, listLine);
    this.element.replaceChildren(status);
  }
}
