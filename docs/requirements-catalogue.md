---
title: "Dependency Tree — Requirements Catalogue"
subtitle: "Version 0.25 (draft)"
date: 2026-10-21
lang: en-GB
---

# About this document

This is the formal catalogue of requirements for Dependency Tree. It records *what* the system must do, and the constraints it must work within. It doesn't say *how*.

Design decisions, such as which keys do what, the wording of announcements, or the programming language, are recorded in the Functional Specification as numbered design items with the prefix DES. Each design item names the requirements it satisfies. The Decision Log at the end of this document records every decision, wherever it was written down.

## How requirements are written

Each requirement is a row in a table, with these columns:

| Column | Meaning |
|--------|---------|
| ID | A stable identifier, for example REQ-NAV-001. IDs are never reused. A requirement's wording may be revised, but its ID stays the same. |
| Requirement | What the system must do. |
| Priority | How important it is, using MoSCoW. See the next table. |
| Status | Whether it has been decided. See the table after that. |
| Source | Where the requirement came from. "Brief" means the original requirements.txt. "Round 1", "Round 2" and so on mean the product owner's answers in those discussion rounds. |

| Priority | Meaning |
|----------|---------|
| Must | Required for the first usable release. |
| Should | Important, but the first release could ship without it. |
| Could | Desirable if time allows. |
| Later | Agreed in principle, scheduled for a later phase. |

| Status | Meaning |
|--------|---------|
| Agreed | Decided by the product owner. |
| Proposed | Recommended by the analyst, awaiting a decision. |
| Open | Depends on an unanswered question (see the Open Questions section). |

## Requirement groups

| Code | Group |
|------|-------|
| VIS | Vision, scope and terminology |
| ACC | Accessibility |
| DATA | Data model |
| REL | Relationships |
| NAV | Navigation |
| ANN | Screen reader announcements |
| VIEW | Visual presentation |
| FIND | Search and filtering |
| CONT | Content and data sourcing |
| CODE | Maintainability |
| TECH | Technology constraints |
| NFR | Other non-functional requirements |

# Vision, scope and terminology (VIS)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-VIS-001 | The product is a web application named "Dependency Tree". | Must | Agreed | Brief |
| REQ-VIS-002 | The application presents inventions, historical moments, ideas, political movements, and technological, scientific and engineering developments, together with what each one depended on, what caused it and what influenced it. | Must | Agreed | Brief, revised in Round 19 |
| REQ-VIS-003 | The application helps a user answer questions of the form "what had to exist first for X to be possible?", for example "why did it take so long to build an iPhone?" | Must | Agreed | Brief |
| REQ-VIS-006 | The application helps a user understand why things happened as they did, not only in what order. A plain timeline of events is not the aim: links between entries say how one led to another. | Must | Agreed | Round 19 |
| REQ-VIS-004 | The dataset is intended to be community provided in the long term. | Should | Agreed | Brief |
| REQ-VIS-005 | The structure is called a "tree", in the product and in these documents. Strictly speaking it is a web, because an entry can have many dependents as well as many dependencies. But from any starting entry, looking back in time, it reads as a tree, and "tree" is the better name. | Must | Agreed | Round 1 |

# Accessibility (ACC)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-ACC-001 | Every feature available to sighted users is available to screen reader users. Accessibility is a fundamental requirement, not an enhancement. | Must | Agreed | Brief |
| REQ-ACC-002 | The application is fully usable with NVDA on Windows 11. | Must | Agreed | Brief |
| REQ-ACC-003 | The application is fully usable with VoiceOver on macOS. | Must | Agreed | Brief |
| REQ-ACC-004 | The tree can be navigated with a screen reader. | Must | Agreed | Brief |
| REQ-ACC-005 | Dedicated keystrokes are provided for efficient navigation and for announcing information about the current entry. | Must | Agreed | Brief |
| REQ-ACC-006 | The application conforms to WCAG 2.2 level AA. | Must | Proposed | Analyst |
| REQ-ACC-007 | Every function is operable by keyboard alone, with no mouse or touch required. | Must | Proposed | Analyst |
| REQ-ACC-008 | Application keystrokes do not conflict with screen reader, browser or operating system shortcuts on the supported platforms. Where a conflict can't be avoided, it is documented with its workaround. | Must | Proposed | Analyst |
| REQ-ACC-009 | Keyboard help, listing every application keystroke, is available at any time. | Should | Proposed | Analyst |
| REQ-ACC-010 | The user can choose how verbose announcements are. | Should | Proposed | Analyst |
| REQ-ACC-011 | Moving through the tree never causes unexpected page reloads, focus loss, or focus jumps. | Should | Proposed | Analyst |
| REQ-ACC-012 | The application is tested with NVDA and Firefox, NVDA and Chrome, and VoiceOver and Safari before each release. | Must | Proposed | Analyst |
| REQ-ACC-014 | Everything the application announces about an entry can also be read at the user's own pace, using the screen reader's normal reading commands. | Must | Proposed | Analyst |
| REQ-ACC-015 | Keyboard navigation is efficient. Common tasks take as few keystrokes as possible. In particular, travelling repeatedly in the same direction through time needs only one keystroke per step. | Must | Agreed | Round 2 |
| REQ-ACC-016 | The screen reader's command for reading the current line (NVDA+Up Arrow) reads the user's current position in the tree. | Must | Agreed | Round 7 |

