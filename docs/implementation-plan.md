---
title: "Dependency Tree — Implementation Plan"
subtitle: "Version 0.23 (draft)"
date: 2026-10-21
lang: en-GB
---

# About this document

This plan sets out how Dependency Tree will be delivered, in phases. Each phase ends with something that can be tested with NVDA and VoiceOver. Requirement IDs refer to the Requirements Catalogue.

# Guiding principles

1. **Accessibility first.** The keyboard navigator is built and tested before the visual view.
2. **Start small, then use real data.** The first prototype uses a handful of made-up moments. Hand-made periods come next. Wikidata data follows once navigation feels right, still within Phase 0. (DEC-30, REQ-CONT-001, REQ-CONT-007)
3. **Single-responsibility classes, one per file.** Each unit can be read and changed on its own. Files are split by responsibility, not by line count. (REQ-CODE-002, DES-CODE-001, DES-CODE-002)
4. **Core logic is independent.** The data model, date handling and navigation state are plain TypeScript with no browser or Cloudflare code, so they can be unit tested on their own. (DES-CODE-003, DES-CODE-004)
5. **One source of truth.** The navigator and the visual view both read from one navigation state. (REQ-VIEW-006)

# Ways of working

- Claude writes the code. You direct it, test it with NVDA, and decide. (REQ-CODE-001)
- Work proceeds in small steps, each ending with something you can try or a test that passes.
- After each discussion round, needs and constraints are added to the Requirements Catalogue, and design decisions to the Functional Specification. Every decision is logged in the catalogue's Decision Log. Numbered items, questions and decisions are written as tables, which are easier to move through with a screen reader. Then the HTML is rebuilt with docs/build.ps1.

# Architecture (Proposed)

## Overall shape

- **Import tool**: a TypeScript script run from the command line. It reads Wikidata, applies the curation file, validates the data, and writes a seed file and a report.
- **Cloudflare Worker**: serves the front end and a read-only JSON API, backed by the D1 database. (DES-TECH-002, DES-TECH-003)
- **Front end**: plain TypeScript classes built with Vite, with no UI framework. (DES-TECH-004)
- **Core library**: shared by all three parts above.

## Proposed module layout

Each folder below lists a few of the small class files it would contain. One class per file. (DES-CODE-002)

