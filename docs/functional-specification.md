---
title: "Dependency Tree — Functional Specification"
subtitle: "Version 0.11 (draft)"
date: 2026-10-21
lang: en-GB
---

# About this document

This specification records the design of Dependency Tree: how it meets the requirements in the Requirements Catalogue.

Each design decision is a row in a table, with these columns:

| Column | Meaning |
|--------|---------|
| ID | For example DES-NAV-001. IDs are never reused. |
| Design | The design decision. |
| Status | Agreed: decided by the product owner, or by the analyst where the choice was delegated. Proposed: recommended by the analyst, awaiting a decision. |
| Satisfies | The requirement IDs the item meets. |

The text between the tables explains how they fit together and gives examples.

# Data model

## Moments and periods

There are two kinds of entry: moments and periods. A period is built from moments, and every dependency links one moment to another (DEC-17). Periods can sit inside larger periods (DEC-21).

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-DATA-001 | Every entry is either a **moment**, which has a single date, or a **period**. A period is defined by at least two moments: a **start moment** and an **end moment**. It can have any number of moments between them. A period's dates are the dates of its start and end moments.<br>Example: the Roman Republic is defined by its founding, c. 509 BCE, and its end, 27 BCE. The writing of the Twelve Tables, c. 450 BCE, is one of the moments between them. | Agreed | REQ-DATA-002 |
| DES-DATA-002 | A period that is still going on has a start moment but no end moment yet. Example: "People's Republic of China, 1949 to present". | Agreed | REQ-DATA-006 |
| DES-DATA-003 | A moment can belong to more than one period. A period can be part of a larger period. Example: Chinese civilisation contains the Tang dynasty. | Agreed | REQ-DATA-013, REQ-REL-003 |
| DES-DATA-004 | An invention or discovery is a moment on its own, not part of any period: the date it first came into being. It doesn't need an end date, because it continues to be available. Example: "Lithium-ion battery, 1991". | Proposed | REQ-DATA-002 |
| DES-DATA-005 | Every entry has a name, alternative names, a description, tags, sources, a stable identifier, an address-friendly name (for example "lithium-ion-battery"), and a Wikidata identifier if it was imported. | Proposed | REQ-DATA-001, REQ-DATA-003, REQ-DATA-007, REQ-DATA-008, REQ-DATA-012, REQ-CONT-004 |
| DES-DATA-006 | Everything in a period falls between its start and end moments, allowing for uncertainty in the dates. This includes the start and end moments of any smaller period inside it. Breaches are listed in the import report. | Agreed | REQ-DATA-013, REQ-REL-003, REQ-CONT-011 |
| DES-DATA-007 | A moment can have a location: a place name such as "Rome" or "China". | Agreed | REQ-DATA-009 |

## Dates

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-DATE-001 | Years are stored as signed astronomical years. 1 BCE is year 0, 2 BCE is year minus 1, and so on. This allows simple comparison and sorting. Users never see this form. | Proposed | REQ-DATA-004 |
| DES-DATE-002 | Each date has a precision. The possible precisions are day, month, year, decade, century, millennium, and multiples of ten thousand years and more for deep history. These are the same precisions that Wikidata uses. Each date also has an "approximate" flag. | Proposed | REQ-DATA-005 |
| DES-DATE-003 | Each date is treated as a range of possible times, from the earliest to the latest:<br>• "1991", with year precision, means any time in 1991.<br>• "19th century" means 1801 to 1900.<br>• "9 January 2007", with day precision, means that one day.<br>• An approximate date widens its range by one unit of its precision on either side. For example, "c. 1450", with year precision, means 1449 to 1451, and "c. 5th century BCE" means the 6th to the 4th century BCE. | Proposed | REQ-DATA-005, REQ-REL-009 |
| DES-DATE-004 | Dates are written and spoken in natural form. Examples:<br>• "9 January 2007"<br>• "1991"<br>• "c. 509 BCE", spoken as "around 509 BCE"<br>• "19th century"<br>• "509 BCE to 27 BCE", for a period<br>• "1949 to present", for a period that is still going on | Proposed | REQ-ANN-008 |
| DES-DATE-005 | A date can be in the future, for something planned. Example: "Los Angeles Olympic Games, 14 July 2028 to 30 July 2028". | Agreed | REQ-DATA-014 |

