import sample from '../../data/sample.json';
import bumpSound from '../../sounds/bump.wav';
import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { DatasetReader, DatasetRecord } from '../core/data/DatasetReader';
import { DateFormatter } from '../core/dates/DateFormatter';
import { DateShortener } from '../core/dates/DateShortener';
import { HistoricDate } from '../core/dates/HistoricDate';
import { Entry } from '../core/model/Entry';
import { Moment } from '../core/model/Moment';
import { ListSetBuilder } from '../core/navigation/ListSetBuilder';
import { NavigationState } from '../core/navigation/NavigationState';
import { EntryCard } from './EntryCard';
import { HelpDialog } from './HelpDialog';
import { KeyBindings } from './KeyBindings';
import { LiveAnnouncer } from './LiveAnnouncer';
import { SoundPlayer } from './SoundPlayer';
import { TreeNavigator } from './TreeNavigator';
import { CompressedTimeScale } from './visual/CompressedTimeScale';
import { ElkArranger } from './visual/ElkArranger';
import { GraphView } from './visual/GraphView';
import { LayeredLayout } from './visual/LayeredLayout';
import { LayoutChooser } from './visual/LayoutChooser';
import { LayoutEngine } from './visual/LayoutEngine';
import { LinearTimeScale } from './visual/LinearTimeScale';
import { NodeBoxMaker } from './visual/NodeBoxMaker';
import { SlotTimeScale } from './visual/SlotTimeScale';
import { TimeScaleLayout } from './visual/TimeScaleLayout';
import { VisualView } from './visual/VisualView';

const START_ID = 'iphone';
const MARGIN = 24;
const ROW_GAP = 16;

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

// The visual view and its layout experiment (Step 0D).
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
    'Distance across the page is proportional to the years between moments. Long gaps show honestly, but recent moments crowd together and need more rows.',
    new LinearTimeScale(earliest, now, 12, MARGIN),
    moments, dependencies, arranger, maker, rowHeight,
  ),
  new TimeScaleLayout(
    'compressed',
    'Compressed time',
    'Recent years get more room than distant ones, on a logarithmic scale. Look at whether the crowding eases, and whether the uneven spacing of the years is confusing.',
    new CompressedTimeScale(earliest, now, 2000, MARGIN),
    moments, dependencies, arranger, maker, rowHeight,
  ),
  new TimeScaleLayout(
    'slots',
    'Time slots',
    'Each moment has its own column in date order, however far apart the dates are. Compact and even, but the size of the gaps in time is lost.',
    new SlotTimeScale(moments, widthOf, ROW_GAP, MARGIN),
    moments, dependencies, arranger, maker, rowHeight,
  ),
  new LayeredLayout(
    'layered',
    'Layered, links around boxes',
    'Columns in date order, placed to reduce crossing links, with links routed around the boxes in straight segments. Moments from the same year can share a column.',
    moments, arranger, maker, MARGIN,
  ),
];
const visual = new VisualView(new GraphView(byId('visual-view'), (entry) => navigator.goTo(entry)), state, dataset.periods);
navigator.watch(() => visual.update());
new LayoutChooser(byId('layout-choice'), byId('layout-note'), engines, (engine) => void visual.show(engine)).start();
