---
title: "Dependency Tree — Functional Specification"
subtitle: "Version 0.26 (draft)"
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

There are two kinds of entry: moments and periods. A period is built from moments, and every link joins one moment to another (DEC-17). Periods can sit inside larger periods (DEC-21). An idea is a kind of moment (DEC-71).

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-DATA-001 | Every entry is either a **moment**, which has a single date, or a **period**. A period is defined by at least two moments: a **start moment** and an **end moment**. It can have any number of moments between them. A period's dates are the dates of its start and end moments.<br>Example: the Roman Republic is defined by its founding, c. 509 BCE, and its end, 27 BCE. The writing of the Twelve Tables, c. 450 BCE, is one of the moments between them. | Agreed | REQ-DATA-002 |
| DES-DATA-002 | A period that is still going on has a start moment but no end moment yet. Example: "People's Republic of China, 1949 to present". | Agreed | REQ-DATA-006 |
| DES-DATA-003 | A moment can belong to more than one period. A period can be part of a larger period. Example: Chinese civilisation contains the Tang dynasty. | Agreed | REQ-DATA-013, REQ-REL-003 |
| DES-DATA-004 | An invention or discovery is a moment on its own, not part of any period: the date it first came into being. It doesn't need an end date, because it continues to be available. Example: "Lithium-ion battery, 1991". | Proposed | REQ-DATA-002 |
| DES-DATA-005 | Every entry has a name, alternative names, a description, tags, sources, a stable identifier, an address-friendly name (for example "lithium-ion-battery"), and a Wikidata identifier if it was imported. | Proposed | REQ-DATA-001, REQ-DATA-003, REQ-DATA-007, REQ-DATA-008, REQ-DATA-012, REQ-CONT-004 |
| DES-DATA-006 | Everything in a period falls between its start and end moments, allowing for uncertainty in the dates. This includes the start and end moments of any smaller period inside it. Breaches are listed in the import report. | Agreed | REQ-DATA-013, REQ-REL-003, REQ-CONT-011 |
| DES-DATA-007 | A moment can have a location: a place name such as "Rome" or "China". | Agreed | REQ-DATA-009 |
| DES-DATA-009 | A moment can be an **idea**, such as revanchism or Leninism. Like an invention (DES-DATA-004), an idea is dated by when it first appeared, and has no end. It is linked like any other moment.<br>Example: the 1939 Invasion of Poland was caused by revanchism, an idea from the 1870s. | Agreed | REQ-DATA-015 |
| DES-DATA-008 | A period's start and end moments are real events, never entries made only to mark its dates. So a period has at least two moments: the first of its stops is its start, and the last is its end. There are no stops called "start" or "end".<br>Example: the European Theater of World War II starts with the 1939 Invasion of Poland and ends with the German Instrument of Surrender. | Agreed | REQ-DATA-002 |

## Dates

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-DATE-001 | Years are stored as signed astronomical years. 1 BCE is year 0, 2 BCE is year minus 1, and so on. This allows simple comparison and sorting. Users never see this form. | Proposed | REQ-DATA-004 |
| DES-DATE-002 | Each date has a precision. The possible precisions are day, month, year, decade, century, millennium, and multiples of ten thousand years and more for deep history. These are the same precisions that Wikidata uses. Each date also has an "approximate" flag. | Proposed | REQ-DATA-005 |
| DES-DATE-003 | Each date is treated as a range of possible times, from the earliest to the latest:<br>• "1991", with year precision, means any time in 1991.<br>• "19th century" means 1801 to 1900.<br>• "9 January 2007", with day precision, means that one day.<br>• An approximate date widens its range by one unit of its precision on either side. For example, "c. 1450", with year precision, means 1449 to 1451, and "c. 5th century BCE" means the 6th to the 4th century BCE. | Proposed | REQ-DATA-005, REQ-REL-009 |
| DES-DATE-004 | Dates are written and spoken in natural form. Examples:<br>• "9 January 2007"<br>• "1991"<br>• "c. 509 BCE", spoken as "around 509 BCE"<br>• "19th century"<br>• "509 BCE to 27 BCE", for a period<br>• "1949 to present", for a period that is still going on | Proposed | REQ-ANN-008 |
| DES-DATE-005 | A date can be in the future, for something planned. Example: "Los Angeles Olympic Games, 14 July 2028 to 30 July 2028". | Agreed | REQ-DATA-014 |
| DES-DATE-006 | In lists and list labels, dates are shortened by how far they are from today:<br>• More than 3 years away: the year only, such as "2007".<br>• More than 12 months but at most 3 years away: month and year, such as "March 2024".<br>• Within 12 months: the full date, as precisely as it is known.<br>Future dates are treated the same way. A date known only roughly, such as "1970s", is never made more precise. The summary box and the Space summary give dates in full. | Agreed | REQ-ANN-008, REQ-ACC-015 |

