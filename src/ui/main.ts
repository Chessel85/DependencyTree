import sample from '../../data/sample.json';
import seed from '../../data/seed.json';
import bumpSound from '../../sounds/bump.wav';
import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { DatasetReader, DatasetRecord } from '../core/data/DatasetReader';
import { DateFormatter } from '../core/dates/DateFormatter';
import { DateShortener } from '../core/dates/DateShortener';
import { EntryIndex } from '../core/find/EntryIndex';
import { HistoricDate } from '../core/dates/HistoricDate';
import { Entry } from '../core/model/Entry';
import { Moment } from '../core/model/Moment';
import { ListSetBuilder } from '../core/navigation/ListSetBuilder';
import { NavigationState } from '../core/navigation/NavigationState';
import { EntryCard } from './EntryCard';
import { HelpDialog } from './HelpDialog';
import { IndexDialog } from './IndexDialog';
import { KeyBindings } from './KeyBindings';
import { LiveAnnouncer } from './LiveAnnouncer';
import { SoundPlayer } from './SoundPlayer';
import { TreeNavigator } from './TreeNavigator';
import { ElkArranger } from './visual/ElkArranger';
import { GraphView } from './visual/GraphView';
import { LayeredLayout } from './visual/LayeredLayout';
import { LayoutChooser } from './visual/LayoutChooser';
import { LayoutEngine } from './visual/LayoutEngine';
import { LinearTimeScale } from './visual/LinearTimeScale';
import { NodeBoxMaker } from './visual/NodeBoxMaker';
import { TimeScaleLayout } from './visual/TimeScaleLayout';
import { VisualView } from './visual/VisualView';

const START_ID = 'iphone';
// ?data=seed opens the Wikidata seed set instead of the hand-made sample (Step 0C).
const DATA_PARAMETER = 'data';
const MARGIN = 24;
const ROW_GAP = 16;

function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`The page has no element with id "${id}".`);
  }
  return element as T;
}

const record = (new URLSearchParams(window.location.search).get(DATA_PARAMETER) === 'seed' ? seed : sample) as DatasetRecord;
const dataset = new DatasetReader().read(record);
const startId = record.start ?? START_ID;
const start = dataset.find(startId);
if (!start) {
  throw new Error(`The data has no entry with id "${startId}".`);
}

const today = HistoricDate.fromJsDate(new Date());
const formatter = new DateFormatter();
const shortener = new DateShortener(today);
const words = new AnnouncementBuilder(formatter, shortener);
const keys = new KeyBindings();
const state = new NavigationState(new ListSetBuilder(dataset), start);

// The help dialog returns focus to the navigator, which needs the dialog,
// so the navigator is reached through this variable.
let navigator: TreeNavigator;
const help = new HelpDialog(byId('help'), byId('help-content'), byId('help-close'), keys.listModifierName, () =>
  navigator.focusList(),
);
byId('help-open').addEventListener('click', () => help.open());

// The index of every entry, opened with slash or the Index button (DES-FIND-004).
const index = new IndexDialog(
  byId('index'),
  byId('index-search'),
  byId('index-count'),
  byId('index-list'),
  byId('index-close'),
  new EntryIndex([...dataset.graph.allMoments, ...dataset.periods]),
  words,
  (entry) => navigator.goTo(entry),
  () => navigator.focusList(),
);
byId('index-open').addEventListener('click', () => index.open());

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
  index,
);
navigator.start();

// The visual view, with a choice of two layouts (DES-VIEW-011).
const moments = dataset.graph.allMoments.sort(Entry.byDate);
const dependencies = dataset.graph.dependencies;
const maker = new NodeBoxMaker(formatter, shortener, today);
const widthOf = (moment: Moment) => maker.widthOf(moment);
const rowHeight = maker.height + ROW_GAP;
const arranger = new ElkArranger(moments, dependencies, widthOf, maker.height);
const earliest = moments[0].sortKey;
const now = today.range().earliest;
const engines: LayoutEngine[] = [
  new TimeScaleLayout(
    'linear',
    'Linear time',
    'Distance across the page is proportional to the years between moments, so long gaps in time show as long gaps.',
    new LinearTimeScale(earliest, now, 12, MARGIN),
    moments, dependencies, arranger, maker, rowHeight,
  ),
  new LayeredLayout(
    'layered',
    'Layered',
    'Moments in columns in date order, arranged so that links go around boxes and cross as little as possible. Distance across the page shows order, not time.',
    moments, arranger, maker, MARGIN,
  ),
];
const visual = new VisualView(new GraphView(byId('visual-view'), (entry) => navigator.goTo(entry)), state, dataset.periods);
navigator.watch(() => visual.update());
new LayoutChooser(byId('layout-choice'), byId('layout-note'), engines, (engine) => void visual.show(engine)).start();