| Folder | File | Responsibility |
|--------------|--------------|--------------------------------------------------|
| src/core/model | Entry.ts | The base class for moments and periods. |
| src/core/model | Moment.ts | A moment, with its date and location. |
| src/core/model | Period.ts | A period, with its start moment, end moment and the moments between. |
| src/core/model | OngoingStop.ts | The "Ongoing" stop at the end of a period still going on. |
| src/core/model | Dependency.ts | One "depends on" link between two moments. |
| src/core/dates | HistoricDate.ts | A date with its precision and approximate flag, including BCE dates. |
| src/core/dates | DateRange.ts | The earliest and latest possible times of a date (DES-DATE-003). |
| src/core/dates | DateFormatter.ts | Written and spoken forms. |
| src/core/dates | DateShortener.ts | Shortens dates in lists by how far they are from today (DES-DATE-006). |
| src/core/data | Dataset.ts | Every entry, with lookups, and which periods an entry is part of. |
| src/core/data | DatasetReader.ts | Reads a dataset file. |
| src/core/graph | DependencyGraph.ts | Lookups in both directions. |
| src/core/graph | CycleDetector.ts | Finds circular dependencies. |
| src/core/graph | PredatesRule.ts | Checks that a dependency came first (DES-REL-002). |
| src/core/graph | ContainmentRule.ts | Checks that everything in a period falls within it (DES-DATA-006). |
| src/core/navigation | NavigationState.ts | The current entry, the active list, and the highlighted entry in each list. |
| src/core/navigation | RelationshipList.ts | One list on an entry, such as Dependencies or a period's Moments. |
| src/core/navigation | ListSetBuilder.ts | Decides which lists an entry shows, including a period's stops and "Ongoing" (DES-NAV-002, DES-NAV-009, DES-NAV-012). |
| src/core/navigation | StepResult.ts | What Left Arrow or Right Arrow did: moved, bumped, or nothing. |
| src/core/navigation | PathHistory.ts | For Backspace and P. |
| src/core/find | EntryIndex.ts | Every entry in alphabetical order, with a simple search (DES-FIND-004). |
| src/core/announce | AnnouncementBuilder.ts | The wording of announcements. |
| src/core/announce | Verbosity.ts | The verbosity levels. |
| src/import | main.ts | Runs the import: npm run import. |
| src/import | WikidataSource.ts | What the import needs from Wikidata. |
| src/import | WikidataClient.ts | Queries the live Wikidata service. |
| src/import | WikidataCache.ts | Keeps Wikidata's answers in a folder (DES-IMP-010). |
| src/import | WikidataEntity.ts | One Wikidata item, with its label and best statements. |
| src/import | WikidataDateReader.ts | Turns a Wikidata date into a dataset date (DES-IMP-006). |
| src/import | PropertyMapper.ts | Which properties are read, and what each means (DES-IMP-005). |
| src/import | Curation.ts | The curation file (DES-IMP-004). |
| src/import | EntryDates.ts | Whether an item is a moment or a period, and its dates, from the curation file or Wikidata. |
| src/import | PeriodAnchors.ts | Finds the real moments each period starts and ends with (DES-IMP-008). |
| src/import | ImportedGraph.ts | The items gathered, and the links read between them. |
| src/import | SeedCollector.ts | Gathers the seed set (DES-IMP-002). |
| src/import | CurationApplier.ts | Applies the curation file's links and members. |
| src/import | LabelLookup.ts | Labels of locations and tags. |
| src/import | RecordMaker.ts | Turns the gathered items into a dataset (DES-IMP-008). |
| src/import | ImportValidator.ts | Leaves out what breaks the rules (DES-IMP-007). |
| src/import | ImportLog.ts | What each stage found, for the report. |
| src/import | ImportReport.ts | Writes the report. |
| src/import | SeedWriter.ts | Writes the seed file. |
| src/worker | Router.ts | Routes API requests. |
| src/worker | EntryRepository.ts | D1 queries. |
| src/worker | Handlers | One file per API endpoint. |
| src/ui | main.ts | Starts the front end. |
| src/ui | TreeNavigator.ts | Connects the navigation state to the card, and handles keystrokes. |
| src/ui | EntryCard.ts | The heading, summary box and description box. |
| src/ui | SoundPlayer.ts | Plays the bump sound (DES-ANN-011). |
| src/ui | RelationshipTabs.ts | The tab control. |
| src/ui | RelationshipListBox.ts | The list box of the active list's entries. |
| src/ui | KeyBindings.ts | Keystrokes per platform. |
| src/ui | LiveAnnouncer.ts | Speaks the information keys' answers through a live region. |
| src/ui | Command.ts | The commands a key can give. |
| src/ui | IndexDialog.ts | The index, with its search box and list (DES-FIND-004). |
| src/ui | FilterPanel.ts | The Filters region. |
| src/ui | HelpDialog.ts | Keyboard help. |
| src/ui/visual | GraphLayout.ts | The shapes a layout produces: boxes, links, period bars and axis labels. |
| src/ui/visual | LayoutEngine.ts | What every layout provides. |
| src/ui/visual | TimeScale.ts | One way of spacing entries along the time axis. |
| src/ui/visual | LinearTimeScale.ts | Linear time (DES-VIEW-005). |
| src/ui/visual | TickPicker.ts | Chooses the year labels on the time axis. |
| src/ui/visual | NodeBoxMaker.ts | What a moment's box says, and how big it is. |
| src/ui/visual | ElkArranger.ts | Runs the ELK layered layout (DES-VIEW-010). |
| src/ui/visual | LanePlacer.ts | Puts boxes into rows so that they don't overlap. |
| src/ui/visual | TimeScaleLayout.ts | Places moments by a time scale, in the layered layout's rows. |
| src/ui/visual | LayeredLayout.ts | The layered layout as ELK gives it. |
| src/ui/visual | GraphLayoutAssembler.ts | Adds the time axis and the band of period bars. |
| src/ui/visual | GraphView.ts | Draws a layout in SVG, and marks the current and highlighted entries. |
| src/ui/visual | LayoutChooser.ts | The Layout drop-down list (DES-VIEW-011). |
| src/ui/visual | VisualView.ts | Keeps the drawing in step with the navigator (REQ-VIEW-006). |
| src/ui/visual | ZoomController.ts | Zoom and pan. |
| tests | | Tests that mirror the src folders above. |

