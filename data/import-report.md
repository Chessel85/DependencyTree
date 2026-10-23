# Wikidata import report

Made on 2026-10-23. The seed file is data/seed.json, and the corrections are in data/curation.json.

## Summary

| What | Count |
|---|---|
| Wikidata items in the seed set | 78 |
| Moments, including start and end moments made for periods | 103 |
| Periods | 30 |
| Dependencies in the seed file | 67 |
| Items left out for having no date | 74 |
| Items left out for coming later than what links to them | 17 |
| Links read to items outside the seed set | 97 |
| Stopped at the most entries allowed | No |

## Dependencies by property

"Read" counts every link found, including links to items outside the seed set. "Kept" counts the links in the seed file.

| Property | Name | Read | Kept |
|---|---|---|---|
| P2283 | uses | 24 | 6 |
| P144 | based on | 4 | 1 |
| P1547 | depends on software | 0 | 0 |
| P828 | has cause | 28 | 16 |
| P618 | source of energy | 1 | 1 |
| P5307 | display technology | 2 | 1 |
| P9192 | sensors | 4 | 1 |
| P479 | input device | 1 | 1 |
| P2935 | connector | 2 | 0 |
| P306 | operating system | 3 | 0 |
| P880 | CPU | 0 | 0 |
| P527 | has part(s) | 52 | 7 |
| P1542 | has effect | 32 | 17 |
| P1536 | immediate cause of | 5 | 2 |
| curation | the curation file | 14 | 14 |

## Items left out for having no date

These were reached, but have none of the date properties, so they are left out and not walked through. The curation file can give them a date.

| Wikidata ID | Name | Seed entries that depend on it |
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
| Q4344831 | Parade of sovereignties | 1 |
| Q4314781 | ethnic nationalism in Russia | 1 |
| Q9690903 | International Federation for Victory Over Communism | 1 |
| Q19227157 | (no English label) | 1 |
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
| Q19166862 | (no English label) | 2 |
| Q19216327 | (no English label) | 1 |
| Q714999 | causes of World War II | 2 |
| Q352 | Adolf Hitler | 2 |
| Q2298962 | providentialism | 1 |
| Q6223 | fascism | 1 |
| Q226418 | chauvinism | 1 |
| Q8461 | racism | 1 |
| Q157136 | Lebensraum | 1 |
| Q182121 | anti-communism | 1 |
| Q574578 | Nazi | 1 |
| Q6015447 | incremental computation | 1 |
| Q166154 | line segment | 1 |
| Q113173 | Gennady Yanayev | 1 |
| Q279164 | Boris Pugo | 1 |
| Q435367 | Valentin Pavlov | 1 |
| Q2019186 | Oleg Baklanov | 1 |
| Q382145 | Vladimir Kryuchkov | 1 |
| Q553544 | Vasily Starodubtsev | 1 |
| Q4457171 | Alexander Tizyakov | 1 |
| Q48041 | Dmitry Yazov | 1 |
| Q18121382 | multiple causes | 1 |
| Q310802 | causes of World War I | 1 |
| Q17097756 | Serbian nationalism | 1 |

## Items left out for coming later

These were reached only from entries that certainly came before them, so they can't be dependencies, and the walk doesn't go through them.

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
| Q141647694 | Babbage 002 |
| Q141647695 | Davinci 002 |
| Q5249463 | Declaration of the Creation of the Union of Soviet Socialist Republics |
| Q130259975 | war declaration of Austria-Hungary to Serbia |

## Entries with no English name

These have no English label in Wikidata, so their Wikidata ID is used as the name. The curation file can name them.

| Wikidata ID | Description |
|---|---|
| Q33593042 |  |

## Links moved to a period's start moment

Wikidata linked these to a whole period, so the period's start moment is used instead (DES-REL-007). The curation file can move them to a better moment.