## Relationships

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-REL-001 | Only "depends on" is stored. "Enabled" is the same link read in the other direction. If the laptop depends on the battery, then the battery enabled the laptop. | Proposed | REQ-REL-001, REQ-REL-008 |
| DES-REL-002 | A dependency is rejected only if it **certainly** happened later than the moment that depends on it. In other words, it is rejected only if the earliest possible date of the dependency is after the latest possible date of the dependent. Where the date ranges overlap, the dependency is allowed.<br>Example: A, dated c. 1450, depends on B, dated only to the 15th century. B might have come first, so the dependency is allowed.<br>Example: something dated "1991" can't depend on something dated "9 January 2007". The dependency is rejected. | Agreed | REQ-REL-002, REQ-REL-009 |
| DES-REL-004 | Containment ("part of") is separate from dependency. It follows DES-DATA-006, not the predates rule. | Proposed | REQ-REL-003 |
| DES-REL-005 | Circular dependencies are detected when data is imported, and are listed in the report. | Proposed | REQ-REL-007 |
| DES-REL-006 | Dependencies are always between moments. Nothing depends on a period as a whole, and a period depends on nothing as a whole. Example: Roman law depends on the writing of the Twelve Tables, not on the Roman Republic. | Agreed | REQ-REL-011 |
| DES-REL-007 | Where source data links to a period rather than to a moment, the period's start moment is used. This is to be reviewed against a sample of real data in Phase 0. | Agreed | REQ-REL-009, REQ-REL-011 |

## Why we call it a tree

From any one moment, looking back through its dependencies, the structure branches out like a tree. That is what the product is named after. (REQ-VIS-005) Strictly, it is a web, because the same entry can be reached by more than one route. The user only ever deals with one entry at a time, so the web never has to be managed as a whole.

# Screens

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-SCR-001 | The main screen has three regions, each one a labelled landmark:<br>1. **Search**<br>2. **Filters**, which can be collapsed<br>3. **Tree**: the current moment's card (DES-SR-006), with the visual view around it<br>The Details region of earlier versions is replaced by the card. | Proposed | REQ-ACC-004, REQ-ACC-014 |
| DES-SCR-002 | Each entry has its own web address, for example /entry/lithium-ion-battery. Opening it shows the main screen with that entry current. | Proposed | REQ-DATA-008 |

# The tree navigator

The navigator behaves differently on a moment and on a period (DEC-19):

- **On a moment**, the user browses its lists, such as Dependencies and Enabled, and presses Enter to go to an entry in one of them.
- **On a period**, the user steps through its moments in date order with Left Arrow and Right Arrow, and presses Enter to go into one of them.

## Lists on a moment

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-NAV-001 | Each moment presents its relationships as a set of lists, shown as a standard tab control with the active list underneath (DES-SR-006). | Agreed | REQ-NAV-003 |
| DES-NAV-002 | The lists, in order:<br>1. **Dependencies**: what this moment needed. (Agreed)<br>2. **Part of**: the periods this moment belongs to. A moment can be part of more than one period.<br>3. **Enabled**: what this moment made possible.<br>More lists may be added later. Reading the lists from first to last runs from "before", through "around", to "after". | Agreed | REQ-NAV-003, REQ-NAV-023 |
| DES-NAV-003 | The Dependencies and Enabled lists are always present, even when empty. The Part of list is only present when it has entries. This means that moving between lists never stops on an empty list that tells the user nothing. | Proposed | REQ-NAV-003, REQ-ACC-015 |
| DES-NAV-004 | Each list remembers its highlighted entry. Until the user moves within the list, this is its first entry. | Agreed | REQ-NAV-001, REQ-NAV-002, REQ-ACC-015 |
| DES-NAV-005 | After moving to another moment, the active list is the kind of list the user just moved through, as long as the new moment has one. Otherwise, it is the Dependencies list.<br>• After going to a dependency, the Dependencies list is active.<br>• After going to an enabled entry, the Enabled list is active. | Agreed | REQ-ACC-015 |
| DES-NAV-006 | Entries in each list are sorted by date, oldest first. | Proposed | REQ-ACC-015 |

