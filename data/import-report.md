# Wikidata import report

Made on 2026-10-23. The seed file is data/seed.json, and the corrections are in data/curation.json.

## Summary

| What | Count |
|---|---|
| Wikidata items in the seed set | 132 |
| Moments | 121 |
| Periods | 11 |
| Depends-on links in the seed file | 43 |
| Caused-by links in the seed file | 41 |
| Influenced-by links in the seed file | 18 |
| Ideas | 5 |
| Items left out for having no English name | 5 |
| Items left out for having no date | 88 |
| Items left out for coming later than what links to them | 25 |
| Links read to items outside the seed set | 130 |
| Stopped at the most entries allowed | No |

## Links by property

"Read" counts every link found, including links to items outside the seed set. "Kept" counts the links in the seed file.

| Property | Name | Gives | Read | Kept |
|---|---|---|---|---|
| P2283 | uses | depends on | 24 | 6 |
| P144 | based on | depends on | 5 | 2 |
| P1547 | depends on software | depends on | 0 | 0 |
| P618 | source of energy | depends on | 1 | 1 |
| P5307 | display technology | depends on | 2 | 1 |
| P9192 | sensors | depends on | 4 | 1 |
| P479 | input device | depends on | 1 | 1 |
| P2935 | connector | depends on | 2 | 0 |
| P306 | operating system | depends on | 16 | 3 |
| P880 | CPU | depends on | 0 | 0 |
| P828 | has cause | caused by | 30 | 16 |
| P1478 | has immediate cause | caused by, immediate | 4 | 2 |
| P1479 | has contributing factor | caused by, contributing | 8 | 5 |
| P737 | influenced by | influenced by | 19 | 18 |
| P527 | has part(s) | depends on | 71 | 14 |
| P1542 | has effect | caused by, read backwards | 40 | 17 |
| P1536 | immediate cause of | caused by, immediate, read backwards | 5 | 0 |
| P1537 | contributing factor of | caused by, contributing, read backwards | 8 | 1 |
| curation | the curation file | as the curation file says | 14 | 14 |

## Items left out for having no date

These were reached, but have none of the date properties, so they are left out and not walked through. The curation file can give them a date.