| Dependent | Dependency | Period moved to its start | Property |
|---|---|---|---|
| Apollo–Soyuz | HP-65 | Apollo–Soyuz | uses (P2283) |
| Dissolution of the Soviet Union | Perestroika | Perestroika | has cause (P828) |
| Dissolution of the Soviet Union | Treaty on the Creation of the Union of Soviet Socialist Republics | Treaty on the Creation of the Union of Soviet Socialist Republics | has cause (P828) |
| Cold War | Truman Doctrine | Cold War | has cause (P828) |
| Dissolution of the Soviet Union | Cold War | Cold War | has effect (P1542) |
| Dissolution of the Soviet Union | Perestroika | Perestroika | has effect (P1542) |
| Dissolution of the Soviet Union | 1991 Soviet coup d'état attempt | 1991 Soviet coup d'état attempt | has effect (P1542) |
| Dissolution of the Soviet Union | Revolutions of 1989 | Revolutions of 1989 | has effect (P1542) |
| Dissolution of the Soviet Union | Reykjavík Summit | Reykjavík Summit | has effect (P1542) |
| Dissolution of the Soviet Union | 19th All-Union Conference of the Communist Party of the Soviet Union | 19th All-Union Conference of the Communist Party of the Soviet Union | has effect (P1542) |
| Cold War | World War II | Cold War and World War II | has effect (P1542) |
| Cold War | Eastern Front | Cold War and Eastern Front | has effect (P1542) |
| World War II | Treaty of Versailles | World War II and Treaty of Versailles | has cause (P828) |
| World War II | Molotov–Ribbentrop Pact | World War II and Molotov–Ribbentrop Pact | has cause (P828) |
| World War II | Revanchism | World War II | has cause (P828) |
| Eastern Front | Nazism | Eastern Front and Nazism | has cause (P828) |
| Perestroika | Dunno on the Moon | Perestroika | has effect (P1542) |
| 1991 Soviet coup d'état attempt | State Committee on the State of Emergency | 1991 Soviet coup d'état attempt | has effect (P1542) |
| World War II | Treaty of Versailles | World War II and Treaty of Versailles | has effect (P1542) |
| Eastern Front | The Main Task of Our Time | Eastern Front | has effect (P1542) |
| World War II | 1939 Invasion of Poland | World War II and 1939 Invasion of Poland | immediate cause of (P1536) |
| Treaty of Versailles | Paris Peace Conference | Treaty of Versailles and Paris Peace Conference | has cause (P828) |
| Molotov–Ribbentrop Pact | Treaty of Berlin (1926) | Molotov–Ribbentrop Pact | based on (P144) |
| Treaty of Versailles | Paris Peace Conference | Treaty of Versailles and Paris Peace Conference | has effect (P1542) |
| Molotov–Ribbentrop Pact | Battles of Khalkhin Gol | Molotov–Ribbentrop Pact and Battles of Khalkhin Gol | has effect (P1542) |
| State Committee on the State of Emergency | Gorbachev's anti-alcohol campaign | Gorbachev's anti-alcohol campaign | has effect (P1542) |
| Paris Peace Conference | World War I | Paris Peace Conference and World War I | has cause (P828) |
| Paris Peace Conference | World War I | Paris Peace Conference and World War I | has effect (P1542) |
| World War I | July Crisis | World War I | has effect (P1542) |
| World War I | Assassination of Archduke Franz Ferdinand | World War I | immediate cause of (P1536) |

## Links that broke the predates rule

Each dependency certainly came after the entry that depends on it, so the link is left out (DES-REL-002).

| Dependent | Its date | Dependency | Its date | Property |
|---|---|---|---|---|
| Cold War begins | 1945 | Truman Doctrine | 12 March 1947 | has cause (P828) |

## Circular dependencies

None.

## Entries outside their period

Each entry certainly falls outside the period's dates, so it is left out of the period (DES-DATA-006).

| Period | Entry |
|---|---|
| Cold War | Dissolution of the Soviet Union |
| Cold War | Revolutions of 1989 |
| World War I | Paris Peace Conference |
| World War I | July Crisis |
| Soyuz programme | Apollo–Soyuz |
| Calculator | Integrated circuit |
| Walkie-talkie | Loudspeaker |
| European Theater of World War II | Eastern European theatre of World War II |
| Interwar period | Soviet–Japanese border conflicts |