## Inside a period

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-NAV-009 | A period is presented as a row of stops in date order, from its start moment to its end moment. If the period is still going on, the last stop is "Ongoing", at today's date. | Agreed | REQ-NAV-023, REQ-NAV-024, REQ-DATA-006 |
| DES-NAV-010 | On arriving at a period from one of its moments, through the Part of list, that moment is highlighted. Otherwise, the start moment is highlighted. | Proposed | REQ-ACC-015 |
| DES-NAV-011 | A smaller period inside a larger one is a single stop, placed at the date of its start moment. Enter goes into it. | Proposed | REQ-NAV-023, REQ-REL-003 |
| DES-NAV-012 | A period that is part of a larger period has a Part of list, reached with Ctrl+Left Arrow and Ctrl+Right Arrow, as on a moment. So going up works the same way everywhere. (Agreed)<br>The period's stops count as its first list, called Moments. While Moments is active, Left Arrow and Right Arrow step through the stops, and Enter goes into the highlighted one. While Part of is active, Up Arrow and Down Arrow move through it, and Enter goes to the highlighted larger period. (Proposed) | Agreed in part | REQ-NAV-023, REQ-NAV-003 |

## Anywhere

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-NAV-007 | A path history records each entry visited, together with its active list and highlighted entries. Backspace steps back through it. | Agreed | REQ-NAV-004, REQ-NAV-006 |
| DES-NAV-008 | When a move isn't possible, nothing changes and nothing is announced (DES-ANN-007). | Agreed | REQ-NAV-015 |

## Keystrokes

These keystrokes apply while the navigator has focus.

### On a moment

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-KEY-001 | When the Dependencies list is active, Left Arrow goes to its highlighted entry, earlier in time. When the Enabled list is active, Right Arrow goes to its highlighted entry, later in time. Enter does the same. Because the active list follows the direction of travel (DES-NAV-005), the user can keep pressing the same arrow to walk through time, one key per step. | Agreed | REQ-NAV-001, REQ-NAV-002, REQ-ACC-015 |
| DES-KEY-002 | Up Arrow and Down Arrow move through the active list (Agreed). Home and End go to its first and last entry (Proposed). | Agreed in part | REQ-NAV-003 |
| DES-KEY-003 | Ctrl+Left Arrow and Ctrl+Right Arrow go to the previous and next list on Windows. Option+Left Arrow and Option+Right Arrow do the same on macOS, where Ctrl+Left Arrow and Ctrl+Right Arrow switch desktops. | Agreed | REQ-NAV-003, REQ-ACC-008 |
| DES-KEY-004 | Enter goes to the highlighted entry in the active list. | Agreed | REQ-NAV-001, REQ-NAV-002, REQ-NAV-023 |
| DES-KEY-013 | Left Arrow when the Dependencies list isn't active, and Right Arrow when the Enabled list isn't active, do nothing, silently. | Agreed | REQ-NAV-015 |

### On a period

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-KEY-010 | Left Arrow and Right Arrow move to the previous and next stop in the period (DES-NAV-009). Home and End go to the first and last stop (Proposed). | Agreed in part | REQ-NAV-024 |
| DES-KEY-011 | Enter goes into the highlighted moment or smaller period, which becomes the current entry. | Agreed | REQ-NAV-023 |

### Anywhere

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-KEY-005 | Backspace goes back one step along the path taken. | Agreed | REQ-NAV-004 |
| DES-KEY-006 | Information keys:<br>• Space: summary of the current entry<br>• D: description<br>• T: tags<br>• L: location<br>• P: the moments on the path taken, each named once, in date order from oldest to newest, without dates. Example: "Path, 3 moments: Electric battery, Telephone, iPhone." (Agreed) | Proposed | REQ-NAV-005, REQ-NAV-006, REQ-ACC-005 |
| DES-KEY-007 | Other keys:<br>• Slash (/): search<br>• F: filters<br>• Question mark (?): keyboard help<br>• V: cycle verbosity | Proposed | REQ-ACC-009, REQ-ACC-010 |
| DES-KEY-014 | Tab and Shift+Tab move between the parts of the card. On the tabs, Left Arrow, Right Arrow, Home and End choose a tab, as on any tab control. Backspace and question mark work anywhere in the card. The other keys in this section work in the list. | Agreed | REQ-ACC-007, REQ-NAV-003 |