The architecture document required by DES-CODE-006 will be kept in step with this layout.

# Phases

## Phase 0: Foundations and navigation prototype

**Goal:** Prove the navigation model with NVDA, first on a small made-up sample and then on real Wikidata data. Phase 0 runs on your own computer. Nothing is published yet.

### Step 0A: A handful of made-up moments (built)

1. Set up the public GitHub repository and the TypeScript project, with tests. Add the AGPL-3.0 licence. (DES-TECH-006, REQ-CONT-005)
2. Build the moment, the dates module and the dependency rules, with unit tests. (DES-DATA-001, DES-DATE items, DES-REL-002)
3. Write a sample file by hand: about 10 moments, joined by dependencies.
4. Build the navigation state and the announcement wording for moments, with unit tests. (DES-NAV-001 to DES-NAV-008, DES-KEY items for moments, DES-ANN items)
5. Build a web page showing the current moment as a card of standard controls, with keyboard help. It reads the sample file, and runs on your computer. (DES-SR-006)
6. You test it with NVDA. We refine the keystrokes and wording.

### Step 0B: Hand-made periods (built, in testing)

1. Add periods to the model, with the containment rule and the stops within a period. (DES-DATA-001 to DES-DATA-006, DES-NAV-009 to DES-NAV-011)
2. Add two or three periods to the sample file by hand, including one inside another and one still going on.
3. Add the period keystrokes, announcements and the bump sound, which you supply. (DES-NAV-012, DES-KEY-010, DES-KEY-011, DES-ANN-008, DES-ANN-009, DES-ANN-011)
4. You test it with NVDA, and we refine it.

### Step 0D: Visual layout experiment (built, layouts chosen)

This comes after Step 0B and before Step 0C (DEC-42). Friends of the product owner may review it.

1. Draw the sample as a tree, with time running left to right and links joining the boxes. (DES-VIEW-001, DES-VIEW-002)
2. Try the three ways of spacing entries in time, and a layered layout that keeps links out of boxes. (DES-VIEW-005, DES-VIEW-010)
3. Claude checks each version by taking screenshots and looking at them. Then friends review the versions, and Be My Eyes can be used too.
4. Keep the best layout, or offer a choice.

What Claude saw in the screenshots of the first build (DEC-52):

| Layout | What it showed |
|--------------|--------------------------------------------------|
| Linear time | The 150 years before the transistor are mostly empty, and the moments from 1947 to 2007 crowd into the right-hand third, needing about eight rows. It is easy to see what came when. |
| Compressed time | Gives the recent decades more room, but with only two centuries of data the gain is small. Where boxes nearly overlap, the curved links double back on themselves. |
| Time slots | Even and compact, with no crowding. But a long link, such as the battery to the lithium-ion battery, runs across most of the page, and the size of the gaps in time is lost. |
| Layered, links around boxes | The tidiest. Links never pass through boxes, and gather neatly into the iPhone. Distance shows only order. |

Outcome (DEC-53): linear time and layered are both kept, and the user switches between them with the Layout list. Compressed time and time slots are dropped.

### Step 0C: Real data from Wikidata (built, in review)

What the first import found (DEC-54):