# Data model (DATA)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-DATA-001 | Each entry has a name, a description and a date. | Must | Agreed | Brief |
| REQ-DATA-002 | An entry can represent either a single moment in time (for example the launch of the iPhone) or something that lasts for a period (for example the British Empire). A period is defined by at least a start moment and an end moment, and can have any number of moments between them. | Must | Agreed | Brief, revised in Rounds 2 and 3 |
| REQ-DATA-003 | Entries carry one or more tags, for example "electronics" or "chemistry". | Must | Agreed | Brief |
| REQ-DATA-004 | Dates may be before the Common Era (BCE) and may span deep history, for example "c. 10,000 BCE" for agriculture. | Must | Proposed | Analyst |
| REQ-DATA-005 | Dates can be known to different precisions, and each date records how precisely it is known. For example, the founding of the Roman Republic is known to the year (or only approximately), while the iPhone launch is known to the day. | Must | Agreed | Analyst, confirmed in Round 2 |
| REQ-DATA-006 | A period that is still going on, such as a civilisation that still exists, has an open end. | Must | Agreed | Analyst, confirmed in Round 4 |
| REQ-DATA-007 | Each entry can hold one or more source references, for example a Wikipedia or Wikidata link. | Should | Proposed | Analyst |
| REQ-DATA-008 | Each entry has a stable, unique identifier and a human-readable web address, so an entry can be linked to directly. | Should | Proposed | Analyst |
| REQ-DATA-009 | A moment can have a location, for example "Rome" or "China", separate from its tags. | Should | Agreed | Analyst, confirmed in Round 4 |
| REQ-DATA-012 | Each entry can hold alternative names, for use by search. | Should | Proposed | Analyst |
| REQ-DATA-013 | Something that lasts for a period contains the moments that happened within it, including its start and end moments. Example: the Roman Republic contains the writing of the Twelve Tables. | Must | Agreed | Round 2, confirmed in Round 3 |
| REQ-DATA-014 | Dates can be in the future, for things that are planned. Example: the 2028 Olympic Games. | Must | Agreed | Round 4 |
| REQ-DATA-015 | An entry can be an idea, such as revanchism or Leninism, as well as an event or an invention. Ideas are part of the picture: they can cause and influence other entries. | Must | Agreed | Round 19 |

# Relationships (REL)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-REL-001 | An entry can depend on one or more other entries. A dependency means "this could not have happened without that". It suits inventions and developments best. Example: a laptop depends on thin, low-power screens. | Must | Agreed | Brief |
| REQ-REL-002 | Whatever an entry depends on, was caused by or was influenced by must have happened before it. Example: something can depend on the writing of the Twelve Tables while the Roman Republic is still going on. | Must | Agreed | Brief, clarified in Rounds 2 and 19 |
| REQ-REL-003 | An entry can be part of another entry. Periods can be part of larger periods. Example: the Tang dynasty is part of Chinese civilisation. | Must | Agreed | Brief, confirmed in Round 4 |
| REQ-REL-004 | An entry can be preceded by or followed by another entry. Example: Windows 95 followed Windows 3.1. | Later | Agreed | Brief |
| REQ-REL-005 | An entry can be influenced by another entry. This is a softer link than a dependency or a cause. Example: the US Constitution was influenced by the governance of the Iroquois Confederacy. | Must | Agreed | Brief, brought forward in Round 19 |
| REQ-REL-007 | The system rejects circular links, where an entry ends up depending on, being caused by or being influenced by itself through a chain of other entries. | Must | Proposed | Analyst |
| REQ-REL-008 | For any moment, the user can see every link in both directions: what it depended on and what it enabled, what caused it and what it caused, and what influenced it and what it influenced. | Must | Agreed | Round 1, widened in Round 19 |
| REQ-REL-009 | The rule in REQ-REL-002 takes account of how precisely each date is known. A link is only rejected when its earlier end certainly happened later than its later end. | Must | Agreed | Round 2, confirmed in Round 4 |
| REQ-REL-010 | A link of any kind can carry a short note explaining why it exists, for example "lithium-ion batteries made the laptop portable". Where a note would explain a step that is itself an event, the event is added instead. | Should | Agreed | Analyst, agreed in Round 19 |
| REQ-REL-011 | Links of every kind are always between moments, never to or from a period as a whole. Example: Roman law depends on the writing of the Twelve Tables, not on the Roman Republic. | Must | Agreed | Round 2, revised in Rounds 3 and 19 |
| REQ-REL-012 | Every link has a kind: depends on, caused by or influenced by. A cause brought the later entry about, but need not be something it could not have happened without. Causes suit historical events best. Example: World War II was caused in part by the Treaty of Versailles. | Must | Agreed | Round 19 |
| REQ-REL-013 | Any kind of link can join any two moments, whatever they are about, so that inventions, events and ideas can be joined. Example: the atomic bombing of Hiroshima depended on the atomic bomb, an invention. | Must | Agreed | Round 19 |
| REQ-REL-014 | A cause can record how directly it brought its effect about: as an immediate cause, an ordinary cause or a contributing factor. | Should | Agreed | Round 19 |

# Navigation (NAV)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-NAV-001 | From any moment, the user can move to anything it depended on, was caused by or was influenced by, which lie earlier in time. | Must | Agreed | Round 1, widened in Round 19 |
| REQ-NAV-002 | From any moment, the user can move to anything it enabled, caused or influenced, which lie later in time. | Must | Agreed | Round 1, widened in Round 19 |
| REQ-NAV-003 | The user can browse each kind of relationship of the current entry separately, and choose which kind to browse. | Must | Agreed | Round 1 |
| REQ-NAV-004 | The user can go back along the path they took. | Must | Proposed | Analyst |
| REQ-NAV-005 | The user can ask for a summary of the current entry at any time. | Should | Proposed | Analyst |
| REQ-NAV-006 | The user can ask for the path they have taken to reach the current entry. | Should | Proposed | Analyst |
| REQ-NAV-007 | The user can list the full chain of dependencies of an entry, every ancestor back to the earliest, as a flat, sortable list. | Could | Proposed | Analyst |
| REQ-NAV-015 | When a requested move isn't possible, the user stays where they are. For now this is silent, except for a sound when Left Arrow or Right Arrow has nothing to go to. This is to be reviewed after testing. | Must | Agreed | Analyst, revised in Rounds 6 and 11 |
| REQ-NAV-016 | When later relationship types, such as preceded by and followed by, are added, they can be browsed in the same way as the others. | Later | Agreed | Round 1 |
| REQ-NAV-023 | The user can move from a period into any of the moments it contains, and from a moment up to the periods it belongs to. | Must | Agreed | Round 2, confirmed in Round 4 |
| REQ-NAV-024 | Within a period, the user can move through its moments in date order. | Must | Agreed | Round 4 |