## Announcements

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-ANN-001 | On arriving at a moment, focus enters its new list, and the screen reader reads the list's label and the highlighted entry. For example: "Telephone, 7 March 1876, Dependencies, list. Electric battery, March 1800, 1 of 2." An empty list's label ends with "none". The exact wording depends on the screen reader. | Proposed | REQ-ANN-007 |
| DES-ANN-002 | Moving within a list moves focus to the entry, which the screen reader reads with its position. For example: "Smartphone, 1994, 3 of 12." | Proposed | REQ-ANN-007 |
| DES-ANN-003 | Switching list moves focus into the new list, whose label and highlighted entry the screen reader reads. | Proposed | REQ-ANN-007 |
| DES-ANN-004 | There are three verbosity levels:<br>• Brief: names only<br>• Normal: as in the examples in this section (the default)<br>• Full: Normal, plus the first sentence of the description | Proposed | REQ-ACC-010 |
| DES-ANN-005 | When filters hide entries, the announcement includes the number hidden. Example: "Dependencies, 3, 2 hidden by filters." | Proposed | REQ-ANN-006 |
| DES-ANN-006 | A new announcement replaces any announcement that hasn't been spoken yet. | Proposed | REQ-ANN-004 |
| DES-ANN-007 | When there is nowhere to go, nothing is announced. The only exception is the sound at the ends of a period (DES-ANN-011). This is to be reviewed after testing, and spoken messages such as "No earlier entries" may be added if silence is confusing. | Agreed | REQ-NAV-015 |
| DES-ANN-008 | Arriving at a period announces its name, its dates, the number of moments, and the highlighted stop. Example: "Roman Republic, 509 BCE to 27 BCE, 6 moments. Start of the Roman Republic, around 509 BCE, 1 of 6." Moving between stops announces the stop's name, date and position. | Proposed | REQ-ANN-007 |
| DES-ANN-009 | Moving to the end of a period that is still going on announces "Ongoing". | Agreed | REQ-DATA-006 |
| DES-ANN-011 | When the user tries to step past the start or end of a period, a short "D'oh" sound plays, and nothing else changes. On a period that is still going on, the end is the "Ongoing" stop. The product owner will supply the sound as a .wav or .mp3 file. | Agreed | REQ-NAV-015, REQ-ANN-009 |

## Worked examples

The dates and counts in these examples are only illustrations. The words in quotes are what the user hears; the exact wording depends on the screen reader.

Moving between moments. The current entry is the lithium-ion battery. The user arrived from the laptop through the Dependencies list, so the Dependencies list is active (DES-NAV-005).

1. Ctrl+Right Arrow: "Enabled, 8. Laptop, 1981, 1 of 8."
2. Down Arrow twice: "Electric car, 1996, 3 of 8."
3. Right Arrow, or Enter: "Electric car, 1996. Enabled, 5." The Enabled list stays active, so pressing Right Arrow again carries on forward in time.
4. Backspace: "Lithium-ion battery, 1991. Enabled, 8." Back where the user was.

Moving into and through a period. The current entry is the writing of the Twelve Tables.

1. Ctrl+Right Arrow: "Part of, 1. Roman Republic, 509 BCE to 27 BCE, 1 of 1."
2. Enter: "Roman Republic, 509 BCE to 27 BCE, 6 moments. Twelve Tables, around 450 BCE, 2 of 6." The Twelve Tables is highlighted, because the user came from it (DES-NAV-010).
3. Left Arrow: "Start of the Roman Republic, around 509 BCE, 1 of 6."
4. Left Arrow again: the "D'oh" sound plays. The user is already at the start.
5. Right Arrow: "Twelve Tables, around 450 BCE, 2 of 6."
6. Enter: "Twelve Tables, around 450 BCE. Dependencies, 2." The user is on a moment again, and its lists work as before.

A period that is still going on. The current entry is the People's Republic of China, and the user is on its last moment.

1. Right Arrow: "Ongoing."
2. Right Arrow again: the "D'oh" sound plays.

## Screen reader integration

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-SR-006 | The current moment is shown as a card made of standard controls, so the screen reader's own commands work on every part of it, including "read current line" (NVDA+Up Arrow). In order:<br>1. A heading with the moment's name.<br>2. **Summary**: a read-only text box with the name, date and location on three lines.<br>3. **Description**: a read-only text box.<br>4. A tab control with one tab per list, showing its count, for example "Dependencies (2)".<br>5. A list box of the active list's entries, with focus on the highlighted entry.<br>Tab and Shift+Tab move between the parts. | Agreed | REQ-ACC-004, REQ-ACC-007, REQ-ACC-014, REQ-ACC-016 |
| DES-SR-002 | In VoiceOver, Quick Nav must be off for the arrow keys to reach the application. Keyboard help says so. | Proposed | REQ-ACC-003, REQ-ACC-008 |
| DES-SR-004 | Focus is moved after the key that caused it has finished, so the screen reader handles the two separately. | Proposed | REQ-ACC-011 |
| DES-SR-007 | The list box is rebuilt each time the moment or the tab changes, so the screen reader sees focus enter a new list and reads its label, which names the moment, its date and the list. | Proposed | REQ-ANN-007 |

