import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { NavigationState } from '../core/navigation/NavigationState';
import { Command } from './Command';
import { HelpDialog } from './HelpDialog';
import { KeyBindings } from './KeyBindings';
import { LiveAnnouncer } from './LiveAnnouncer';
import { MomentCard } from './MomentCard';
import { RelationshipListBox } from './RelationshipListBox';
import { RelationshipTabs } from './RelationshipTabs';

/**
 * Connects the navigation state to the card of standard controls. Keystrokes
 * in the list move around the tree; Backspace and question mark also work
 * anywhere in the card. A move that isn't possible changes nothing and says
 * nothing (DES-NAV-008).
 */
export class TreeNavigator {
  private readonly tabs: RelationshipTabs;
  private readonly listBox: RelationshipListBox;

  constructor(
    cardElement: HTMLElement,
    tablist: HTMLElement,
    panel: HTMLElement,
    private readonly card: MomentCard,
    private readonly state: NavigationState,
    private readonly keys: KeyBindings,
    private readonly words: AnnouncementBuilder,
    private readonly announcer: LiveAnnouncer,
    private readonly help: HelpDialog,
  ) {
    this.tabs = new RelationshipTabs(tablist, panel.id, words, (index) => this.chooseTab(index));
    this.listBox = new RelationshipListBox(panel, words, (index) => this.chooseEntry(index));
    cardElement.addEventListener('keydown', (event) => this.onKey(event));
  }

  /** Shows the starting moment and puts focus in its list. */
  start(): void {
    this.showMoment();
    this.focusList();
  }

  focusList(): void {
    // Focus moves after the current key has been handled, so the screen
    // reader deals with the two separately (DES-SR-004).
    window.setTimeout(() => this.listBox.focus(), 0);
  }

  private onKey(event: KeyboardEvent): void {
    const command = this.keys.commandFor(event);
    if (command === undefined) {
      return;
    }
    const inList = event.target instanceof Node && this.listBox.contains(event.target);
    if (!inList && command !== Command.Back && command !== Command.Help) {
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
      case Command.Help: return this.help.open();
    }
  }

  /** Clicking an entry goes to it. */
  private chooseEntry(index: number): void {
    this.state.activeList.restoreHighlight(index);
    this.moved(this.state.follow());
  }

  /** Choosing a tab shows its list, leaving focus on the tab. */
  private chooseTab(index: number): void {
    if (this.state.selectList(index)) {
      this.tabs.select(index);
      this.listBox.build(this.state);
    }
  }

  private moved(succeeded: boolean): void {
    if (succeeded) {
      this.showMoment();
      this.focusList();
    }
  }

  private highlighted(succeeded: boolean): void {
    if (succeeded) {
      this.listBox.highlight(this.state.activeList.highlightedIndex);
      this.listBox.focus();
    }
  }

  private switched(succeeded: boolean): void {
    if (succeeded) {
      this.tabs.select(this.state.activeListIndex);
      this.listBox.build(this.state);
      this.focusList();
    }
  }

  private showMoment(): void {
    this.card.show(this.state.currentMoment);
    this.tabs.build(this.state);
    this.listBox.build(this.state);
  }
}