## Relationships

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-REL-001 | Every link has one of three kinds: **depends on**, **caused by** or **influenced by**. Each link is stored once, on the later moment, and read backwards from the earlier one:<br>• Depends on: Depended on, and read backwards, Enabled. If the laptop depends on the battery, the battery enabled the laptop.<br>• Caused by: Caused by, and read backwards, Caused.<br>• Influenced by: Influenced by, and read backwards, Influenced.<br>Two moments are joined by one link at most. | Agreed | REQ-REL-001, REQ-REL-005, REQ-REL-008, REQ-REL-012, REQ-REL-013 |
| DES-REL-002 | A link of any kind is rejected only if its earlier end **certainly** happened later than its later end. In other words, it is rejected only if the earliest possible date of the earlier moment is after the latest possible date of the later one. Where the date ranges overlap, the link is allowed.<br>Example: A, dated c. 1450, depends on B, dated only to the 15th century. B might have come first, so the dependency is allowed.<br>Example: something dated "1991" can't depend on something dated "9 January 2007". The dependency is rejected. | Agreed | REQ-REL-002, REQ-REL-009 |
| DES-REL-004 | Containment ("part of") is separate from dependency. It follows DES-DATA-006, not the predates rule. | Proposed | REQ-REL-003 |
| DES-REL-005 | Circular links, through links of any kind, are detected when data is imported, and are listed in the report. | Proposed | REQ-REL-007 |
| DES-REL-006 | Links of every kind are always between moments. Nothing depends on, is caused by or is influenced by a period as a whole, and the same is true the other way round. Example: Roman law depends on the writing of the Twelve Tables, not on the Roman Republic. | Agreed | REQ-REL-011 |
| DES-REL-007 | Where source data links to a whole period, one of its moments is used instead:<br>• Where the period is the later end of the link, its start moment.<br>• Where the period is a cause, its end moment, because a war's effects come after it. If the end moment came after the later end of the link, the start moment is used instead.<br>• Where the period is depended on or an influence, its start moment.<br>The curation file can choose the other end for any link. Agreed for now, to see how it goes (Q-29).<br>Example: the Paris Peace Conference was caused by World War I, so it links to the Armistice of Compiègne. The Cold War, as an effect of World War II, links from the Truman Doctrine to the Japanese Instrument of Surrender. | Agreed | REQ-REL-009, REQ-REL-011 |
| DES-REL-008 | A cause has a **strength**: immediate, ordinary or contributing, matching Wikidata's "has immediate cause", "has cause" and "has contributing factor". Ordinary is the default, and isn't stored. Only causes have a strength. | Agreed | REQ-REL-014 |
| DES-REL-009 | A link can have a **note**: a sentence or two saying why it exists, shown to the user (DES-ANN-014). Notes come from the curation file. Where the reason is itself an event, the event is added instead, with links on either side.<br>Example: rather than a note saying that the Allies built up troops in Britain before the Normandy landings, add Operation Bolero between the Battle of the Atlantic and the landings. | Agreed | REQ-REL-010 |

## Why we call it a tree

From any one moment, looking back through its links, the structure branches out like a tree. That is what the product is named after. (REQ-VIS-005) Strictly, it is a web, because the same entry can be reached by more than one route. The user only ever deals with one entry at a time, so the web never has to be managed as a whole.

# Screens

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-SCR-001 | The page has no landmarks, because the user is nearly always in focus mode, and landmarks only added to what NVDA said on every move. Headings serve browse mode instead: the page title, and the current entry's name. Search and filters, when they come, will have headings too. | Agreed | REQ-ACC-004, REQ-ACC-015 |
| DES-SCR-002 | Each entry has its own web address, for example /entry/lithium-ion-battery. Opening it shows the main screen with that entry current. | Proposed | REQ-DATA-008 |

# The tree navigator

The navigator behaves differently on a moment and on a period (DEC-19):

- **On a moment**, the user browses its lists, such as Depended on, Caused by and Enabled, and presses Enter to go to an entry in one of them.
- **On a period**, the user moves through its moments in date order with Up Arrow and Down Arrow, and presses Enter to go into one of them.

## Lists on a moment

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-NAV-001 | Each moment presents its relationships as a set of lists, shown as a standard tab control with the active list underneath (DES-SR-006). | Agreed | REQ-NAV-003 |
| DES-NAV-002 | The lists, in order:<br>1. **Depended on**: what this moment needed.<br>2. **Caused by**: what brought it about.<br>3. **Influenced by**: what shaped it.<br>4. **Part of**: the periods this moment belongs to. A moment can be part of more than one period.<br>5. **Enabled**: what this moment made possible.<br>6. **Caused**: what it brought about.<br>7. **Influenced**: what it shaped.<br>Reading the lists from first to last runs from "before", through "around", to "after". The first three are the **earlier lists**, and the last three the **later lists**. | Agreed | REQ-NAV-003, REQ-NAV-023, REQ-REL-008 |
| DES-NAV-003 | Only the lists that have entries are shown, so moving between lists never stops on an empty list that tells the user nothing. A moment with no lists at all shows an empty Depended on list, holding "None" (DES-ANN-003). | Agreed | REQ-NAV-003, REQ-ACC-015 |
| DES-NAV-004 | Each list remembers its highlighted entry. Until the user moves within the list, this is its first entry. | Agreed | REQ-NAV-001, REQ-NAV-002, REQ-ACC-015 |
| DES-NAV-005 | After moving to another moment, the active list is the kind of list the user just moved through, as long as the new moment has one. Otherwise, it is the first list going the same way through time. Otherwise, it is the first list.<br>• After going to a dependency, the Depended on list is active. If the new moment depended on nothing but has causes, the Caused by list is active.<br>• After going to an enabled entry, the Enabled list is active. | Agreed | REQ-ACC-015 |
| DES-NAV-006 | Entries in each list are sorted by date, oldest first. | Proposed | REQ-ACC-015 |