# Visual presentation

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-VIEW-001 | The current entry is centred. Its dependencies are drawn to the left and the entries it enabled to the right. The highlighted entry is marked. | Proposed | REQ-VIEW-001, REQ-VIEW-002, REQ-VIEW-006 |
| DES-VIEW-002 | Moments are drawn as dots. Periods are drawn as horizontal bars from their start moment to their end moment. The moments in between are drawn as labelled marks along the bar. Smaller periods are drawn as thinner bars inside it. (Proposed)<br>A period that is still going on is drawn with a jagged right-hand edge at today's date. (Agreed) | Agreed in part | REQ-VIEW-011, REQ-VIEW-012 |
| DES-VIEW-003 | A dependency arrow runs from one moment to another (DES-REL-006). Where a moment is part of a period, the arrow starts or ends at its mark on the period's bar. | Proposed | REQ-VIEW-011, REQ-REL-011 |
| DES-VIEW-004 | Uncertain dates are drawn with soft, faded edges spanning their range of possible times (DES-DATE-003). Exact dates are drawn with sharp edges. | Proposed | REQ-VIEW-011, REQ-DATA-005 |
| DES-VIEW-005 | Three ways of spacing entries along the time axis are to be tried in an experiment, and the best kept, or offered as a choice:<br>• Linear time, where distance is proportional to the years between entries.<br>• Compressed (logarithmic) time, which gives recent centuries more room.<br>• Time slots, where each entry has its own column in date order, however far apart the dates are. | Proposed | REQ-VIEW-005 |
| DES-VIEW-006 | By default, only the neighbourhood of the current entry is drawn, a few steps in each direction. An option draws its whole ancestry. | Proposed | REQ-VIEW-005, REQ-NFR-002 |
| DES-VIEW-007 | Horizontal and vertical zoom are independent. They are controlled by the mouse wheel with modifier keys, by pinch gestures, and by on-screen buttons. | Proposed | REQ-VIEW-003 |
| DES-VIEW-008 | Clicking an entry makes it current, and updates the navigator to match. | Proposed | REQ-VIEW-009 |
| DES-VIEW-010 | Entries are laid out with a layered graph drawing method, which places entries to reduce crossing links and routes links around boxes rather than through them. A library such as ELK (elkjs) is a candidate, to be judged in the experiment. | Proposed | REQ-VIEW-001, REQ-VIEW-013 |
| DES-VIEW-009 | A line marks today's date. Anything dated after it is planned, and is drawn with a dashed outline. | Agreed | REQ-DATA-014 |

# Search and filtering

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-FIND-001 | Results update after a short pause in typing. Search matches names, alternative names and descriptions, and tolerates small spelling mistakes. The result count is announced without interrupting. | Proposed | REQ-FIND-001, REQ-FIND-004, REQ-FIND-005 |
| DES-FIND-002 | Choosing a result makes it current and moves focus to the navigator. | Proposed | REQ-FIND-006 |
| DES-FIND-003 | Tags are a list of checkboxes, with an any or all choice. The date range accepts BCE and CE. Filters apply to search results, lists and the visual view. | Proposed | REQ-FIND-002, REQ-FIND-003, REQ-FIND-007, REQ-FIND-008 |