| Finding | What it means |
|--------------|--------------------------------------------------|
| The iPhone series, Q2766, has no date and only two "uses" links, to two file transfer protocols. | The root is the original iPhone, Q621427, instead. |
| With only the properties first proposed, the walk from the iPhone stopped at 3 entries. | The original iPhone lists its battery, display, touchscreen, sensors and operating system with hardware properties, so those were added (DES-IMP-005). |
| Of the 18 hand-made links in the sample, Wikidata has only 4. | The other 14 are added by the curation file, together with the sample's periods and their members. |
| ChatGPT "uses" its own later models, GPT-4 to GPT-5.2, and GPT-3 lists its many sizes as parts. | The walk now skips items that came after everything linking to them (DES-IMP-002), which also drops iPhone OS 1 to 3. One "GPT-3" item duplicating the series is excluded. |
| The roots of ChatGPT, such as reinforcement learning from human feedback, have no dates. | Two were dated from Wikipedia (DEC-56). ChatGPT's chain is short: GPT-3, Proximal Policy Optimization and transfer learning. |
| Many technology items have no date at all, such as the lithium-ion battery, the liquid-crystal display, the touchscreen and the microphone. | The curation file dates these from the sample, and six more from Wikipedia (DEC-56). |
| "Has cause" and "has effect" are well used for history. From the Cold War and the dissolution of the Soviet Union, they bring in the World Wars, treaties and Soviet politics. | About half the seed set is political history. It is kept (DEC-55). |
| Treaties, conferences, programmes and wars have start and end times, so Wikidata gives them as periods. But it seldom lists an event on both dates: it doesn't list Japan's surrender among World War II's events, for example. | Only 4 of about 40 found real start and end moments by themselves. The curation file names them for the Cold War, both World Wars and their main theatres, and the interwar period, giving 11 periods. The rest, such as treaties and summits, are moments (DES-IMP-008). |

The latest import, from the iPhone and ChatGPT, gave 95 entries: 84 moments and 11 periods, with 65 dependencies. The report is data/import-report.md.

The index (DES-FIND-004), planned for Phase 1 as part of search, was brought forward so that any entry can be chosen as the place to start (DEC-59).


1. Build the import tool. Gather a seed set of 50 to 200 entries from the iPhone backwards, and produce a coverage report showing how many links each Wikidata property contributed. (DES-IMP-002, DES-IMP-003, DES-IMP-007)
2. Review with a sample of the data how well it works to use a period's start date where Wikidata links to a whole period. (DES-REL-007)
3. Review the report together and fill the gaps through the curation file. (DES-IMP-004)
4. Point the page at the seed file instead of the sample file, and test with NVDA in Firefox and Chrome, and with VoiceOver in Safari.

**Exit criteria:** You can explore the seed set comfortably by keyboard, and the DES-NAV, DES-KEY and DES-ANN items are agreed.

## Phase 1: Read-only release on Cloudflare

**Goal:** A hosted, usable, read-only application. (REQ-CONT-006)

- Create the D1 database schema and a seed loader.
- Build the Worker API: get an entry with its lists, search, and list tags.
- Add entry web addresses and Backspace history. (REQ-DATA-008, REQ-NAV-004)
- Add search and filters. (DES-FIND items)
- Build the visual view: time axis, zoom and neighbourhood drawing, in step with the navigator, showing periods, their moments and uncertain dates. (DES-VIEW items)
- Add automated accessibility checks with axe-core, and write a manual screen reader test script. (REQ-ACC-012)
- Deploy to Cloudflare.

**Exit criteria:** All "Must" requirements outside the Later items are met.

## Phase 2: Larger dataset

- Broaden the import beyond one working example, through several seed starting points.
- Optimise performance towards REQ-NFR-003.

## Phase 3: Community contribution

- Accounts, accessible editing forms, revision history and moderation. (REQ-CONT-002, REQ-CONT-003)
- Contributions are published under the agreed licences: CC0 for data and AGPL-3.0 for code. (REQ-CONT-005)

## Phase 4: Richer relationships

- Add the "Preceded by", "Followed by", "Influenced by" and "Influenced" lists. (REQ-NAV-016, REQ-REL-004, REQ-REL-005)

# Testing strategy