## Inside a period

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-NAV-009 | A period is presented as a row of stops in date order, from its start moment to its end moment. If the period is still going on, the last stop is "Ongoing", at today's date. | Agreed | REQ-NAV-023, REQ-NAV-024, REQ-DATA-006 |
| DES-NAV-010 | On arriving at a period from one of its moments, through the Part of list, that moment is highlighted. Otherwise, the start moment is highlighted. | Proposed | REQ-ACC-015 |
| DES-NAV-011 | A smaller period inside a larger one is a single stop, placed at the date of its start moment. Enter goes into it. | Proposed | REQ-NAV-023, REQ-REL-003 |
| DES-NAV-012 | A period that is part of a larger period has a Part of list, reached with Ctrl+Left Arrow and Ctrl+Right Arrow, as on a moment. So going up works the same way everywhere. (Agreed)<br>The period's stops are its first list, called Moments. While Moments is active, Up Arrow and Down Arrow move through the stops, and Enter goes into the highlighted one. While Part of is active, Up Arrow and Down Arrow move through it, and Enter goes to the highlighted larger period. (Proposed, built in Step 0B) | Agreed in part | REQ-NAV-023, REQ-NAV-003 |

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
| DES-KEY-001 | When an earlier list (Depended on, Caused by or Influenced by) is active, Left Arrow goes to its highlighted entry, earlier in time. When a later list (Enabled, Caused or Influenced) is active, Right Arrow goes to its highlighted entry, later in time. Enter does the same. Because the active list follows the direction of travel (DES-NAV-005), the user can keep pressing the same arrow to walk through time, one key per step. | Agreed | REQ-NAV-001, REQ-NAV-002, REQ-ACC-015 |
| DES-KEY-002 | Up Arrow and Down Arrow move through the active list (Agreed). Page Up and Page Down move ten entries, stopping at the first or last (Agreed). Home and End go to its first and last entry (Proposed). | Agreed in part | REQ-NAV-003 |
| DES-KEY-003 | Ctrl+Left Arrow and Ctrl+Right Arrow go to the previous and next list on Windows. Option+Left Arrow and Option+Right Arrow do the same on macOS, where Ctrl+Left Arrow and Ctrl+Right Arrow switch desktops. | Agreed | REQ-NAV-003, REQ-ACC-008 |
| DES-KEY-004 | Enter goes to the highlighted entry in the active list. | Agreed | REQ-NAV-001, REQ-NAV-002, REQ-NAV-023 |
| DES-KEY-013 | Left Arrow when no earlier list is active, and Right Arrow when no later list is active, do nothing, silently. This includes a period's Moments and Part of lists. The exception is a moment with nothing at all that way, where the bump sound plays (DES-ANN-011). | Agreed | REQ-NAV-015 |

### On a period

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-KEY-010 | Up Arrow and Down Arrow move to the previous and next stop in the period (DES-NAV-009), and Home and End go to the first and last stop, as in any list. Left Arrow and Right Arrow do nothing here (DES-KEY-013), so they only ever go to another entry, the same everywhere in the application. | Agreed | REQ-NAV-024 |
| DES-KEY-011 | Enter goes into the highlighted moment or smaller period, which becomes the current entry. | Agreed | REQ-NAV-023 |

### Anywhere

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-KEY-005 | Backspace goes back one step along the path taken. | Agreed | REQ-NAV-004 |
| DES-KEY-006 | Information keys:<br>• Space: summary of the current entry<br>• D: description<br>• T: tags<br>• L: location<br>• P: the moments on the path taken, each named once, in date order from oldest to newest, without dates. Example: "Path, 3 entries: Electric battery, Telephone, iPhone." It says "entries" rather than "moments", because a path can include periods. (Agreed, with "entries" proposed)<br>• N: the note on the link to the highlighted entry, or "No note." (DES-ANN-014) | Proposed | REQ-NAV-005, REQ-NAV-006, REQ-ACC-005 |
| DES-KEY-007 | Other keys:<br>• Slash (/): the index, which works anywhere in the card (DES-FIND-004). (Agreed)<br>• F: filters<br>• Question mark (?): keyboard help<br>• V: cycle verbosity | Agreed in part | REQ-ACC-009, REQ-ACC-010, REQ-FIND-009 |
| DES-KEY-014 | Tab and Shift+Tab move between the parts of the card, in the order given in DES-SR-006. On the tabs, Left Arrow, Right Arrow, Home and End choose a tab, as on any tab control. Backspace and question mark work anywhere in the card. The other keys in this section work in the list. | Agreed | REQ-ACC-007, REQ-NAV-003 |