| Wikidata ID | Name | Seed entries that link to it |
|---|---|---|
| Q796765 | proximity sensor | 1 |
| Q192940 | accelerometer | 1 |
| Q20827152 | ambient light sensor | 1 |
| Q3271837 | Apple dock connector | 1 |
| Q394226 | phone connector | 1 |
| Q115570683 | reinforcement learning from human feedback | 1 |
| Q117286419 | fine-tuning | 1 |
| Q131535482 | OpenAI o3 | 1 |
| Q492 | memory | 1 |
| Q127878612 | ChatGPT Search | 1 |
| Q137535475 | Custom GPTs v praxi: Vytvor si vlastného ChatGPT asistenta na mieru | 1 |
| Q124362921 | GPT Store | 1 |
| Q124617885 | ChatGPT Enterprise | 1 |
| Q9690903 | International Federation for Victory Over Communism | 2 |
| Q620681 | process engineering device | 1 |
| Q1068715 | telecommunications network | 1 |
| Q1072430 | die | 1 |
| Q1074550 | integrated circuit packaging type | 1 |
| Q176300 | p–n junction | 1 |
| Q61774825 | ARPANET Reference Model | 2 |
| Q173350 | printed circuit board | 1 |
| Q870870 | push-button | 1 |
| Q327065 | display device | 1 |
| Q221989 | deep web | 1 |
| Q1476753 | surface web | 1 |
| Q157136 | Lebensraum | 2 |
| Q182121 | anti-communism | 2 |
| Q26078 | Fall Weiss | 1 |
| Q4344831 | Parade of sovereignties | 1 |
| Q4314781 | ethnic nationalism in Russia | 1 |
| Q203989 | liquid crystal | 1 |
| Q1152135 | unsupervised learning | 1 |
| Q141647682 | GPT-3 Small | 1 |
| Q141647683 | GPT-3 Medium | 1 |
| Q141647684 | GPT-3 Large | 1 |
| Q141647685 | GPT-3 XL | 1 |
| Q141647686 | GPT-3 2.7B | 1 |
| Q141647687 | GPT-3 6.7B | 1 |
| Q141647688 | GPT-3 13B | 1 |
| Q141647690 | GPT-3 Ada | 1 |
| Q141647691 | GPT-3 Babbage | 1 |
| Q141647692 | GPT-3 Curie | 1 |
| Q141647693 | GPT-3 Davinci | 1 |
| Q141657075 | Text Ada 001 | 1 |
| Q141657076 | Text Babbage 001 | 1 |
| Q141657077 | Text Curie 001 | 1 |
| Q141657078 | Text Davinci 001 | 1 |
| Q9197445 | LED display | 2 |
| Q123002438 | magnetic card reader | 1 |
| Q215292 | power connector | 1 |
| Q1143070 | software suite | 1 |
| Q1394 | Vladimir Lenin | 1 |
| Q189844 | censorship in the Soviet Union | 1 |
| Q352308 | Apple GS/OS | 1 |
| Q43627 | Mac operating system | 1 |
| Q714999 | causes of World War II | 2 |
| Q352 | Adolf Hitler | 2 |
| Q2298962 | providentialism | 1 |
| Q6223 | fascism | 1 |
| Q226418 | chauvinism | 1 |
| Q8461 | racism | 1 |
| Q574578 | Nazi | 1 |
| Q6015447 | incremental computation | 1 |
| Q166154 | line segment | 1 |
| Q1192556 | IO.SYS | 1 |
| Q1192693 | MSDOS.SYS | 1 |
| Q971787 | COMMAND.COM | 1 |
| Q300115 | AUTOEXEC.BAT | 1 |
| Q1079369 | CONFIG.SYS | 1 |
| Q904228 | DOS API | 1 |
| Q3141148 | FAT16 | 1 |
| Q3063042 | FAT12 | 1 |
| Q33742 | natural language | 1 |
| Q113173 | Gennady Yanayev | 1 |
| Q279164 | Boris Pugo | 1 |
| Q435367 | Valentin Pavlov | 1 |
| Q2019186 | Oleg Baklanov | 1 |
| Q382145 | Vladimir Kryuchkov | 1 |
| Q553544 | Vasily Starodubtsev | 1 |
| Q4457171 | Alexander Tizyakov | 1 |
| Q48041 | Dmitry Yazov | 1 |
| Q698752 | white supremacy | 1 |
| Q14656 | Unix-like operating system | 1 |
| Q1670222 | TOPS-10 | 1 |
| Q18121382 | multiple causes | 1 |
| Q4763720 | Anglo–German naval arms race | 2 |
| Q310802 | causes of World War I | 1 |
| Q17097756 | Serbian nationalism | 1 |

## Items left out for coming later

These were reached only from entries that certainly came before them, so they can't be what those entries depended on, were caused by or were influenced by, and the walk doesn't go through them.

| Wikidata ID | Name |
|---|---|
| Q17058718 | iPhone OS 1 |
| Q16927834 | iPhone OS 2 |
| Q16969690 | iPhone OS 3 |
| Q116709136 | GPT-4 |
| Q125919502 | GPT-4o |
| Q135297698 | GPT-5 |
| Q136785965 | GPT-5.1 |
| Q137401468 | GPT-5.2 |
| Q123244854 | ChatGPT educates college students about sexual violence and its impact on their mental health: a proposal |
| Q117303591 | ChatGPT Plus |
| Q230110 | SIM card |
| Q35127 | website |
| Q2102143 | The Sinews of Peace |
| Q151290 | Battle of Moscow |
| Q141647694 | Babbage 002 |
| Q141647695 | Davinci 002 |
| Q5249463 | Declaration of the Creation of the Union of Soviet Socialist Republics |
| Q1066510 | MS-DOS Editor |
| Q633192 | UNIX System V |
| Q1406 | Microsoft Windows |
| Q283705 | z/OS |
| Q781443 | MVS |
| Q11215 | Windows 7 |
| Q388 | Linux |
| Q329618 | German colonial empire |

## Items left out for having no English name

These have no English label and no English Wikipedia article, so they are left out. The curation file can name them.

| Wikidata ID | Description |
|---|---|
| Q33593042 |  |
| Q12409427 |  |
| Q19227157 |  |
| Q19166862 |  |
| Q20723345 |  |

## Periods and their start and end moments

