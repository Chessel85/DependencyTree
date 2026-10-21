import sample from '../../data/sample.json';
import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { DatasetReader, DatasetRecord } from '../core/data/DatasetReader';
import { DateFormatter } from '../core/dates/DateFormatter';
import { ListSetBuilder } from '../core/navigation/ListSetBuilder';
import { NavigationState } from '../core/navigation/NavigationState';
import { DetailsPanel } from './DetailsPanel';
import { HelpDialog } from './HelpDialog';
import { KeyBindings } from './KeyBindings';
import { LiveAnnouncer } from './LiveAnnouncer';
import { TreeNavigator } from './TreeNavigator';

const START_ID = 'iphone';

function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`The page has no element with id "${id}".`);
  }
  return element as T;
}

const graph = new DatasetReader().read(sample as DatasetRecord);
const start = graph.find(START_ID);
if (!start) {
  throw new Error(`The sample has no moment with id "${START_ID}".`);
}

const dates = new DateFormatter();
const keys = new KeyBindings();
const state = new NavigationState(new ListSetBuilder(graph), start);

// The help dialog returns focus to the navigator, which needs the dialog,
// so the navigator is reached through this variable.
let navigator: TreeNavigator;
const details = new DetailsPanel(byId('details'), byId('details-content'), dates);
const help = new HelpDialog(byId('help'), byId('help-content'), byId('help-close'), keys.listModifierName, () =>
  navigator.focus(),
);
navigator = new TreeNavigator(
  byId('navigator'),
  state,
  keys,
  new AnnouncementBuilder(dates),
  new LiveAnnouncer(byId('announcer')),
  details,
  help,
  dates,
);
navigator.start();