# Wikidata import

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-IMP-001 | The import is a command-line script that the developer runs. It writes a seed file and a report. The seed file is then loaded into the database. | Proposed | REQ-CONT-001 |
| DES-IMP-002 | The seed set is gathered by starting from the working example (the iPhone, Q2766, by default), and following dependency links backwards in time until there are 50 to 200 entries. | Proposed | REQ-CONT-007 |
| DES-IMP-003 | Each imported relationship records the Wikidata property it came from. The report shows how many links each property contributed. | Proposed | REQ-CONT-008, REQ-CONT-011 |
| DES-IMP-004 | A curation file in the code repository adds, removes and corrects entries and links. It is applied on every import. | Proposed | REQ-CONT-010 |
| DES-IMP-005 | Candidate Wikidata properties. All of these are to be checked against real data in Phase 0.<br>• Dependencies: "uses" (P2283), "based on" (P144), "depends on software" (P1547) and "has cause" (P828). Also "has effect" (P1542) and "immediate cause of" (P1536), which point the other way.<br>• Containment: "part of" (P361), "has part(s)" (P527), and "significant event" (P793), which gives moments within a period.<br>• Moment dates: "time of discovery or invention" (P575), "inception" (P571), "point in time" (P585) and "publication date" (P577).<br>• Period dates: "start time" (P580) or "inception" (P571) for the start, and "end time" (P582) or "dissolved, abolished or demolished date" (P576) for the end.<br>• Approximate dates: the "sourcing circumstances" qualifier (P1480) with the value "circa".<br>• Location: "location" (P276), or else "country" (P17).<br>• Tags: derived from "instance of" (P31) and "subclass of" (P279). | Proposed | REQ-CONT-008, REQ-DATA-009 |
| DES-IMP-006 | Date precision is taken directly from Wikidata's own precision codes: 11 is day, 10 is month, 9 is year, 8 is decade, 7 is century, 6 is millennium, and lower codes are deeper time. | Proposed | REQ-DATA-005 |
| DES-IMP-007 | The report lists missing dates, broken predates rules, entries that fall outside their period, and circular dependencies. Problem links are left out of the seed file. | Proposed | REQ-CONT-011, REQ-REL-007 |
| DES-IMP-008 | For each period, the import creates a start moment and an end moment from the period's start and end dates, named for example "Start of the Roman Republic" and "End of the Roman Republic". A Wikidata dependency that points at a whole period is attached to its start moment (DES-REL-007). It is listed in the report, so that it can be moved to a better moment with the curation file (DES-IMP-004). | Proposed | REQ-CONT-001, REQ-REL-011 |

# Non-functional design

This section holds design decisions that aren't about behaviour: the technology choices and the coding standards.

## Technology

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-TECH-001 | TypeScript throughout: front end, server and import tool. | Agreed (delegated) | REQ-CODE-002 |
| DES-TECH-002 | Cloudflare D1, Cloudflare's SQL database, which is based on SQLite. | Agreed | REQ-TECH-002 |
| DES-TECH-003 | A Cloudflare Worker serves both the front end and a read-only JSON API. | Proposed | REQ-TECH-001 |
| DES-TECH-004 | The front end is plain TypeScript classes with no UI framework, built with Vite. This gives full control over focus and announcements. | Proposed | REQ-ACC-001, REQ-CODE-002 |
| DES-TECH-005 | The visual view is drawn in SVG. The D3 library is used only for time scales and zooming. | Proposed (delegated) | REQ-VIEW-001, REQ-VIEW-003 |
| DES-TECH-006 | The code and these documents are kept in a public git repository on GitHub. | Agreed | REQ-CODE-001 |

## Coding standards

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-CODE-001 | The code is object-oriented, built from classes with clear public interfaces. A class doesn't mix responsibilities where that can sensibly be avoided. | Agreed | REQ-CODE-002 |
| DES-CODE-002 | One class per file, and the file is named after the class. There is no fixed limit on file size: a file is as large as its single responsibility needs. Small types used only by that class, such as an enumeration, may sit in the same file. | Agreed | REQ-CODE-002 |
| DES-CODE-003 | The core logic (the model, dates, graph rules, navigation state and announcement wording) doesn't depend on the browser, the user interface or Cloudflare. | Proposed | REQ-CODE-002 |
| DES-CODE-004 | Dependencies between parts of the code point in one direction only. The user interface, the server and the import tool all depend on the core. The core depends on none of them. | Proposed | REQ-CODE-002 |
| DES-CODE-005 | Each core class has unit tests. | Proposed | REQ-CODE-002 |
| DES-CODE-006 | An architecture document lists every module and its responsibility. | Proposed | REQ-CODE-002 |

# Withdrawn design IDs

These IDs won't be reused.