| Period | Starts with | Ends with |
|---|---|---|
| Cold War | Truman Doctrine | Dissolution of the Soviet Union |
| Space race | Sputnik 1 | Apollo–Soyuz |
| Information Age | Microprocessor | still going on |
| World War II | 1939 Invasion of Poland | Japanese Instrument of Surrender |
| Eastern Front | Operation Barbarossa | German Instrument of Surrender |
| World War I | War declaration of Austria-Hungary to Serbia | Armistice of Compiègne |
| Sputnik programme | Sputnik 1 | Korabl-Sputnik 5 |
| Soyuz programme | Soyuz TM-12 | still going on |
| European Theater of World War II | 1939 Invasion of Poland | German Instrument of Surrender |
| Eastern European theatre of World War II | 1939 Invasion of Poland | German Instrument of Surrender |
| Interwar period | Armistice of Compiègne | 1939 Invasion of Poland |

## Items imported as moments instead of periods

Wikidata gives these as periods, but none of their events or parts falls on their start or end date, so they are moments at their start date. The curation file can name their start and end moments.

| Item | No real moment found for |
|---|---|
| Apollo–Soyuz | start and end |
| German Instrument of Surrender | start |
| Operation Barbarossa | start and end |
| 1939 Invasion of Poland | end |
| Perestroika | end |
| Treaty on the Creation of the Union of Soviet Socialist Republics | start and end |
| 1991 Soviet coup d'état attempt | start and end |
| Revolutions of 1989 | start and end |
| Reykjavík Summit | start and end |
| 19th All-Union Conference of the Communist Party of the Soviet Union | start and end |
| Singing Revolution | start and end |
| Treaty of Versailles | start |
| Molotov–Ribbentrop Pact | start and end |
| Nazism | start and end |
| Xenix | start and end |
| Paris Peace Conference | start and end |
| Battles of Khalkhin Gol | start and end |
| Gorbachev's anti-alcohol campaign | start and end |
| Scramble for Africa | start and end |
| Unification of Italy | start and end |
| Franco-Prussian War | start and end |
| Apollo Applications Program | start and end |
| Calculator | start |
| Apollo program | start |
| Walkie-talkie | start |
| Soviet–Japanese border conflicts | start and end |
| Central Powers | start and end |
| Unification of Germany | start and end |

## Links moved to one of a period's moments

These link to a whole period, so one of its moments is used instead (DES-REL-007): the end moment when the period is a cause, and otherwise the start moment. The curation file can choose the other end.

| Later | Link | Earlier | Period moved to | Property |
|---|---|---|---|---|
| Cold War | caused by | World War II | Cold War, its start and World War II, its end | has effect (P1542) |
| Cold War | caused by | Eastern Front | Cold War, its start and Eastern Front, its end | has effect (P1542) |
| World War II | caused by | Treaty of Versailles | World War II, its start | has cause (P828) |
| World War II | caused by | Molotov–Ribbentrop Pact | World War II, its start | has cause (P828) |
| World War II | caused by | Revanchism | World War II, its start | has cause (P828) |
| World War II | caused by | Secret Additional Protocol to the Molotov–Ribbentrop Pact | World War II, its start | has immediate cause (P1478) |
| Eastern Front | caused by | Nazism | Eastern Front, its start | has cause (P828) |
| World War II | caused by | Treaty of Versailles | World War II, its start | has effect (P1542) |
| Eastern Front | caused by | The Main Task of Our Time | Eastern Front, its start | has effect (P1542) |
| Paris Peace Conference | caused by | World War I | World War I, its end | has cause (P828) |
| Paris Peace Conference | caused by | World War I | World War I, its end | has effect (P1542) |
| World War I | caused by | Assassination of Archduke Franz Ferdinand | World War I, its start | has immediate cause (P1478) |
| World War I | caused by | 1912 German federal election | World War I, its start | has contributing factor (P1479) |
| World War I | caused by | Alsace–Lorraine | World War I, its start | has contributing factor (P1479) |
| World War I | caused by | Scramble for Africa | World War I, its start | has contributing factor (P1479) |
| World War I | caused by | Triple Alliance | World War I, its start | has contributing factor (P1479) |
| World War I | caused by | Triple Entente | World War I, its start | has contributing factor (P1479) |
| World War I | caused by | July Crisis | World War I, its start | has effect (P1542) |
| World War I | caused by | Assassination of Archduke Franz Ferdinand | World War I, its start | immediate cause of (P1536) |
| World War I | caused by | Triple Alliance | World War I, its start | contributing factor of (P1537) |
| World War I | caused by | Alsace–Lorraine | World War I, its start | contributing factor of (P1537) |
| World War I | caused by | Triple Entente | World War I, its start | contributing factor of (P1537) |
| World War I | caused by | Scramble for Africa | World War I, its start | contributing factor of (P1537) |
| World War I | caused by | 1912 German federal election | World War I, its start | contributing factor of (P1537) |
| German Empire | caused by | World War I | World War I, its start | has effect (P1542) |
| Austria–Hungary | caused by | World War I | World War I, its start | has effect (P1542) |
| Russian Empire | caused by | World War I | World War I, its start | has effect (P1542) |