## Announcements

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-ANN-001 | On arriving at an entry, focus enters its new list, and the screen reader reads the list's label and the highlighted entry. The label names the entry (DES-ANN-012), its shortened date and the list. For example: "Event: Telephone, 1876, Depended on, list. Electric battery, 1800, 1 of 2." An empty list's label ends with "none". | Agreed | REQ-ANN-007 |
| DES-ANN-002 | Moving within a list moves focus to the entry, which the screen reader reads with its position. For example: "Smartphone, 1994, 3 of 12." | Proposed | REQ-ANN-007 |
| DES-ANN-003 | Switching list moves focus into the new list, whose label is just the list's name, followed by the highlighted entry. For example: "Enabled, list. Laptop, 1981, 1 of 8." An empty list holds one item, "None", so NVDA+Up Arrow has something to read: "Depended on, list. None." Enter does nothing on it. Since empty lists are hidden (DES-NAV-003), this happens only on a moment with no links at all. | Agreed | REQ-ANN-007, REQ-ACC-015 |
| DES-ANN-004 | There are three verbosity levels:<br>• Brief: names only<br>• Normal: as in the examples in this section (the default)<br>• Full: Normal, plus the first sentence of the description | Proposed | REQ-ACC-010 |
| DES-ANN-005 | When filters hide entries, the announcement includes the number hidden. Example: "Depended on, 3, 2 hidden by filters." | Proposed | REQ-ANN-006 |
| DES-ANN-006 | A new announcement replaces any announcement that hasn't been spoken yet. | Proposed | REQ-ANN-004 |
| DES-ANN-007 | When there is nowhere to go, nothing is announced. The only exception is the bump sound (DES-ANN-011). This is to be reviewed after testing, and spoken messages such as "No earlier entries" may be added if silence is confusing. | Agreed | REQ-NAV-015 |
| DES-ANN-008 | Arriving at a period works the same way, through the label of its Moments list. For example: "Information Age, 1970s to present, Moments, list. iPhone, 2007, 5 of 6." | Agreed | REQ-ANN-007 |
| DES-ANN-009 | Moving to the end of a period that is still going on announces "Ongoing". | Agreed | REQ-DATA-006 |
| DES-ANN-011 | When the user presses Left Arrow on a moment with no earlier lists, or Right Arrow on a moment with no later lists, a short bump sound plays, and nothing else changes, whichever list is active. For example, Left Arrow on the electric battery, which depended on nothing and had no causes or influences. Up Arrow and Down Arrow at the ends of a list are silent, as in any list. The sound is sounds/bump.wav, recorded by the product owner. | Agreed | REQ-NAV-015, REQ-ANN-009 |
| DES-ANN-012 | Where the tree names a moment and it could be taken for a period, the name starts with "Event:", or "Idea:" for an idea (DES-DATA-009). This covers the label on arrival, the index, the Space summary, the heading and the summary box. The linked lists and the Moments list hold only moments, so their entries have no "Event:". A period has no word before its name, because its range of dates shows it is a period. The path (P) gives names alone, as it is a list of names.<br>Example: arriving at the iPhone says "Event: iPhone, 2007, Depended on", and its dependencies are read as, for example, "Touchscreen, 1965". (Agreed, with "Idea:" proposed) | Agreed in part | REQ-ANN-007 |
| DES-ANN-013 | In the Caused by and Caused lists, an entry ends with the cause's strength when it isn't ordinary: "immediate" or "contributing".<br>Example: "Caused by, list. Assassination of Archduke Franz Ferdinand, 1914, immediate, 1 of 7." Q-28 asks whether this is clear. | Proposed | REQ-ANN-010, REQ-REL-014 |
| DES-ANN-014 | An entry whose link has a note ends with "note", after any strength. While that entry is highlighted, the card shows a Note box with the note (DES-SR-006), and N reads it. The Note box is hidden when the highlighted entry's link has no note. Q-28 asks whether this is clear. | Proposed | REQ-ANN-010, REQ-REL-010 |

## Worked examples

The dates and counts in these examples are only illustrations. The words in quotes are what the user hears; the exact wording depends on the screen reader.

Moving between moments. The current entry is the lithium-ion battery. The user arrived from the laptop through the Depended on list, so that list is active (DES-NAV-005).