# Screen reader announcements (ANN)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-ANN-004 | Announcements are never stale or duplicated. If the user presses keys quickly, only the latest announcement is spoken. | Must | Proposed | Analyst |
| REQ-ANN-006 | When filters hide entries, the announcement says so. | Should | Proposed | Analyst |
| REQ-ANN-007 | Every move is confirmed by a short announcement that tells the user where they are, including their position within any list. | Must | Proposed | Analyst |
| REQ-ANN-008 | Dates are announced in natural spoken form, including how precisely they are known, for example "around 509 BCE". | Must | Proposed | Analyst |
| REQ-ANN-009 | Short sounds can be used instead of words, where a sound is quicker to understand. Example: a sound when the user can't go any further. | Should | Agreed | Round 5 |
| REQ-ANN-010 | The user can always tell which kind of link joins two entries, how directly a cause acted, and whether a link has a note. | Must | Agreed | Round 19 |

# Visual presentation (VIEW)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-VIEW-001 | The visual presentation resembles a tree of nodes joined by links. | Must | Agreed | Brief |
| REQ-VIEW-002 | Time runs horizontally, with older dates on the left and more recent dates on the right. | Must | Agreed | Brief |
| REQ-VIEW-003 | Sighted users can zoom horizontally and vertically, independently of each other. | Must | Agreed | Brief |
| REQ-VIEW-005 | Thousands of years of early history and the crowded recent centuries can both be viewed usefully. | Should | Proposed | Analyst |
| REQ-VIEW-006 | The visual view and the keyboard navigator always show the same position. A change in one is reflected in the other. | Must | Proposed | Analyst |
| REQ-VIEW-009 | Clicking an entry in the visual view makes it the current entry. | Must | Proposed | Analyst |
| REQ-VIEW-011 | The visual view shows periods with the moments they contain, and shows how precisely each date is known. | Must | Agreed | Round 2, confirmed in Round 3 |
| REQ-VIEW-012 | The visual view shows clearly which periods are still going on. | Must | Agreed | Round 4 |
| REQ-VIEW-013 | Links between entries are drawn so that they don't pass through other entries. | Should | Agreed | Round 7 |
| REQ-VIEW-014 | The user can switch the visual view between a layout where distance across the page is proportional to time, and a layout that keeps links clear of other entries. | Must | Agreed | Round 12 |

# Search and filtering (FIND)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-FIND-001 | The user can search for entries. | Must | Agreed | Brief |
| REQ-FIND-002 | The user can filter entries by tag. | Must | Agreed | Brief |
| REQ-FIND-003 | The user can filter entries by date range. | Must | Agreed | Brief |
| REQ-FIND-004 | Search matches entry names, alternative names and descriptions, and tolerates minor spelling mistakes. | Should | Proposed | Analyst |
| REQ-FIND-005 | The number of search results is announced to screen reader users when results change, without interrupting what is being spoken. | Must | Proposed | Analyst |
| REQ-FIND-006 | Choosing a search result makes it the current entry. | Should | Proposed | Analyst |
| REQ-FIND-007 | Filters apply consistently everywhere entries are shown or announced. | Should | Proposed | Analyst |
| REQ-FIND-008 | The tag filter can match any of the selected tags or all of them, as the user chooses. | Should | Proposed | Analyst |
| REQ-FIND-009 | An index lists every entry, and choosing one makes it the current entry. It is reached from the main page and with a keyboard shortcut. | Must | Agreed | Round 14 |

# Content and data sourcing (CONT)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-CONT-001 | The dataset comes from Wikidata from the outset, not only in a later phase. | Must | Agreed | Brief, Round 1 |
| REQ-CONT-002 | Community members can add and edit entries and relationships. This comes after the first release. | Later | Agreed | Brief, Round 1 |
| REQ-CONT-003 | Every change to an entry or relationship is recorded with who made it and when, and can be reverted. | Later | Proposed | Analyst |
| REQ-CONT-004 | Entries imported from Wikidata keep their Wikidata identifier, so that they can be refreshed and aren't duplicated. | Must | Proposed | Analyst |
| REQ-CONT-005 | The data and the code are published under licences that let anyone use them, and stop anyone from claiming them as their own or limiting others' use. The data is published under CC0. The code is published under AGPL-3.0. | Should | Agreed | Analyst, Rounds 4 and 5 |
| REQ-CONT-006 | The first release is read-only for users. | Must | Agreed | Round 1 |
| REQ-CONT-007 | The initial dataset has 50 to 200 entries, drawn from Wikidata and centred on one or more working examples. "The road to the iPhone" and ChatGPT are the current examples, but they aren't fixed. | Must | Agreed | Round 1, Round 14 |
| REQ-CONT-008 | Links of every kind, and "part of" relationships, are imported from Wikidata, keeping the kind of each link and how directly each cause acted. | Must | Agreed | Round 1, widened in Round 19 |
| REQ-CONT-010 | Entries and relationships that are missing or wrong in Wikidata can be added or corrected, and those corrections survive a fresh import. | Must | Proposed | Analyst |
| REQ-CONT-011 | Data problems found during import, such as missing dates, links that break REQ-REL-002, and circular links, are reported rather than dropped silently. | Must | Proposed | Analyst |