## Links that broke the predates rule

Each earlier end certainly came after the later one, so the link is left out (DES-REL-002).

| Later | Its date | Link | Earlier | Its date | Property |
|---|---|---|---|---|---|
| SIMSCRIPT | 1962 | depends on | SunOS | 1982 | operating system (P306) |
| July Crisis | 23 July 1914 | depends on | War declaration of Austria-Hungary to Serbia | 28 July 1914 | has part(s) (P527) |
| German Empire | 1 January 1871 | caused by | War declaration of Austria-Hungary to Serbia | 28 July 1914 | has effect (P1542) |
| Austria–Hungary | 1 March 1867 | caused by | War declaration of Austria-Hungary to Serbia | 28 July 1914 | has effect (P1542) |
| Russian Empire | 22 October 1721 | caused by | War declaration of Austria-Hungary to Serbia | 28 July 1914 | has effect (P1542) |

## Circular links

None.

## Entries outside their period

Each entry certainly falls outside the period's dates, so it is left out of the period (DES-DATA-006).

| Period | Entry |
|---|---|
| World War I | Paris Peace Conference |
| World War I | July Crisis |
| Soyuz programme | Apollo–Soyuz |

## Notes on the curation file

None.

## Entries in the seed file

Oldest first.

| Name | Date | Earlier links | Later links | Wikidata ID |
|---|---|---|---|---|
| Russian Empire | 22 October 1721 | 0 | 1 | Q34266 |
| Voltaic pile | 1800 | 0 | 3 | Q663273 |
| United Kingdom of Great Britain and Ireland | 1 January 1801 | 0 | 1 | Q174193 |
| Unification of Italy (idea) | 1815 | 0 | 1 | Q51122 |
| Lithium | 1817 | 0 | 1 | Q568 |
| Electromagnetic induction | 1831 | 1 | 1 | Q988780 |
| Rechargeable battery | 1859 | 0 | 1 | Q187510 |
| Loudspeaker | 1861 | 0 | 1 | Q570 |
| Kingdom of Italy | 17 March 1861 | 1 | 1 | Q172579 |
| Unification of Germany | 18 August 1866 | 0 | 0 | Q154705 |
| Austria–Hungary | 1 March 1867 | 0 | 1 | Q28513 |
| Revanchism (idea) | 1870s | 0 | 1 | Q1136718 |
| Ems dispatch | 13 July 1870 | 0 | 1 | Q168694 |
| Franco-Prussian War | 19 July 1870 | 1 | 1 | Q46083 |
| French Third Republic | 4 September 1870 | 1 | 1 | Q70802 |
| German Empire | 1 January 1871 | 0 | 1 | Q43287 |
| Alsace–Lorraine | 20 May 1871 | 0 | 1 | Q155144 |
| Microphone | 1876 | 0 | 2 | Q46384 |
| Telephone | 1876 | 2 | 2 | Q11035 |
| Triple Alliance | 1882 | 3 | 1 | Q153867 |
| Scramble for Africa | 1885 | 0 | 1 | Q179848 |
| Antenna | 1886 | 0 | 1 | Q131214 |
| Triple Entente | 17 August 1892 | 3 | 1 | Q177859 |
| Seven-segment display | 1903 | 0 | 1 | Q1046569 |
| 1912 German federal election | 12 January 1912 | 0 | 1 | Q462740 |
| Central Powers | 1914 | 0 | 0 | Q152283 |
| Assassination of Archduke Franz Ferdinand | 28 June 1914 | 0 | 2 | Q192050 |
| July Crisis | 23 July 1914 | 1 | 1 | Q917435 |
| War declaration of Austria-Hungary to Serbia | 28 July 1914 | 7 | 0 | Q130259975 |
| World War I (period) | 28 July 1914 to 11 November 1918 |  |  | Q361 |
| Declaration of the Rights of the Peoples of Russia | 2 November 1917 | 0 | 1 | Q1047454 |
| The Main Task of Our Time | 1918 | 0 | 1 | Q125253429 |
| Armistice of Compiègne | 11 November 1918 | 0 | 1 | Q253224 |
| Interwar period (period) | 11 November 1918 to 1 September 1939 |  |  | Q154611 |
| Paris Peace Conference | 18 January 1919 | 1 | 1 | Q199820 |
| Leninism (idea) | 1920s | 0 | 1 | Q155059 |
| Nazism (idea) | 1920 | 0 | 1 | Q7310 |
| Treaty of Versailles | 10 January 1920 | 1 | 1 | Q8736 |
| Treaty on the Creation of the Union of Soviet Socialist Republics | 29 December 1922 | 0 | 1 | Q1443926 |
| Postfix notation | 1924 | 0 | 1 | Q379695 |
| Treaty of Berlin (1926) | 24 April 1926 | 0 | 1 | Q695215 |
| Walkie-talkie | c. 1940s | 0 | 0 | Q938319 |
| Soviet–Japanese border conflicts | 1 March 1932 | 0 | 0 | Q696389 |
| Secret Additional Protocol to the Molotov–Ribbentrop Pact | 1939 | 0 | 1 | Q4413308 |
| Battles of Khalkhin Gol | 11 May 1939 | 0 | 1 | Q188925 |
| Molotov–Ribbentrop Pact | 23 August 1939 | 2 | 1 | Q130796 |
| 1939 Invasion of Poland | 1 September 1939 | 4 | 0 | Q150812 |
| Battle of the Border | September 1939 | 0 | 0 | Q4366849 |
| Eastern European theatre of World War II (period) | 1 September 1939 to 8 May 1945 |  |  | Q23908696 |
| European Theater of World War II (period) | 1 September 1939 to 8 May 1945 |  |  | Q44700 |
| World War II (period) | 1 September 1939 to 2 September 1945 |  |  | Q362 |
| Soviet partisans | 1941 | 0 | 0 | Q313830 |
| Frontier battles of Operation Barbarossa | June 1941 | 0 | 0 | Q4378114 |
| Eastern Front (period) | 22 June 1941 to 8 May 1945 |  |  | Q189266 |
| Operation Barbarossa | 22 June 1941 | 2 | 0 | Q83055 |
| Speech by V. M. Molotov on the radio on June 22, 1941 | 22 June 1941 | 0 | 0 | Q4129662 |
| German Instrument of Surrender | 8 May 1945 | 0 | 1 | Q700983 |
| Japanese Instrument of Surrender | 2 September 1945 | 0 | 1 | Q665554 |
| Cold War (period) | 12 March 1947 to 26 December 1991 |  |  | Q8683 |
| Truman Doctrine | 12 March 1947 | 2 | 0 | Q171375 |
| Transistor | December 1947 | 0 | 1 | Q5339 |
| Assembly language | 1949 | 0 | 1 | Q165436 |
| Speedcoding | 1953 | 1 | 1 | Q7475416 |
| On the Cult of Personality and Its Consequences | 25 February 1956 | 0 | 1 | Q1165372 |
| Fortran | 1957 | 1 | 1 | Q83303 |
| Space race (period) | 4 October 1957 to 15 July 1975 |  |  | Q1932 |
| Sputnik 1 | 4 October 1957 | 0 | 0 | Q80811 |
| Sputnik programme (period) | 4 October 1957 to 25 March 1961 |  |  | Q170413 |
| Sputnik 2 | 3 November 1957 | 0 | 0 | Q190555 |
| Integrated circuit | 1958 | 1 | 4 | Q80831 |
| ALGOL | 1959 | 1 | 1 | Q188436 |
| ALGOL 60 | 1960 | 0 | 3 | Q1209759 |
| Calculator | 1960s | 0 | 0 | Q31087 |
| Apollo program | 1961 | 0 | 0 | Q46611 |
| Tyazhely Sputnik | 4 February 1961 | 0 | 0 | Q40610 |
| Venera 1 | 12 February 1961 | 0 | 0 | Q152500 |
| Korabl-Sputnik 4 | 9 March 1961 | 0 | 0 | Q18932 |
| Korabl-Sputnik 5 | 25 March 1961 | 0 | 0 | Q18934 |
| SIMSCRIPT | 1962 | 0 | 1 | Q7390408 |
| Simula | 1962 | 2 | 1 | Q212569 |
| Multics | 1965 | 0 | 1 | Q739186 |
| Touchscreen | 1965 | 0 | 1 | Q165970 |
| ALGOL W | 1966 | 1 | 1 | Q1538458 |
| Apollo Applications Program | 1966 | 0 | 0 | Q618933 |
| Liquid-crystal display | 1968 | 0 | 1 | Q83341 |
| ARPANET | 1969 | 2 | 1 | Q177524 |
| Unix | 1969 | 1 | 2 | Q11368 |
| Apollo 11 | 16 July 1969 | 1 | 0 | Q43653 |
| Pascal | 1970 | 4 | 1 | Q81571 |
| Information Age (period) | 1971 to present |  |  | Q956129 |
| Microprocessor | 1971 | 1 | 1 | Q5297 |
| Apollo 16 | 16 April 1972 | 0 | 0 | Q188168 |
| Apollo 17 | 7 December 1972 | 0 | 0 | Q180971 |
| Mobile phone | 1973 | 5 | 1 | Q17517 |
| CP/M | 1974 | 0 | 1 | Q219528 |
| HP-65 | 1974 | 4 | 1 | Q220638 |
| Magnetic storage card | 1974 | 0 | 1 | Q123000843 |
| Sintran III | 1974 | 0 | 1 | Q7525148 |
| Apollo–Soyuz | 15 July 1975 | 1 | 0 | Q208759 |
| Transfer learning | 1976 | 0 | 1 | Q6027324 |
| ENQUIRE | 1980 | 1 | 1 | Q2385520 |
| New political thinking (idea) | 1980s | 0 | 1 | Q4323903 |
| Xenix | 1980 | 0 | 1 | Q589680 |
| MS-DOS | 12 August 1981 | 3 | 1 | Q47604 |
| SunOS | 1982 | 1 | 1 | Q1208460 |
| The Interactive Encyclopedia System | 1983 | 2 | 1 | Q7742259 |
| Strategic Defense Initiative | 1984 | 0 | 1 | Q211031 |
| Gorbachev's anti-alcohol campaign | 1985 | 0 | 1 | Q574563 |
| Perestroika | 1985 | 0 | 1 | Q167634 |
| Reykjavík Summit | 11 October 1986 | 0 | 1 | Q1036702 |
| HyperCard | 1987 | 1 | 1 | Q1053749 |
| HyperTalk | 1987 | 1 | 1 | Q58329 |
| Singing Revolution | 1987 | 0 | 1 | Q595321 |
| 19th All-Union Conference of the Communist Party of the Soviet Union | 28 June 1988 | 0 | 1 | Q4053312 |
| Revolutions of 1989 | 9 March 1989 | 0 | 1 | Q382861 |
| World Wide Web | 12 March 1989 | 4 | 1 | Q466 |
| Fall of the Berlin Wall | 9 November 1989 | 0 | 0 | Q69163529 |
| Declaration of State Sovereignty of the Russian Soviet Federative Socialist Republic | 12 June 1990 | 0 | 2 | Q4156971 |
| Lithium-ion battery | 1991 | 2 | 1 | Q2822895 |
| Monetary reform in the Soviet Union, 1991 | 1991 | 0 | 1 | Q4157879 |
| New Union Treaty | 1991 | 0 | 1 | Q218877 |
| Soyuz programme (period) | 18 May 1991 to present |  |  | Q207329 |
| Soyuz TM-12 | 18 May 1991 | 0 | 0 | Q677528 |
| State Committee on the State of Emergency | 18 August 1991 | 2 | 1 | Q3684508 |
| 1991 Soviet coup d'état attempt | 19 August 1991 | 1 | 1 | Q221382 |
| Soyuz TM-13 | 2 October 1991 | 0 | 0 | Q677519 |
| Declaration of the Council of Republics of the Supreme Soviet of the USSR No. 142-N of 26 December 1991 | 26 December 1991 | 0 | 1 | Q11836865 |
| Dissolution of the Soviet Union | 26 December 1991 | 16 | 0 | Q5167679 |
| iPhone | 9 January 2007 | 7 | 0 | Q621427 |
| Proximal Policy Optimization | 2017 | 0 | 1 | Q112150238 |
| GPT-3 | 28 May 2020 | 1 | 1 | Q95726734 |
| ChatGPT | 30 November 2022 | 2 | 0 | Q115564437 |