1. Ctrl+Right Arrow: "Enabled, 8. Laptop, 1981, 1 of 8."
2. Down Arrow twice: "Electric car, 1996, 3 of 8."
3. Right Arrow, or Enter: "Electric car, 1996. Enabled, 5." The Enabled list stays active, so pressing Right Arrow again carries on forward in time.
4. Backspace: "Lithium-ion battery, 1991. Enabled, 8." Back where the user was.

Moving into and through a period. The current entry is the writing of the Twelve Tables.

1. Ctrl+Right Arrow: "Part of, 1. Roman Republic, 509 BCE to 27 BCE, 1 of 1."
2. Enter: "Roman Republic, 509 BCE to 27 BCE, 6 moments. Twelve Tables, around 450 BCE, 2 of 6." The Twelve Tables is highlighted, because the user came from it (DES-NAV-010).
3. Up Arrow: "Start of the Roman Republic, around 509 BCE, 1 of 6."
4. Left Arrow: nothing happens. Left Arrow and Right Arrow don't move within a list.
5. Down Arrow: "Twelve Tables, around 450 BCE, 2 of 6."
6. Enter: "Twelve Tables, around 450 BCE. Depended on, 2." The user is on a moment again, and its lists work as before.

A period that is still going on. The current entry is the People's Republic of China, and the user is on its last moment.

1. Down Arrow: "Ongoing." It can't be gone to, so Enter does nothing.

Nowhere earlier to go. The current entry is the electric battery, which has nothing earlier: no dependencies, causes or influences.

1. Left Arrow: the bump sound plays, and the user stays where they are.

## Screen reader integration

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-SR-006 | The current entry, a moment or a period, is shown as a card made of standard controls, so the screen reader's own commands work on every part of it, including "read current line" (NVDA+Up Arrow). In order:<br>1. A heading with the entry's name.<br>2. **Summary**: a read-only text box with three lines: the name, the date or dates, and the location (for a moment) or "Period" or "Period, still going on".<br>3. **Description**: a read-only text box.<br>4. **Note**: a read-only text box with the note on the link to the highlighted entry. It is shown only when there is a note (DES-ANN-014).<br>5. A tab control with one tab per list, showing its count, for example "Depended on (2)".<br>6. A list box of the active list's entries, with focus on the highlighted entry.<br>Tab and Shift+Tab move between the parts in this order: summary, description, note, list, tabs. The list comes before the tabs because it is used far more, although the tabs are shown above it. When a new entry is shown, the caret in each text box starts at the top line. Within one entry, each box keeps wherever the user left the caret. | Agreed | REQ-ACC-004, REQ-ACC-007, REQ-ACC-014, REQ-ACC-016 |
| DES-SR-002 | In VoiceOver, Quick Nav must be off for the arrow keys to reach the application. Keyboard help says so. | Proposed | REQ-ACC-003, REQ-ACC-008 |
| DES-SR-004 | Focus is moved after the key that caused it has finished, so the screen reader handles the two separately. | Proposed | REQ-ACC-011 |
| DES-SR-007 | A new list box is built each time the entry or the tab changes, so the screen reader sees focus enter a new list and reads its label. The old list box stays until focus has moved into the new one. Otherwise focus would drop to the page for a moment, and the screen reader would announce the document and its landmarks again. | Agreed | REQ-ANN-007, REQ-ACC-015 |

