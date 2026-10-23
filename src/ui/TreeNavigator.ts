import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { Entry } from '../core/model/Entry';
import { NavigationState } from '../core/navigation/NavigationState';
import { StepResult } from '../core/navigation/StepResult';
import { Command } from './Command';
import { EntryCard } from './EntryCard';
import { HelpDialog } from './HelpDialog';
import { IndexDialog } from './IndexDialog';
import { KeyBindings } from './KeyBindings';
import { LiveAnnouncer } from './LiveAnnouncer';
import { RelationshipListBox } from './RelationshipListBox';
import { RelationshipTabs } from './RelationshipTabs';
import { SoundPlayer } from './SoundPlayer';

/**
 * Connects the navigation state to the card of standard controls. Keystrokes
 * in the list move around the tree; Backspace and question mark also work
 * anywhere in the card, and so does slash, for the index. A move that isn't possible changes nothing and says
 * nothing (DES-NAV-008), except that Left Arrow or Right Arrow plays a sound
 * on a moment with nothing earlier or later (DES-ANN-011). Anything that
 * shows the same position, such as the visual view, can watch for changes.
 */
export class TreeNavigator {
  private readonly tabs: RelationshipTabs;
  private readonly listBox: RelationshipListBox;
  private readonly watchers: (() => void)[] = [];

  constructor(
    cardElement: HTMLElement,
    tablist: HTMLElement,
    panel: HTMLElement,
    private readonly card: EntryCard,
    private readonly state: NavigationState,
    private readonly keys: KeyBindings,
    private readonly words: AnnouncementBuilder,
    private readonly announcer: LiveAnnouncer,
    private readonly bump: SoundPlayer,
    private readonly help: HelpDialog,
    private readonly index: IndexDialog,
  ) {
    this.tabs = new RelationshipTabs(tablist, panel.id, words, (index) => this.chooseTab(index));
    this.listBox = new RelationshipListBox(panel, words, (index) => this.chooseEntry(index));
    cardElement.addEventListener('keydown', (event) => this.onKey(event));
  }

  /** Shows the starting entry and puts focus in its list. */
  start(): void {
    this.showEntry();
    this.focusList();
  }

  /** Calls `watcher` after every change to the current entry, the active list or its highlight. */
  watch(watcher: () => void): void {
    this.watchers.push(watcher);
  }

  /** Goes straight to an entry, for example one clicked in the visual view (DES-VIEW-008). */
  goTo(entry: Entry): void {
    this.moved(this.state.goTo(entry));
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
    if (!inList && command !== Command.Back && command !== Command.Help && command !== Command.Index) {
      return;
    }
    event.preventDefault();
    this.run(command);
  }

  private run(command: Command): void {
    const state = this.state;
    const list = state.activeList;
    const entry = state.currentEntry;
    switch (command) {
      case Command.GoEarlier: return this.stepped(state.stepEarlier());
      case Command.GoLater: return this.stepped(state.stepLater());
      case Command.Follow: return this.moved(state.follow());
      case Command.Back: return this.moved(state.goBack());
      case Command.PreviousEntry: return this.highlighted(list.moveBy(-1));
      case Command.NextEntry: return this.highlighted(list.moveBy(1));
      case Command.PreviousPage: return this.highlighted(list.movePage(-1));
      case Command.NextPage: return this.highlighted(list.movePage(1));
      case Command.FirstEntry: return this.highlighted(list.moveToFirst());
      case Command.LastEntry: return this.highlighted(list.moveToLast());
      case Command.PreviousList: return this.switched(state.switchList(-1));
      case Command.NextList: return this.switched(state.switchList(1));
      case Command.Summary: return this.announcer.say(this.words.summary(state));
      case Command.Description: return this.announcer.say(this.words.description(entry));
      case Command.Tags: return this.announcer.say(this.words.tags(entry));
      case Command.Location: return this.announcer.say(this.words.location(entry));
      case Command.Path: return this.announcer.say(this.words.path(state.path));
      case Command.Note: return this.announcer.say(this.words.note(list.highlightedLink));
      case Command.Help: return this.help.open();
      case Command.Index: return this.index.open();
    }
  }

  private stepped(result: StepResult): void {
    switch (result) {
      case StepResult.Moved: return this.moved(true);
      case StepResult.Bumped: return this.bump.play();
      case StepResult.Nothing: return;
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
      this.listBox.build(this.state, this.words.switchLabel(this.state));
      this.changed();
    }
  }

  private moved(succeeded: boolean): void {
    if (succeeded) {
      this.showEntry();
      this.focusList();
    }
  }

  private highlighted(succeeded: boolean): void {
    if (succeeded) {
      this.listBox.highlight(this.state.activeList.highlightedIndex);
      this.listBox.focus();
      this.changed();
    }
  }

  private switched(succeeded: boolean): void {
    if (succeeded) {
      this.tabs.select(this.state.activeListIndex);
      this.listBox.build(this.state, this.words.switchLabel(this.state));
      this.focusList();
      this.changed();
    }
  }

  private showEntry(): void {
    this.card.show(this.state.currentEntry);
    this.tabs.build(this.state);
    this.listBox.build(this.state, this.words.arrivalLabel(this.state));
    this.changed();
  }

  private changed(): void {
    this.card.showNote(this.state.activeList.highlightedLink);
    for (const watcher of this.watchers) {
      watcher();
    }
  }
}