# Maintainability (CODE)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-CODE-001 | The application is "vibe coded": Claude writes the code, directed by the product owner. | Must | Agreed | Round 1 |
| REQ-CODE-002 | The code is divided into units with clear, separate responsibilities. Each unit can be read, understood and changed on its own. Units don't mix responsibilities where that can sensibly be avoided. The coding standards that achieve this are in the Functional Specification, under Non-functional design. | Must | Agreed | Round 1, Round 2 |

# Technology constraints (TECH)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-TECH-001 | The application is hosted on Cloudflare. | Must | Agreed | Round 1 |
| REQ-TECH-002 | The database is one provided by Cloudflare. | Must | Agreed | Round 1 |

# Other non-functional requirements (NFR)

| ID | Requirement | Priority | Status | Source |
|------------|--------------------------------------------------|--------|--------|--------------|
| REQ-NFR-001 | The application runs in current versions of Firefox, Chrome, Edge and Safari. | Must | Proposed | Analyst |
| REQ-NFR-002 | Moving from one entry to another responds within 200 milliseconds on a typical laptop, so that screen reader announcements feel immediate. | Should | Proposed | Analyst |
| REQ-NFR-003 | The application handles at least 100,000 entries and 500,000 relationships without degrading navigation performance. | Later | Proposed | Analyst |
| REQ-NFR-004 | The application is usable on mobile devices, including with VoiceOver on iOS and TalkBack on Android. | Could | Proposed | Analyst |

# Retired requirement IDs

These IDs are retired and won't be reused. Most moved to the Functional Specification in version 0.3, when design decisions were separated from requirements.

| Retired ID | What it was | What happened to it |
|------------|-------------|---------------------|
| REQ-ACC-013 | Single focusable widget | Became DES-SR-001, which was withdrawn in version 0.11 in favour of DES-SR-006. |
| REQ-DATA-010 and REQ-DATA-011 | How dates are stored and displayed | Now DES-DATE-001 to DES-DATE-004. |
| REQ-REL-006 | "Caters for" relationship | Withdrawn in round 4, because its meaning was unclear. |
| REQ-REL-009, old wording | The open question on predates | Resolved by the new REQ-REL-002 and REQ-REL-009 wording. |
| REQ-NAV-008 | | Withdrawn in version 0.2. |
| REQ-NAV-009 to REQ-NAV-014, and REQ-NAV-017 to REQ-NAV-022 | The lists and keystrokes | Now DES-NAV and DES-KEY items. |
| REQ-ANN-001 to REQ-ANN-003, and REQ-ANN-005 | Announcement wording and verbosity levels | Now DES-ANN items. |
| REQ-VIEW-004, REQ-VIEW-007, REQ-VIEW-008 and REQ-VIEW-010 | Drawing details | Now DES-VIEW items. |
| REQ-CONT-009, REQ-CONT-012 and REQ-CONT-013 | How the import works | Now DES-IMP items. |
| REQ-CODE-003 and REQ-CODE-005 to REQ-CODE-008 | Coding standards | Now DES-CODE items. |
| REQ-CODE-004 | The file size limit | Withdrawn in round 2. There is no fixed limit on file size. |
| REQ-TECH-003 to REQ-TECH-007 | Language and libraries | Now DES-TECH items. |

# Open questions

Answered questions are in the Decision Log.

| ID | Question | Notes |
|--------|--------------------------------------------------|--------------------------------------------------|
| Q-28 | Is it clear to hear how strong a cause is, and that a link has a note, from a word at the end of a list entry? For example: "Assassination of Archduke Franz Ferdinand, 1914, immediate, note." | The product owner asked how strength should be shown: in a separate list for each strength, or in words at the end of each entry. The analyst built words at the end (DES-ANN-013, DES-ANN-014), because separate lists would mean up to three more tabs. To be answered after testing with NVDA. |
| Q-29 | Does it work for a link to a whole period to use its end moment when the period is a cause, and its start moment otherwise? | Agreed for now in DEC-69, to be reviewed as the data grows. The import report lists every link moved this way. |

# Decision log