# Visual presentation

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-VIEW-001 | The current entry is centred. What it is linked to earlier is drawn to the left, and what it is linked to later to the right. The highlighted entry is marked.<br>In Step 0D, the whole sample is drawn, and the drawing scrolls to put the current entry in the middle. The current entry has a blue outline, the highlighted entry in the list an orange one, and the current moment's links are drawn in blue. | Proposed | REQ-VIEW-001, REQ-VIEW-002, REQ-VIEW-006 |
| DES-VIEW-002 | Moments are drawn as dots. Periods are drawn as horizontal bars from their start moment to their end moment. The moments in between are drawn as labelled marks along the bar. Smaller periods are drawn as thinner bars inside it. (Proposed)<br>A period that is still going on is drawn with a jagged right-hand edge at today's date. (Agreed)<br>Built in version 0.26: moments are dots and periods are bars, with no text on either. Pointing at one shows its name, and a moment's date, in a tooltip. The only text in the drawing is the year labels and the line for today. The current dot is larger and blue, and the highlighted dot larger and orange. (Agreed) | Agreed in part | REQ-VIEW-011, REQ-VIEW-012 |
| DES-VIEW-003 | A link is an arrow from the earlier moment to the later one (DES-REL-006). Where a moment is part of a period, the arrow starts or ends at its mark on the period's bar. (Proposed)<br>A depends-on arrow is solid, a caused-by arrow dashed, and an influenced-by arrow dotted. A sentence above the drawing says so. (Agreed, built) | Agreed in part | REQ-VIEW-011, REQ-REL-011, REQ-ANN-010 |
| DES-VIEW-004 | Uncertain dates are drawn with soft, faded edges spanning their range of possible times (DES-DATE-003). Exact dates are drawn with sharp edges. | Proposed | REQ-VIEW-011, REQ-DATA-005 |
| DES-VIEW-005 | Three ways of spacing entries along the time axis are to be tried in an experiment, and the best kept, or offered as a choice:<br>• Linear time, where distance is proportional to the years between entries.<br>• Compressed (logarithmic) time, which gives recent centuries more room.<br>• Time slots, where each entry has its own column in date order, however far apart the dates are.<br>Built in Step 0D. Linear time is kept (DEC-53). Compressed time and time slots are dropped. In linear time, each moment starts in the row the layered layout (DES-VIEW-010) gives it, and moves to the nearest free row if its dot would be too close to another. Links are smooth curves, and can pass behind other dots. Two linked moments too close in time for a curve are joined by a straight line. Deep history and the crowded recent centuries (REQ-VIEW-005) are left to zoom (DES-VIEW-007). | Agreed | REQ-VIEW-005 |
| DES-VIEW-006 | By default, only the neighbourhood of the current entry is drawn, a few steps in each direction. An option draws its whole ancestry. | Proposed | REQ-VIEW-005, REQ-NFR-002 |
| DES-VIEW-007 | Horizontal and vertical zoom are independent. They are controlled by the mouse wheel with modifier keys, by pinch gestures, and by on-screen buttons. | Proposed | REQ-VIEW-003 |
| DES-VIEW-008 | Clicking an entry makes it current, and updates the navigator to match. Built in Step 0D: clicking a moment's box or a period's bar goes there, and the move is recorded in the path, so Backspace comes back. | Proposed | REQ-VIEW-009 |
| DES-VIEW-010 | Entries are laid out with a layered graph drawing method, which places entries to reduce crossing links and routes links around boxes rather than through them. A library such as ELK (elkjs) is a candidate, to be judged in the experiment.<br>Built in Step 0D with elkjs. Moments from an earlier year always go in an earlier column, so time still runs left to right, but distance shows only order. Links are drawn in straight segments. | Proposed | REQ-VIEW-001, REQ-VIEW-013 |
| DES-VIEW-011 | A drop-down list called Layout, below the card, switches the visual view between two layouts: Linear time (DES-VIEW-005) and Layered (DES-VIEW-010). Linear time is the default. A note under it says how the chosen layout spaces the moments. The choice is kept in the page address, for example ?layout=layered, so a link can open one layout. | Agreed | REQ-VIEW-014, REQ-VIEW-013 |
| DES-VIEW-012 | The drawing is hidden from screen readers and is not in the Tab order, because it shows nothing that the card doesn't. A short paragraph above it says so. | Proposed | REQ-ACC-001, REQ-ACC-015 |
| DES-VIEW-009 | A line marks today's date. Anything dated after it is planned, and is drawn with a dashed outline. | Agreed | REQ-DATA-014 |

# Search and filtering

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-FIND-001 | Results update after a short pause in typing. Search matches names, alternative names and descriptions, and tolerates small spelling mistakes. The result count is announced without interrupting. | Proposed | REQ-FIND-001, REQ-FIND-004, REQ-FIND-005 |
| DES-FIND-002 | Choosing a result makes it current and moves focus to the navigator. | Proposed | REQ-FIND-006 |
| DES-FIND-003 | Tags are a list of checkboxes, with an any or all choice. The date range accepts BCE and CE. Filters apply to search results, lists and the visual view. | Proposed | REQ-FIND-002, REQ-FIND-003, REQ-FIND-007, REQ-FIND-008 |
| DES-FIND-004 | The **index** is a dialog listing every entry the user can go to, in alphabetical order, as "Name, date". It is opened with slash (/) from anywhere in the card, or with the Index button on the card. Focus starts in a search box. Each word typed must appear in an entry's name or description, ignoring capitals and accents, and name matches come first. The number of entries is announced after a short pause in typing. Down Arrow moves from the search box into the list, and Up Arrow on the first entry goes back. Page Up and Page Down move ten entries. Enter goes to the entry, which becomes current and is recorded in the path, and focus returns to the card. Enter in the search box goes to the first entry. Escape closes the index without moving.<br>Example: typing "chat" leaves "ChatGPT, 2022", and Enter goes to it. Spelling mistakes are not yet tolerated (DES-FIND-001). | Agreed in part | REQ-FIND-001, REQ-FIND-005, REQ-FIND-006, REQ-FIND-009 |

# Wikidata import

