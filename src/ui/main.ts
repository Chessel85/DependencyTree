import sample from '../../data/sample.json';
import bumpSound from '../../sounds/bump.wav';
import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { DatasetReader, DatasetRecord } from '../core/data/DatasetReader';
import { DateFormatter } from '../core/dates/DateFormatter';
import { DateShortener } from '../core/dates/DateShortener';
import { HistoricDate } from '../core/dates/HistoricDate';
import { ListSetBuilder } from '../core/navigation/ListSetBuilder';
import { NavigationState } from '../core/navigation/NavigationState';
import { EntryCard } from './EntryCard';
import { HelpDialog } from './HelpDialog';
import { KeyBindings } from './KeyBindings';
import { LiveAnnouncer } from './LiveAnnouncer';
import { SoundPlayer } from './SoundPlayer';
import { TreeNavigator } from './TreeNavigator';

const START_ID = 'iphone';

function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`The page has no element with id "${id}".`);
  }
  return element as T;
}

const dataset = new DatasetReader().read(sample as DatasetRecord);
const start = dataset.find(START_ID);
if (!start) {
  throw new Error(`The sample has no entry with id "${START_ID}".`);
}

const words = new AnnouncementBuilder(new DateFormatter(), new DateShortener(HistoricDate.fromJsDate(new Date())));
const keys = new KeyBindings();
const state = new NavigationState(new ListSetBuilder(dataset), start);

// The help dialog returns focus to the navigator, which needs the dialog,
// so the navigator is reached through this variable.
let navigator: TreeNavigator;
const help = new HelpDialog(byId('help'), byId('help-content'), byId('help-close'), keys.listModifierName, () =>
  navigator.focusList(),
);
byId('help-open').addEventListener('click', () => help.open());

navigator = new TreeNavigator(
  byId('entry-card'),
  byId('relationship-tabs'),
  byId('relationship-panel'),
  new EntryCard(byId('entry-name'), byId('entry-summary'), byId('entry-description'), words),
  state,
  keys,
  words,
  new LiveAnnouncer(byId('announcer')),
  new SoundPlayer(bumpSound),
  help,
);
navigator.start();