| ID | What it was | Why it was withdrawn |
|--------------|-------------|----------------------|
| DES-REL-003 | Which date to use when a dependency pointed at a whole period. | Withdrawn in version 0.4. Dependencies now always point at moments (DES-REL-006). |
| DES-KEY-009 | On a period, Left Arrow went to its start moment and Right Arrow to its end moment. | Withdrawn in version 0.5. Replaced by stepping through all of a period's moments (DES-KEY-010). |
| DES-SR-001 | The navigator was a single focusable widget with the ARIA "application" role. | Withdrawn in version 0.11. NVDA's own reading commands didn't work on it. Replaced by a card of standard controls (DES-SR-006). |
| DES-SR-003 | The Details region showed everything about the current entry, for reading in browse mode. | Withdrawn in version 0.11. The card shows the same information (DES-SR-006). |
| DES-SR-005 | The navigator's only content was one line giving the current position. | Withdrawn in version 0.11. NVDA+Up Arrow didn't read it. |
| DES-KEY-008 | I moved focus to the Details region, and Escape returned. | Withdrawn in version 0.11, with the Details region. |
| DES-KEY-012 | On a period, Up Arrow went up to the larger period. | Withdrawn in version 0.8. Periods have a Part of list instead, the same as moments (DES-NAV-012). |
| DES-ANN-010 | A moment dated in the future was announced as "planned". | Withdrawn in version 0.6. The date already shows that it is in the future. |

The Contains list, proposed in version 0.3, is also withdrawn. A period's moments are now reached by stepping through the period (DES-NAV-009).

# Out of scope for the first release

- Community editing and user accounts. (REQ-CONT-002, REQ-CONT-006)
- Relationship lists beyond those in DES-NAV-002. (REQ-NAV-016)
- Datasets larger than 200 entries. (REQ-NFR-003)
- Mobile-specific layouts. (REQ-NFR-004)

# Change history

- **0.11**, 21 October 2026: The current moment is now a card of standard controls (DES-SR-006, DES-SR-007), with Tab moving between its parts (DES-KEY-014). Rewrote DES-SCR-001, DES-NAV-001, DES-SR-004 and DES-ANN-001 to DES-ANN-003. Withdrew DES-SR-001, DES-SR-003, DES-SR-005 and DES-KEY-008.
- **0.10**, 21 October 2026: Settled the wording for P (DES-KEY-006).
- **0.9**, 21 October 2026: After the second test of Step 0A: the navigator's content is one line that NVDA+Up Arrow reads (DES-SR-005), and P reads the path in date order (DES-KEY-006). Added the visual layout experiment to DES-VIEW-005 and DES-VIEW-010.
- **0.8**, 21 October 2026: Periods have a Part of list, the same as moments (DES-NAV-012), replacing Up Arrow on a period (DES-KEY-012, withdrawn). After testing Step 0A: arriving at a moment now announces the highlighted entry (DES-ANN-001), Escape returns to the navigator from anywhere on the page (DES-KEY-008), and DES-SR-004 is added.
- **0.7**, 21 October 2026: Recorded the round 6 decisions. The Part of list is agreed. Impossible moves are silent, except at the ends of a period. The repository is public on GitHub.
- **0.6**, 21 October 2026: Recorded the round 5 decisions. Left Arrow and Right Arrow on a moment work from their own lists (DES-KEY-001). Added the "D'oh" sound at the ends of a period (DES-ANN-011) and DES-KEY-013. Agreed Up Arrow on a period, Backspace and the line for today. Withdrew DES-ANN-010.
- **0.5**, 21 October 2026: Recorded the round 4 decisions. Moments have lists, and periods are stepped through with Left Arrow and Right Arrow (DEC-19). Added ongoing periods, future dates, nested periods and locations. Added DES-DATA-007, DES-DATE-005, DES-REL-007, DES-NAV-009 to DES-NAV-011, DES-KEY-010 to DES-KEY-012, DES-ANN-008 to DES-ANN-010 and DES-VIEW-009. Withdrew DES-KEY-009 and the Contains list. Put every design item in tables.
- **0.4**, 21 October 2026: Periods are now defined by a start moment and an end moment, with any number of moments between, and dependencies are always between moments (DEC-17). Added DES-DATA-006, DES-REL-006, DES-KEY-009 and DES-IMP-008. Rewrote DES-DATA-001 to DES-DATA-003, DES-NAV-002, DES-NAV-003, DES-VIEW-002 and DES-VIEW-003. Withdrew DES-REL-003.
- **0.3**, 20 October 2026: Added numbered DES items, which now hold the design decisions that used to be in the Requirements Catalogue. Added the moments-and-periods model, date ranges, the predates check, the Part of and Contains lists, the Enter and I keys, how periods and uncertain dates are drawn, and a Non-functional design section.
- **0.2**, 20 October 2026: Tab-style lists and the Wikidata import.
- **0.1**, 20 October 2026: first draft.