| ID | Design | Status | Satisfies |
|--------------|--------------------------------------------------|----------|--------------|
| DES-IMP-001 | The import is a command-line script that the developer runs. It writes a seed file and a report. The seed file is then loaded into the database. | Proposed | REQ-CONT-001 |
| DES-IMP-002 | The seed set is gathered by starting from the working examples, called roots, and following links of every kind backwards in time, one step at a time, until there are no more or there are 200 entries. The roots are the original iPhone (Q621427) and ChatGPT (Q115564437) (DEC-58). Q2766 is the whole iPhone series, which has no date. The walk skips an item that certainly came after every entry that links to it, such as GPT-5, which ChatGPT "uses", and the report lists it. The curation file can add more starting points, and the periods that gathered entries are part of are added at the end. The page opens at the first root. | Proposed | REQ-CONT-007 |
| DES-IMP-003 | Each imported relationship records the Wikidata property it came from. The report shows how many links each property contributed. | Proposed | REQ-CONT-008, REQ-CONT-011 |
| DES-IMP-004 | A curation file, data/curation.json, adds, removes and corrects entries and links. It is applied on every import. It names every item by its Wikidata ID, and can give: the root, the most entries allowed, extra starting points, items to exclude, corrections to an item's ID, name, description or dates, whether an item is an idea, links to add or remove, and members to add to a period. An added link names its later and earlier items, and can give its kind (depends on unless stated), a cause's strength, a note for the user (DES-REL-009), and which end of a period it uses (DES-REL-007). Adding a link that Wikidata already has changes its kind, strength, note or end. The report notes corrections that had no effect, such as an added link that Wikidata now has. | Proposed | REQ-CONT-010 |
| DES-IMP-005 | The Wikidata properties used, checked against real data in Step 0C (DEC-54).<br>• Depends on: "uses" (P2283), "based on" (P144) and "depends on software" (P1547). Also these hardware properties, which the original iPhone uses for its parts: "source of energy" (P618), "display technology" (P5307), "sensors" (P9192), "input device" (P479), "connector" (P2935), "operating system" (P306) and "CPU" (P880). "Has part(s)" (P527) on a moment gives its parts as dependencies.<br>• Caused by: "has cause" (P828), "has immediate cause" (P1478), immediate, and "has contributing factor" (P1479), contributing.<br>• Caused by, read backwards through the Wikidata query service: "has effect" (P1542), "immediate cause of" (P1536), immediate, and "contributing factor of" (P1537), contributing.<br>• Influenced by: "influenced by" (P737). It isn't read backwards, because that would find later items, and the walk goes back in time.<br>• Containment: "part of" (P361), and on a period, "has part(s)" (P527) and "significant event" (P793).<br>• Moment dates, in this order: "time of discovery or invention" (P575), "inception" (P571), "point in time" (P585), "publication date" (P577) and "launch date" (P619), which spaceflights use.<br>• Periods: an item with a "start time" (P580) or "end time" (P582) is a period. The start is P580 or "inception" (P571), and the end is P582 or "dissolved, abolished or demolished date" (P576). A period with no end date is taken to be still going on.<br>• Approximate dates: the "sourcing circumstances" qualifier (P1480) with the value "circa".<br>• Location: "location" (P276), else "country of origin" (P495), else "country" (P17).<br>• Tags: the labels of "instance of" (P31) and "subclass of" (P279), up to three.<br>• Names: the English label, or else the label for all languages ("mul"), which many items, such as the original iPhone, now use instead. Preferred statements are used when there are any, and deprecated ones never. | Proposed | REQ-CONT-008, REQ-DATA-009 |
| DES-IMP-006 | Date precision is taken directly from Wikidata's own precision codes: 11 is day, 10 is month, 9 is year, 8 is decade, 7 is century, 6 is millennium, and lower codes are deeper time. | Proposed | REQ-DATA-005 |
| DES-IMP-007 | The report lists missing dates, broken predates rules, entries that fall outside their period, and circular dependencies. Problem links are left out of the seed file. | Proposed | REQ-CONT-011, REQ-REL-007 |
| DES-IMP-009 | An item with no usable date is left out, and the walk doesn't go through it. It is listed in the report with how many entries link to it. Where it matters, Claude looks up a first date in the item's English Wikipedia article, and the curation file gives that date with a note naming the article (DEC-56). Where the article states no clear first date, the item stays out. Example: the microphone is dated 1876 from Wikipedia, but the accelerometer has no clear date, so it is left out. | Agreed | REQ-CONT-011 |
| DES-IMP-010 | Each Wikidata answer is kept in a cache folder, .cache/wikidata, which isn't in the repository. Running the import again uses the cache and gives the same result. "npm run import -- --refresh" asks Wikidata afresh. Each moment and period in the seed file keeps its Wikidata ID, and each link its kind and the property it came from. | Proposed | REQ-CONT-004, REQ-CONT-008 |
| DES-IMP-011 | The page opens the seed set, starting at the first root. The hand-made sample is dropped (DEC-73). | Agreed | REQ-CONT-001 |
| DES-IMP-012 | An item's name is its English label, else its label for all languages, else the title of its English Wikipedia article. An item with none of these is left out, and the report lists it. | Agreed | REQ-DATA-001 |
| DES-IMP-013 | An item is an idea (DES-DATA-009) if Wikidata gives it as an instance of ideology, political ideology, political concept, concept, theory, scientific theory, economic theory, doctrine, school of thought, philosophical movement, political movement or religion. The curation file can say otherwise.<br>Example: the New Union Treaty is a draft treaty, though Wikidata calls it a concept, so the curation file says it isn't an idea. | Proposed | REQ-DATA-015 |
| DES-IMP-008 | Each period starts and ends with real moments (DES-DATA-008). The import fetches the events ("significant event", P793) and parts ("has part(s)", P527) a period lists, and keeps the moments among them that could have happened on its start or end date. The start moment is the earliest member that could have happened on the start date, and the end moment the latest that could have happened on the end date. A member that is itself a period offers its own start or end moment. The curation file can name the start and end moments instead. An item with no real start moment, or no real end moment when it has an end date, is imported as a moment at its start date, and the report lists it. A link that points at a whole period is attached to one of its moments (DES-REL-007), and listed in the report.<br>Example: the curation file gives World War I's start as Austria-Hungary's declaration of war on Serbia, and its end as the Armistice of Compiègne. The Reykjavík Summit has no events in Wikidata, so it is a moment. | Agreed in part | REQ-CONT-001, REQ-REL-011, REQ-DATA-002 |

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