- **Unit tests** for all core classes: dates, graph rules, navigation state and announcement wording. (DES-CODE-005)
- **Import tests** using saved Wikidata responses, so the tests don't need the internet.
- **Keyboard tests** in a browser, using scripted key presses that check the announced text.
- **Automated accessibility checks** with axe-core.
- **Manual screen reader testing** with NVDA and Firefox, NVDA and Chrome, and VoiceOver and Safari. (REQ-ACC-012)

# Risks

| Risk | Mitigation | References |
|----------------|--------------------------------------------------|--------------|
| Wikidata's dependency coverage may be thin. The candidate properties are used unevenly. | Measure coverage in Phase 0, and use the curation file to fill the gaps. | DES-IMP-003, DES-IMP-004 |
| Wikidata's dates may conflict with the predates rule. | Rough dates are compared as ranges, and the import reports and leaves out problem links instead of failing. | DES-REL-002, DES-IMP-007 |
| Wikidata often links to a whole period rather than to a moment within it. | Use the period's start moment, review a sample in Phase 0, and correct links in the curation file. | DES-REL-007, DES-IMP-008 |
| elkjs, the layout library, is published under the Eclipse Public License 2.0. Combining it with AGPL-3.0 code in one published bundle may not be allowed. | Check before Phase 1. If it is a problem, load it as a separate file, or write a simpler layered layout. | DES-VIEW-010, REQ-CONT-005 |
| Screen readers may behave differently. Focus mode handling and Mac keystrokes differ between NVDA and VoiceOver. | Test on both early, in Phase 0. | DES-SR-006, DES-SR-002 |

# Change history

- **0.23**, 23 October 2026: No change to the plan; version kept in step with the other documents.
- **0.22**, 23 October 2026: No change to the plan; version kept in step with the other documents.
- **0.21**, 23 October 2026: Periods start and end with real moments, found by the new PeriodAnchors class or named in the curation file (DEC-60).
- **0.20**, 23 October 2026: Added ChatGPT as a second root, the walk skipping later items, and the index, brought forward from Phase 1 (DEC-55 to DEC-59).
- **0.19**, 23 October 2026: Step 0C is built, and in review. Added the import classes to the module layout, and what the first import found (DEC-54).
- **0.18**, 23 October 2026: Step 0D keeps linear time and layered, with a choice (DEC-53). Removed the two dropped layouts from the module layout.
- **0.17**, 23 October 2026: Step 0D is built, and in review. Added the visual classes to the module layout, the screenshot findings, and a licence risk for elkjs.
- **0.16**, 23 October 2026: Left Arrow and Right Arrow no longer move within a period (DEC-51), so StepResult has one fewer outcome.
- **0.14**, 21 October 2026: Renamed the "D'oh" sound to the bump sound.
- **0.13**, 21 October 2026: Steps 0A and 0B are built. Updated the module layout to match the code.
- **0.11**, 21 October 2026: Step 0A now builds a card of standard controls. Updated the module layout to match.
- **0.10**, 21 October 2026: Step 0D comes after Step 0B (DEC-42).
- **0.9**, 21 October 2026: Added Step 0D, the visual layout experiment. Its timing is Q-22.
- **0.8**, 21 October 2026: Step 0A is built and in testing. Step 0B now uses the Part of list on periods.
- **0.7**, 21 October 2026: The repository is public on GitHub. Step 0B now settles Q-21.
- **0.6**, 21 October 2026: Split Phase 0 into three steps: made-up moments, then hand-made periods, then Wikidata (DEC-30). Added the AGPL-3.0 licence to the setup step.
- **0.5**, 21 October 2026: Put the module layout and risks in tables. Added the PeriodStops class, a Phase 0 review of links to whole periods, and a new risk. Removed "Caters for" from Phase 4.
- **0.4**, 21 October 2026: No change to the phases. The model now has periods defined by start and end moments, and dependencies between moments only (DEC-17).
- **0.3**, 20 October 2026: Updated the references to the new DES items. Removed the file size check. Added the moment, period and date range classes.
- **0.2**, 20 October 2026: Added the Cloudflare and TypeScript architecture, the module layout, and Wikidata in Phase 0. Added a risks section.
- **0.1**, 20 October 2026: first draft.