| ID | Decision | Round | Details |
|--------|----------------|----------------|--------------------------------------------------|
| DEC-01 | Keep the name "tree" | 1, 20 October 2026 | Recorded as REQ-VIS-005. |
| DEC-02 | Navigation model | 1, 20 October 2026 | Left Arrow goes earlier and Right Arrow goes later. Each entry has relationship lists arranged like tabs. Ctrl+Left Arrow and Ctrl+Right Arrow switch list, and Up Arrow and Down Arrow move within a list. Recorded as REQ-NAV-001 to REQ-NAV-003, DES-NAV-001 to DES-NAV-003, and DES-KEY-001 to DES-KEY-003. Partly revised by DEC-19. |
| DEC-03 | How the code is built | 1, 20 October 2026 | The application is vibe coded, from small object-oriented units. Recorded as REQ-CODE-001, REQ-CODE-002 and DES-CODE-001. |
| DEC-04 | Hosting and database | 1, 20 October 2026 | Host on Cloudflare and use a Cloudflare database. Recorded as REQ-TECH-001, REQ-TECH-002 and DES-TECH-002. |
| DEC-05 | Language | 1, 20 October 2026 | The product owner had no preference, so the analyst chose TypeScript. Recorded as DES-TECH-001. |
| DEC-06 | Visual library | 1, 20 October 2026 | The choice was delegated to the analyst. Recorded as DES-TECH-005. |
| DEC-07 | The first release is read-only | 1, 20 October 2026 | Recorded as REQ-CONT-002 and REQ-CONT-006. |
| DEC-08 | Starting data | 1, 20 October 2026 | Use Wikidata from the outset, with 50 to 200 entries. The iPhone is a good working example but isn't required. Recorded as REQ-CONT-001, REQ-CONT-007 and REQ-CONT-008. |
| DEC-09 | Requirements and design are kept separate | 2, 20 October 2026 | The analyst decides where each answer belongs. Needs and constraints go in this catalogue. Design decisions go in the Functional Specification as DES items, and coding standards go in its Non-functional design section. This led to the restructuring in version 0.3. |
| DEC-10 | Coding standards | 2, 20 October 2026 | There is no fixed limit on file size. Classes don't mix responsibilities where that can sensibly be avoided. One class per file. Recorded as REQ-CODE-002, DES-CODE-001 and DES-CODE-002. REQ-CODE-004 is withdrawn. |
| DEC-11 | Each list remembers its highlighted entry | 2, 20 October 2026 | Left Arrow always goes to the highlighted dependency, and Right Arrow to the highlighted enabled entry. Answers Q-09. Recorded as DES-NAV-004 and DES-KEY-001. |
| DEC-12 | Mac keystrokes | 2, 20 October 2026 | Option+Left Arrow and Option+Right Arrow switch list on macOS. Answers Q-10. Recorded as DES-KEY-003. |
| DEC-13 | The list on arrival matches the direction of travel | 2, 20 October 2026 | Answers Q-11. Recorded as DES-NAV-005. The product owner noted that this reflects a general need for efficient keyboard navigation, recorded as REQ-ACC-015. |
| DEC-14 | Meaning of "predates" | 2, 20 October 2026 | A dependency must have started before the entry that depends on it started. Answers Q-05. Recorded as REQ-REL-002. |
| DEC-15 | Dates have varying precision | 2, 20 October 2026 | Confirmed REQ-DATA-005. It led to REQ-REL-009 and Q-13. |
| DEC-16 | Periods contain moments | 2, 20 October 2026 | The product owner suggested that an entry lasting a period is a container of moments with fixed dates. Recorded as Proposed in REQ-DATA-002, REQ-DATA-013, REQ-REL-011, REQ-NAV-023 and REQ-VIEW-011, pending Q-12. |
| DEC-17 | Periods are defined by moments, and dependencies link moments | 3, 21 October 2026 | A period is defined by at least a start moment and an end moment, with any number of moments between them. All dependencies are between moments, not to a period. Answers Q-12. The product owner confirmed in round 4 that this is in the first release. Recorded in REQ-DATA-002, REQ-DATA-013 and REQ-REL-011, and in DES-DATA-001 and DES-REL-006. |
| DEC-18 | Rough dates | 4, 21 October 2026 | A dependency must always come first. With rough dates, it is rejected only when it certainly came later. Where data links to a period rather than a moment, the period's start is used, and this is to be reviewed against a sample of real data. Answers Q-13. Recorded as REQ-REL-009, DES-REL-002 and DES-REL-007. |
| DEC-19 | Moving around moments and periods | 4, 21 October 2026 | On a moment, Ctrl+Left Arrow and Ctrl+Right Arrow switch between its lists, Up Arrow and Down Arrow move within a list, and Enter goes to the highlighted entry. More lists may come later. On a period, Left Arrow and Right Arrow step through its moments, and Enter goes into the highlighted moment. Answers Q-14. Led to Q-17 and Q-18. Recorded as REQ-NAV-024, DES-NAV-009, DES-KEY-004, DES-KEY-010 and DES-KEY-011. |
| DEC-20 | Ongoing periods and future dates | 4, 21 October 2026 | A period can still be going on. It is drawn with a jagged right-hand edge at today's date, and a screen reader user who moves to that point hears "Ongoing". Dates can be in the future for planned things, such as the 2028 Olympic Games. Answers Q-15. Recorded as REQ-DATA-006, REQ-DATA-014, REQ-VIEW-012, DES-DATA-002, DES-DATE-005, DES-NAV-009, DES-ANN-009 and DES-VIEW-002. |
| DEC-21 | Periods within periods | 4, 21 October 2026 | A period can be part of a larger period. Answers Q-16. Recorded as REQ-REL-003 and DES-DATA-003. |
| DEC-22 | Location | 4, 21 October 2026 | A moment can have a location. Answers Q-06. Recorded as REQ-DATA-009 and DES-DATA-007. |
| DEC-23 | "Caters for" is dropped | 4, 21 October 2026 | Nobody remembers what it meant. Answers Q-07. REQ-REL-006 is withdrawn. |
| DEC-24 | Licence principle | 4, 21 October 2026 | No one should be able to claim anything as their own or limit others from using it. The product owner asked for advice on specific licences, now in Q-08. Recorded as REQ-CONT-005. |
| DEC-25 | Licences | 5, 21 October 2026 | Data under CC0 and code under AGPL-3.0. The product owner has no plan to give data back to Wikidata, but agreed with both choices. Answers Q-08. Recorded as REQ-CONT-005. |
| DEC-26 | Left and Right Arrow on a moment | 5, 21 October 2026 | Left Arrow goes to the highlighted dependency when the Dependencies list is active. Right Arrow goes to the highlighted enabled entry when the Enabled list is active. Enter does the same. Answers Q-17. Recorded as DES-KEY-001. |
| DEC-27 | Going up and going back | 5, 21 October 2026 | On a period, Up Arrow goes to the larger period it is part of. Backspace always goes back the way the user came. Answers most of Q-18. The rest is Q-19. Recorded as DES-KEY-005, DES-KEY-012 and DES-NAV-007. |
| DEC-28 | Future dates | 5, 21 October 2026 | Future moments aren't announced as "planned", because the date shows that already. The visual view has a line for today, and planned things have dashed outlines. Recorded as DES-VIEW-009. DES-ANN-010 is withdrawn. |
| DEC-29 | A sound at the ends of a period | 5, 21 October 2026 | Trying to step past the start or end of a period plays a "D'oh" sound, which the product owner will supply. Recorded as REQ-ANN-009 and DES-ANN-011. |
| DEC-30 | Build in small steps | 5, 21 October 2026 | Build first with a handful of made-up moments, then add hand-made periods, and only then import from Wikidata. Recorded in the Implementation Plan, Phase 0. |
| DEC-31 | Left and Right Arrow on the wrong list | 6, 21 October 2026 | Left Arrow when the Dependencies list isn't active, and Right Arrow when the Enabled list isn't active, do nothing, silently. Recorded as DES-KEY-013. |
| DEC-32 | The Part of list on a moment | 6, 21 October 2026 | A moment has a Part of list, reached with Ctrl+Left Arrow and Ctrl+Right Arrow. Enter on a period in it goes to that period. A moment can be part of more than one period. Answers Q-19. It raised Q-21. Recorded as DES-NAV-002. |
| DEC-33 | Impossible moves are silent | 6, 21 October 2026 | For now, when a move isn't possible, nothing happens and nothing is announced, except for the sound at the ends of a period. To be reviewed after testing. Answers Q-20. Recorded as REQ-NAV-015, DES-NAV-008, DES-ANN-007 and DES-KEY-012. |
| DEC-34 | Public repository | 6, 21 October 2026 | The project is kept in a public repository on GitHub. Recorded as DES-TECH-006. |
| DEC-35 | Real sample moments | 6, 21 October 2026 | The hand-made sample for Step 0A uses real moments, with dates as accurate as can easily be found. |
| DEC-36 | Going up from a period | 6, 21 October 2026 | Periods have a Part of list, reached in the same way as on a moment, instead of using Up Arrow. Answers Q-21. Recorded as DES-NAV-012. DES-KEY-012 is withdrawn. |
| DEC-37 | Findings from the first test of Step 0A | 6, 21 October 2026 | Escape from the Details region left the user stuck, with the arrow keys not responding. After moving, it wasn't clear that a list was active. Fixed by DES-KEY-008, DES-SR-004 and DES-ANN-001. |
| DEC-38 | Findings from the second test of Step 0A | 7, 21 October 2026 | Escape from Details now works. The hint about NVDA+Space is removed. The screen reader's "read current line" command must read the current position. Recorded as REQ-ACC-016 and DES-SR-005. |
| DEC-39 | The path is read in date order | 7, 21 October 2026 | P names the moments on the path from oldest to newest. Recorded as DES-KEY-006. |
| DEC-40 | Try different visual layouts | 7, 21 October 2026 | Sighted users should see a tree stretching to the left, with the most recent entry on the right, and links shouldn't pass through other boxes. Try a linear time axis against a time slot for each entry. Recorded as REQ-VIEW-013, DES-VIEW-005 and DES-VIEW-010. Led to Q-22. |
| DEC-41 | Path wording | 8, 21 October 2026 | P says "Path, 3 moments:" and then the names, without dates. Recorded as DES-KEY-006. |
| DEC-42 | Visual layouts come after periods | 8, 21 October 2026 | The layout experiment, Step 0D, comes after Step 0B and before the Wikidata import. The product owner hopes to have friends review it. Answers Q-22. |
| DEC-43 | NVDA+Up Arrow didn't work | 8, 21 October 2026 | The single line of text in the navigator wasn't read by NVDA+Up Arrow. Led to Q-23. |
| DEC-44 | The current moment is a card of standard controls | 8, 21 October 2026 | A heading, a read-only summary box, a read-only description box, a tab control and a list box, so that NVDA's own commands work. The Details region and the I key are removed. Answers Q-23. Recorded as DES-SR-006, DES-SR-007 and DES-KEY-014. |
| DEC-45 | Findings from testing the card | 9, 21 October 2026 | NVDA+Up Arrow now reads the current line. Tabbing into a text box should land on the top line, not the bottom one. Tab from the description should go to the list, not the tabs. Remembering the caret position within a moment is good. Recorded as DES-SR-006. |
| DEC-46 | Less speech when switching list | 10, 21 October 2026 | Switching list said "Dependency Tree document, main landmark" and the moment's name before the list. Landmarks are removed, and after switching, the list's label is just its name. Recorded as DES-SCR-001, DES-ANN-003 and DES-SR-007. |
| DEC-47 | Shorter dates in lists | 10, 21 October 2026 | More than 3 years from today: the year only. Within 12 months: the full date, if known. In between: month and year. Recorded as DES-DATE-006. |
| DEC-48 | Periods built | 10, 21 October 2026 | Step 0B is built with three real periods: the Cold War, the Space Race inside it, and the Information Age, which is still going on. The "D'oh" sound is sounds/bump.wav. Recorded as DES-ANN-011 and DES-NAV-012. |
| DEC-49 | The bump sound | 10, 21 October 2026 | The sound at the ends of a period is called the bump sound. The product owner recorded it, so it can be published in the repository as sounds/bump.wav. Recorded as DES-ANN-011. |
| DEC-50 | "None" in an empty list | 11, 23 October 2026 | NVDA+Up Arrow was silent in an empty list. An empty list now shows one item, "None", and its label no longer adds "none". Recorded as DES-ANN-003. |
| DEC-51 | Left Arrow and Right Arrow only go to other entries | 11, 23 October 2026 | In a period's Moments list, Left Arrow and Right Arrow moved through the list. For consistency they now do nothing there; Up Arrow and Down Arrow move, and Enter goes into an entry. The bump sound moves too: it now plays when Left Arrow is pressed on an empty Dependencies list, or Right Arrow on an empty Enabled list. Recorded as DES-KEY-010, DES-KEY-013, DES-ANN-011 and DES-NAV-012. |
| DEC-52 | Visual layout experiment built | 12, 23 October 2026 | Step 0D is built, with four layouts chosen from a drop-down list. The analyst decided that the drawing is hidden from screen readers, because the card already gives everything it shows, and that clicking an entry goes to it and is recorded in the path. Recorded as DES-VIEW-008, DES-VIEW-011 and DES-VIEW-012. Led to Q-24. |
| DEC-53 | Linear and layered layouts, with a choice | 12, 23 October 2026 | The user must be able to switch between linear time and the layered layout, so both are kept. Compressed time and time slots are dropped. Answers Q-24. Recorded as REQ-VIEW-014, DES-VIEW-005 and DES-VIEW-011. |
| DEC-54 | Wikidata import built | 13, 23 October 2026 | Step 0C is built. The analyst checked the proposed properties against real data and widened them: the root is the original iPhone (Q621427), hardware properties count as dependencies, and launch dates and "mul" labels are read. The sample's links and periods are carried over through the curation file. The page keeps the sample unless ?data=seed is added. Recorded as DES-IMP-002, DES-IMP-004, DES-IMP-005 and DES-IMP-009 to DES-IMP-011. Led to Q-25 to Q-27. |
| DEC-55 | Keep the political history | 14, 23 October 2026 | The entries that "has cause" and "has effect" bring in, such as the World Wars and the end of the Soviet Union, stay in the seed set. Answers Q-25. |
| DEC-56 | Dates from Wikipedia | 14, 23 October 2026 | The product owner has no way to date items other than Wikipedia, so Claude looks up a few that matter. The microphone, loudspeaker, antenna, rechargeable battery, Proximal Policy Optimization and transfer learning were dated this way. The accelerometer, proximity sensor, reinforcement learning from human feedback and unsupervised learning have no clear first date, so stay out. Answers Q-26. Recorded as DES-IMP-009. |
| DEC-57 | "Begins" and "ends" | 14, 23 October 2026 | A period's start and end moments are named like "World War I begins" and "World War I ends". Answers Q-27. Recorded as DES-IMP-008. Replaced by DEC-60. |
| DEC-58 | More than one top item | 14, 23 October 2026 | The import starts from several roots. ChatGPT joins the iPhone, chosen as the only candidate with a rich chain of links in Wikidata. The International Space Station, the Large Hadron Collider and the Tesla Model S were checked, but have few dated links. Recorded as REQ-CONT-007 and DES-IMP-002. |
| DEC-59 | An index | 14, 23 October 2026 | An index of every entry, with a search box, reached from the main page and with slash. Choosing an entry makes it current, so any entry can become the starting point for walking back. Recorded as REQ-FIND-009, DES-FIND-004 and DES-KEY-007. |
| DEC-60 | Periods start and end with real moments | 15, 23 October 2026 | A period's start and end are real moments, such as the invasion that started a war and the surrender that ended it, not entries called "begins" and "ends". So every period has at least two moments, and its first and last stops are its start and end. Replaces DEC-57. Recorded as DES-DATA-008 and DES-IMP-008. |
| DEC-61 | Page Up and Page Down in lists | 15, 23 October 2026 | In the index list, Page Up and Page Down left NVDA saying only "Dependency tree document". They now move ten entries, in the index and in the card's lists. Recorded as DES-KEY-002 and DES-FIND-004. |
| DEC-62 | Entries need an English name | 15, 23 October 2026 | An entry was named Q33593042, because it had no English label. An item's English Wikipedia title is now used when there is no label, and an item with neither is left out. Recorded as DES-IMP-012. |
| DEC-63 | Say "Event:" before a moment | 16, 23 October 2026 | On arriving at a moment, NVDA reads "Event:" before its name, so it is clear what kind of entry it is. A period needs no word before it, because its range of dates shows it is a period. Recorded as DES-ANN-001. |
| DEC-64 | "Event:" everywhere in the tree | 17, 23 October 2026 | Space didn't say "Event:". A moment's name now starts with "Event:" wherever the tree names it, so the user can always tell a moment from a period. Extends DEC-63. Recorded as DES-ANN-012. |
| DEC-65 | No "Event:" in lists of moments | 18, 23 October 2026 | DEC-64 went too far: the Dependencies and Enabled lists obviously hold events, so their entries don't need "Event:". It stays where moments and periods could be confused: on arrival, in the index, in Space, and in the heading and summary box. Recorded as DES-ANN-012. |
| DEC-66 | Three kinds of link | 19, 23 October 2026 | Every link has a kind: depends on, caused by or influenced by. Each link is stored once and read in both directions: Depended on and Enabled, Caused by and Caused, Influenced by and Influenced. Dependencies suit inventions, and causes suit historical events, because a series of battles is mostly a timeline unless the links say how one led to another. The Dependencies list is renamed Depended on, to match the others. Recorded as REQ-VIS-002, REQ-VIS-006, REQ-REL-005, REQ-REL-012, REQ-NAV-001, REQ-NAV-002, DES-REL-001 and DES-NAV-002. |
| DEC-67 | How strong a cause is | 19, 23 October 2026 | A cause can be immediate, ordinary or contributing, as Wikidata records them. The product owner asked how to present this. The analyst proposed a word at the end of the list entry, now Q-28. Recorded as REQ-REL-014, DES-REL-008 and DES-ANN-013. |
| DEC-68 | Any link between any two moments | 19, 23 October 2026 | Inventions, events and ideas can be joined by any kind of link. Example: Hiroshima depended on the atomic bomb. Recorded as REQ-REL-013. |
| DEC-69 | Which end of a period a link uses | 19, 23 October 2026 | A link to a whole period uses its end moment when the period is a cause, and its start moment for the other kinds. The curation file can choose the other end. Agreed for now, to see how it goes (Q-29). Example: the Paris Peace Conference was caused by World War I, so it links to the Armistice of Compiègne. Recorded as DES-REL-007. |
| DEC-70 | Notes on links | 19, 23 October 2026 | Where a step needs explaining, adding the event in the middle is preferred to a note, but notes are kept for steps too small to be events. Example: "the Allies build up troops in Britain" is an event, Operation Bolero. A note is shown on the card only when it has content. Recorded as REQ-REL-010, DES-REL-009, DES-ANN-014 and DES-SR-006. |
| DEC-71 | Ideas are kept | 19, 23 October 2026 | Ideas that Wikidata gives as causes, such as revanchism and Leninism, are part of the picture. They are moments, dated by when they first appeared, and their names start with "Idea:". Recorded as REQ-DATA-015, DES-DATA-009, DES-ANN-012 and DES-IMP-013. |
| DEC-72 | Empty lists are hidden | 19, 23 October 2026 | With six kinds of linked list, a moment shows only the lists that have entries. Left Arrow and Right Arrow now follow any list going their way through time, and the bump sound plays when there is nothing at all that way. Recorded as DES-NAV-003, DES-NAV-005, DES-KEY-001, DES-KEY-013 and DES-ANN-011. |
| DEC-73 | The hand-made sample is dropped | 19, 23 October 2026 | The page opens the Wikidata seed set, and the sample file and its tests are removed. Recorded as DES-IMP-011. |
| DEC-74 | The second import | 19, 23 October 2026 | The analyst imported again with the three kinds of link: 121 moments and 11 periods, with 43 depends-on, 41 caused-by and 18 influenced-by links, and 5 ideas. Wikidata has causes for World War I, World War II and the end of the Soviet Union, and influences between programming languages, but none for the Normandy landings, Operation Bolero or the Battle of the Atlantic, so such a chain would come from the curation file. Cisleithania and the Lands of the Crown of Saint Stephen are excluded, because they list centuries of crown lands as their parts. A children's novel given as an effect of Perestroika is excluded. Recorded in DES-IMP-004, DES-IMP-005 and the Implementation Plan. |