## Notes on the curation file

None.

## Entries in the seed file

Oldest first.

| Name | Date | Dependencies | Enabled | Wikidata ID |
|---|---|---|---|---|
| Voltaic pile | 1800 | 0 | 3 | Q663273 |
| Lithium | 1817 | 0 | 1 | Q568 |
| Electromagnetic induction | 1831 | 1 | 1 | Q988780 |
| Rechargeable battery | 1859 | 0 | 1 | Q187510 |
| Loudspeaker | 1861 | 0 | 1 | Q570 |
| Revanchism | 1870s | 0 | 1 | Q1136718 |
| Microphone | 1876 | 0 | 2 | Q46384 |
| Telephone | 1876 | 2 | 2 | Q11035 |
| Antenna | 1886 | 0 | 1 | Q131214 |
| Seven-segment display | 1903 | 0 | 1 | Q1046569 |
| Assassination of Archduke Franz Ferdinand | 28 June 1914 | 0 | 2 | Q192050 |
| July Crisis | 23 July 1914 | 1 | 1 | Q917435 |
| World War I (period) | 28 July 1914 to 11 November 1918 |  |  | Q361 |
| World War I begins | 28 July 1914 | 2 | 1 | made by the import |
| Declaration of the Rights of the Peoples of Russia | 2 November 1917 | 0 | 1 | Q1047454 |
| The Main Task of Our Time | 1918 | 0 | 1 | Q125253429 |
| Interwar period (period) | 11 November 1918 to 11 September 1939 |  |  | Q154611 |
| Interwar period begins | 11 November 1918 | 0 | 0 | made by the import |
| World War I ends | 11 November 1918 | 0 | 0 | made by the import |
| Paris Peace Conference (period) | 18 January 1919 to 21 January 1920 |  |  | Q199820 |
| Paris Peace Conference begins | 18 January 1919 | 1 | 1 | made by the import |
| Leninism | 1920s | 0 | 1 | Q155059 |
| Nazism (period) | 1920 to 8 May 1945 |  |  | Q7310 |
| Nazism begins | 1920 | 0 | 1 | made by the import |
| Treaty of Versailles (period) | 10 January 1920 to present |  |  | Q8736 |
| Treaty of Versailles begins | 10 January 1920 | 1 | 1 | made by the import |
| Paris Peace Conference ends | 21 January 1920 | 0 | 0 | made by the import |
| Treaty on the Creation of the Union of Soviet Socialist Republics (period) | 29 December 1922 to 8 December 1991 |  |  | Q1443926 |
| Treaty on the Creation of the Union of Soviet Socialist Republics begins | 29 December 1922 | 0 | 1 | made by the import |
| Postfix notation | 1924 | 0 | 1 | Q379695 |
| Treaty of Berlin (1926) | 24 April 1926 | 0 | 1 | Q695215 |
| Walkie-talkie (period) | c. 1940s to present |  |  | Q938319 |
| Walkie-talkie begins | c. 1940s | 0 | 0 | made by the import |
| Soviet–Japanese border conflicts (period) | 1 March 1932 to 16 September 1939 |  |  | Q696389 |
| Soviet–Japanese border conflicts begins | 1 March 1932 | 0 | 0 | made by the import |
| Battles of Khalkhin Gol (period) | 11 May 1939 to 16 September 1939 |  |  | Q188925 |
| Battles of Khalkhin Gol begins | 11 May 1939 | 0 | 1 | made by the import |
| Molotov–Ribbentrop Pact (period) | 23 August 1939 to 22 June 1941 |  |  | Q130796 |
| Molotov–Ribbentrop Pact begins | 23 August 1939 | 2 | 1 | made by the import |
| 1939 Invasion of Poland (period) | 1 September 1939 to 6 October 1939 |  |  | Q150812 |
| 1939 Invasion of Poland begins | 1 September 1939 | 0 | 1 | made by the import |
| Eastern European theatre of World War II (period) | 1 September 1939 to 9 May 1945 |  |  | Q23908696 |
| Eastern European theatre of World War II begins | 1 September 1939 | 0 | 0 | made by the import |
| European Theater of World War II (period) | 1 September 1939 to 8 May 1945 |  |  | Q44700 |
| European Theater of World War II begins | 1 September 1939 | 0 | 0 | made by the import |
| World War II (period) | 1 September 1939 to 2 September 1945 |  |  | Q362 |
| World War II begins | 1 September 1939 | 4 | 1 | made by the import |
| Interwar period ends | 11 September 1939 | 0 | 0 | made by the import |
| Battles of Khalkhin Gol ends | 16 September 1939 | 0 | 0 | made by the import |
| Soviet–Japanese border conflicts ends | 16 September 1939 | 0 | 0 | made by the import |
| 1939 Invasion of Poland ends | 6 October 1939 | 0 | 0 | made by the import |
| Eastern Front (period) | 22 June 1941 to 7 May 1945 |  |  | Q189266 |
| Eastern Front begins | 22 June 1941 | 2 | 1 | made by the import |
| Molotov–Ribbentrop Pact ends | 22 June 1941 | 0 | 0 | made by the import |
| Cold War (period) | 1945 to 25 December 1991 |  |  | Q8683 |
| Cold War begins | 1945 | 2 | 1 | made by the import |
| Eastern Front ends | 7 May 1945 | 0 | 0 | made by the import |
| European Theater of World War II ends | 8 May 1945 | 0 | 0 | made by the import |
| Nazism ends | 8 May 1945 | 0 | 0 | made by the import |
| Eastern European theatre of World War II ends | 9 May 1945 | 0 | 0 | made by the import |
| World War II ends | 2 September 1945 | 0 | 0 | made by the import |
| Truman Doctrine | 12 March 1947 | 0 | 0 | Q171375 |
| Transistor | December 1947 | 0 | 1 | Q5339 |
| On the Cult of Personality and Its Consequences | 25 February 1956 | 0 | 1 | Q1165372 |
| Sputnik programme (period) | 1957 to 1961 |  |  | Q170413 |
| Sputnik programme begins | 1957 | 0 | 0 | made by the import |
| Space race (period) | 4 October 1957 to July 1975 |  |  | Q1932 |
| Space race begins | 4 October 1957 | 0 | 0 | made by the import |
| Sputnik 1 | 4 October 1957 | 0 | 0 | Q80811 |
| Integrated circuit | 1958 | 1 | 4 | Q80831 |
| Calculator (period) | 1960s to present |  |  | Q31087 |
| Calculator begins | 1960s | 0 | 0 | made by the import |
| Apollo program (period) | 1961 to 1972 |  |  | Q46611 |
| Apollo program begins | 1961 | 0 | 0 | made by the import |
| Sputnik programme ends | 1961 | 0 | 0 | made by the import |
| Dunno on the Moon | 1965 | 0 | 1 | Q3647984 |
| Touchscreen | 1965 | 0 | 1 | Q165970 |
| Apollo Applications Program (period) | 1966 to 1979 |  |  | Q618933 |
| Apollo Applications Program begins | 1966 | 0 | 0 | made by the import |
| Liquid-crystal display | 1968 | 0 | 1 | Q83341 |
| ARPANET | 1969 | 2 | 1 | Q177524 |
| Apollo 11 | 16 July 1969 | 1 | 0 | Q43653 |
| Information Age (period) | 1970s to present |  |  | Q956129 |
| Information Age begins | 1970s | 0 | 0 | made by the import |
| Microprocessor | 1971 | 1 | 1 | Q5297 |
| Apollo program ends | 1972 | 0 | 0 | made by the import |
| Mobile phone | 1973 | 5 | 1 | Q17517 |
| HP-65 | 1974 | 4 | 1 | Q220638 |
| Magnetic storage card | 1974 | 0 | 1 | Q123000843 |
| Space race ends | July 1975 | 0 | 0 | made by the import |
| Apollo–Soyuz (period) | 15 July 1975 to 24 July 1975 |  |  | Q208759 |
| Apollo–Soyuz begins | 15 July 1975 | 1 | 0 | made by the import |
| Apollo–Soyuz ends | 24 July 1975 | 0 | 0 | made by the import |
| Transfer learning | 1976 | 0 | 1 | Q6027324 |
| Apollo Applications Program ends | 1979 | 0 | 0 | made by the import |
| New political thinking | 1980s | 0 | 1 | Q4323903 |
| Strategic Defense Initiative | 1984 | 0 | 1 | Q211031 |
| Gorbachev's anti-alcohol campaign (period) | 1985 to 1987 |  |  | Q574563 |
| Gorbachev's anti-alcohol campaign begins | 1985 | 0 | 1 | made by the import |
| Perestroika (period) | 1985 to 1991 |  |  | Q167634 |
| Perestroika begins | 1985 | 1 | 1 | made by the import |
| Reykjavík Summit (period) | 11 October 1986 to 12 October 1986 |  |  | Q1036702 |
| Reykjavík Summit begins | 11 October 1986 | 0 | 1 | made by the import |
| Reykjavík Summit ends | 12 October 1986 | 0 | 0 | made by the import |
| Gorbachev's anti-alcohol campaign ends | 1987 | 0 | 0 | made by the import |
| 19th All-Union Conference of the Communist Party of the Soviet Union (period) | 28 June 1988 to 1 July 1988 |  |  | Q4053312 |
| 19th All-Union Conference of the Communist Party of the Soviet Union begins | 28 June 1988 | 0 | 1 | made by the import |
| 19th All-Union Conference of the Communist Party of the Soviet Union ends | 1 July 1988 | 0 | 0 | made by the import |
| Revolutions of 1989 (period) | 9 March 1989 to 27 April 1992 |  |  | Q382861 |
| Revolutions of 1989 begins | 9 March 1989 | 0 | 1 | made by the import |
| World Wide Web | 12 March 1989 | 1 | 1 | Q466 |
| Fall of the Berlin Wall | 9 November 1989 | 0 | 0 | Q69163529 |
| Declaration of State Sovereignty of the Russian Soviet Federative Socialist Republic | 12 June 1990 | 0 | 2 | Q4156971 |
| Lithium-ion battery | 1991 | 2 | 1 | Q2822895 |
| Monetary reform in the Soviet Union, 1991 | 1991 | 0 | 1 | Q4157879 |
| New Union Treaty | 1991 | 0 | 1 | Q218877 |
| Perestroika ends | 1991 | 0 | 0 | made by the import |
| Soyuz programme (period) | 1991 to present |  |  | Q207329 |
| Soyuz programme begins | 1991 | 0 | 0 | made by the import |
| State Committee on the State of Emergency | 18 August 1991 | 2 | 1 | Q3684508 |
| 1991 Soviet coup d'état attempt (period) | 19 August 1991 to 21 August 1991 |  |  | Q221382 |
| 1991 Soviet coup d'état attempt begins | 19 August 1991 | 1 | 1 | made by the import |
| 1991 Soviet coup d'état attempt ends | 21 August 1991 | 0 | 0 | made by the import |
| Treaty on the Creation of the Union of Soviet Socialist Republics ends | 8 December 1991 | 0 | 0 | made by the import |
| Q33593042 | 24 December 1991 | 0 | 1 | Q33593042 |
| Cold War ends | 25 December 1991 | 0 | 0 | made by the import |
| Declaration of the Council of Republics of the Supreme Soviet of the USSR No. 142-N of 26 December 1991 | 26 December 1991 | 0 | 1 | Q11836865 |
| Dissolution of the Soviet Union | 26 December 1991 | 17 | 0 | Q5167679 |
| Revolutions of 1989 ends | 27 April 1992 | 0 | 0 | made by the import |
| iPhone | 9 January 2007 | 7 | 0 | Q621427 |
| Proximal Policy Optimization | 2017 | 0 | 1 | Q112150238 |
| GPT-3 | 28 May 2020 | 1 | 1 | Q95726734 |
| ChatGPT | 30 November 2022 | 2 | 0 | Q115564437 |
