import sample from '../../data/sample.json';
import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { DatasetReader, DatasetRecord } from '../core/data/DatasetReader';
import { DateFormatter } from '../core/dates/DateFormatter';
import { ListSetBuilder } from '../core/navigation/ListSetBuilder';
import { NavigationState } from '../core/navigation/NavigationState';
import { HelpDialog } from './HelpDialog';
import { KeyBindings } from './KeyBindings';
import { LiveAnnouncer } from './LiveAnnouncer';
import { MomentCard } from './MomentCard';
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

const words = new AnnouncementBuilder(new DateFormatter());
const keys = new KeyBindings();
const state = new NavigationState(new ListSetBuilder(graph), start);

// The help dialog returns focus to the navigator, which needs the dialog,
// so the navigator is reached through this variable.
let navigator: TreeNavigator;
const help = new HelpDialog(byId('help'), byId('help-content'), byId('help-close'), keys.listModifierName, () =>
  navigator.focusList(),
);
byId('help-open').addEventListener('click', () => help.open());

navigator = new TreeNavigator(
  byId('moment-card'),
  byId('relationship-tabs'),
  byId('relationship-panel'),
  new MomentCard(byId('moment-name'), byId('moment-summary'), byId('moment-description'), words),
  state,
  keys,
  words,
  new LiveAnnouncer(byId('announcer')),
  help,
);
navigator.start();