# Change history

- **0.25**, 23 October 2026: Recorded the round 19 decisions, DEC-66 to DEC-74: three kinds of link, ideas, notes and hidden empty lists. Added REQ-VIS-006, REQ-DATA-015, REQ-REL-012 to REQ-REL-014 and REQ-ANN-010. Brought REQ-REL-005, influence, forward to Must. Widened REQ-VIS-002, REQ-REL-002, REQ-REL-007 to REQ-REL-011, REQ-NAV-001, REQ-NAV-002, REQ-NAV-016, REQ-CONT-008 and REQ-CONT-011 to every kind of link. Added Q-28 and Q-29.
- **0.24**, 23 October 2026: Recorded DEC-65.
- **0.23**, 23 October 2026: Recorded DEC-64.
- **0.22**, 23 October 2026: Recorded DEC-63.
- **0.21**, 23 October 2026: Recorded DEC-60 to DEC-62, from testing the index and the seed set.
- **0.20**, 23 October 2026: Recorded DEC-55 to DEC-59, answering Q-25 to Q-27. Added REQ-FIND-009, the index. REQ-CONT-007 allows several working examples.
- **0.19**, 23 October 2026: Recorded DEC-54, the Wikidata import. Added Q-25 to Q-27.
- **0.18**, 23 October 2026: Recorded DEC-53, answering Q-24. Added REQ-VIEW-014.
- **0.17**, 23 October 2026: Recorded DEC-52, and added Q-24.
- **0.16**, 23 October 2026: Recorded DEC-51, and revised REQ-NAV-015 and REQ-NAV-024.
- **0.15**, 23 October 2026: Recorded DEC-50.
- **0.14**, 21 October 2026: Recorded DEC-49, and renamed the "D'oh" sound to the bump sound.
- **0.13**, 21 October 2026: Recorded DEC-46 to DEC-48.
- **0.12**, 21 October 2026: Recorded DEC-45.
- **0.11**, 21 October 2026: Recorded DEC-44, answering Q-23. There are no open questions.
- **0.10**, 21 October 2026: Recorded DEC-41 to DEC-43, answering Q-22. Added Q-23.
- **0.9**, 21 October 2026: Recorded DEC-38 to DEC-40. Added REQ-ACC-016 and REQ-VIEW-013, and Q-22.
- **0.8**, 21 October 2026: Recorded DEC-36, answering Q-21, and DEC-37, the findings from the first test of Step 0A. There are no open questions.
- **0.7**, 21 October 2026: Recorded the round 6 decisions, DEC-31 to DEC-35, answering Q-19 and Q-20. Revised REQ-NAV-015. Added Q-21.
- **0.6**, 21 October 2026: Recorded the round 5 decisions, DEC-25 to DEC-30, answering Q-08, Q-17 and most of Q-18. Added REQ-ANN-009. Agreed the licences in REQ-CONT-005. Added Q-19 and Q-20.
- **0.5**, 21 October 2026: Recorded the round 4 decisions, DEC-18 to DEC-24. Added REQ-DATA-014, REQ-NAV-024 and REQ-VIEW-012. Withdrew REQ-REL-006. Put every requirement, question and decision in tables. Added Q-17 and Q-18, and a licence recommendation in Q-08.
- **0.4**, 21 October 2026: Recorded the round 3 decision on periods and moments (DEC-17), answering Q-12. Reworded Q-13 and Q-14. Added Q-15 and Q-16.
- **0.3**, 20 October 2026: Moved design decisions to the Functional Specification as DES items, keeping this catalogue to needs and constraints. Recorded the round 2 decisions. Added the moments-and-periods model. Withdrew the file size limit. Added questions Q-12 to Q-14.
- **0.2**, 20 October 2026: Recorded the round 1 decisions. Added groups ANN, CODE and TECH.
- **0.1**, 20 October 2026: first draft created from the original brief.