- **0.26**, 23 October 2026: The visual view draws moments as dots and periods as bars, with no text, and names in tooltips, because labelled boxes crowded the drawing (DES-VIEW-002, DES-VIEW-005).
- **0.25**, 23 October 2026: Three kinds of link, depends on, caused by and influenced by, with a strength for causes and a note on any link (DES-REL-001, DES-REL-008, DES-REL-009). A link to a whole period uses its end when the period is a cause (DES-REL-007). Ideas (DES-DATA-009, DES-IMP-013). Six linked lists, with empty ones hidden, and the Dependencies list renamed Depended on (DES-NAV-002, DES-NAV-003, DES-NAV-005). Left Arrow and Right Arrow follow any earlier or later list, and bump when there is nothing that way (DES-KEY-001, DES-KEY-013, DES-ANN-011). Strength and notes in lists, the Note box and the N key (DES-ANN-013, DES-ANN-014, DES-SR-006, DES-KEY-006). Arrow styles by kind (DES-VIEW-003). Import properties by kind (DES-IMP-005), and the page opens the seed set (DES-IMP-011).
- **0.24**, 23 October 2026: The Dependencies, Enabled and Moments lists no longer say "Event:" (DES-ANN-012).
- **0.23**, 23 October 2026: A moment's name starts with "Event:" everywhere in the tree, not only on arrival (DES-ANN-012).
- **0.22**, 23 October 2026: On arriving at a moment, its label starts with "Event:" (DES-ANN-001).
- **0.21**, 23 October 2026: Periods start and end with real moments, with no made-up start or end stops (DES-DATA-008, DES-IMP-008). Page Up and Page Down move ten entries (DES-KEY-002, DES-FIND-004). Items with no English name are left out (DES-IMP-012).
- **0.20**, 23 October 2026: Added the index (DES-FIND-004), opened with slash (DES-KEY-007). The import starts from two roots, the iPhone and ChatGPT, and skips items that came later (DES-IMP-002). Period moments are named with "begins" and "ends" (DES-IMP-008). Undated items may be dated from Wikipedia (DES-IMP-009).
- **0.19**, 23 October 2026: Built the Wikidata import (Step 0C). Rewrote DES-IMP-002, DES-IMP-004 and DES-IMP-005 with what real data showed (DEC-54). Added DES-IMP-009 to DES-IMP-011.
- **0.18**, 23 October 2026: The visual view keeps two layouts, linear time and layered, and the user switches between them (DES-VIEW-005, DES-VIEW-011). Compressed time and time slots are dropped.
- **0.17**, 23 October 2026: Built the visual layout experiment (Step 0D). Added DES-VIEW-011, the Layout chooser, and DES-VIEW-012, the drawing being hidden from screen readers. Updated DES-VIEW-001, DES-VIEW-005, DES-VIEW-008 and DES-VIEW-010 with what was built.
- **0.16**, 23 October 2026: In a period's Moments list, Left Arrow and Right Arrow now do nothing; Up Arrow and Down Arrow move through the stops (DES-KEY-010, DES-NAV-012). The bump sound now plays when Left Arrow or Right Arrow has nothing to go to (DES-ANN-011).
- **0.15**, 23 October 2026: An empty list shows "None" as its only item (DES-ANN-003).
- **0.14**, 21 October 2026: Renamed the "D'oh" sound to the bump sound.
- **0.13**, 21 October 2026: Built periods (Step 0B). Removed landmarks (DES-SCR-001). After switching tab, the list's label is just its name (DES-ANN-003). Dates in lists are shortened by how far they are from today (DES-DATE-006). The old list box stays until focus has moved (DES-SR-007). Updated DES-ANN-001, DES-ANN-008, DES-ANN-011, DES-NAV-012 and DES-SR-006 for periods.
- **0.12**, 21 October 2026: The list comes before the tabs in the Tab order, and text boxes start at the top line (DES-SR-006).
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
