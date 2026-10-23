# Wikidata import report

Made on 2026-10-23. The seed file is data/seed.json, and the corrections are in data/curation.json.

## Summary

| What | Count |
|---|---|
| Wikidata items in the seed set | 83 |
| Moments, including start and end moments made for periods | 108 |
| Periods | 29 |
| Dependencies in the seed file | 69 |
| Items left out for having no date | 56 |
| Links read to items outside the seed set | 62 |
| Stopped at the most entries allowed | No |

## Dependencies by property

"Read" counts every link found, including links to items outside the seed set. "Kept" counts the links in the seed file.

| Property | Name | Read | Kept |
|---|---|---|---|
| P2283 | uses | 5 | 3 |
| P144 | based on | 15 | 11 |
| P1547 | depends on software | 0 | 0 |
| P828 | has cause | 28 | 16 |
| P618 | source of energy | 1 | 1 |
| P5307 | display technology | 2 | 1 |
| P9192 | sensors | 4 | 1 |
| P479 | input device | 1 | 0 |
| P2935 | connector | 3 | 0 |
| P306 | operating system | 3 | 0 |
| P880 | CPU | 0 | 0 |
| P527 | has part(s) | 34 | 3 |
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
| Q46384 | microphone | 2 |
| Q3271837 | Apple dock connector | 1 |
| Q394226 | phone connector | 1 |
| Q620681 | process engineering device | 1 |
| Q1068715 | telecommunications network | 1 |
| Q1072430 | die | 1 |
| Q1074550 | integrated circuit packaging type | 1 |
| Q176300 | p–n junction | 1 |
| Q61774825 | ARPANET Reference Model | 2 |
| Q173350 | printed circuit board | 1 |
| Q870870 | push-button | 1 |
| Q327065 | display device | 1 |
| Q131214 | antenna | 1 |
| Q570 | loudspeaker | 1 |
| Q221989 | deep web | 1 |
| Q1476753 | surface web | 1 |
| Q203989 | liquid crystal | 1 |
| Q4344831 | Parade of sovereignties | 1 |
| Q4314781 | ethnic nationalism in Russia | 1 |
| Q9690903 | International Federation for Victory Over Communism | 1 |
| Q19227157 | (no English label) | 1 |
| Q9197445 | LED display | 2 |
| Q123002438 | magnetic card reader | 1 |
| Q187510 | rechargeable battery | 1 |
| Q215292 | power connector | 1 |
| Q1143070 | software suite | 1 |
| Q1394 | Vladimir Lenin | 1 |
| Q19166862 | (no English label) | 2 |
| Q7390413 | SIM connector | 1 |
| Q36774 | web page | 1 |
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
| Q166154 | line segment | 1 |
| Q113173 | Gennady Yanayev | 1 |
| Q279164 | Boris Pugo | 1 |
| Q435367 | Valentin Pavlov | 1 |
| Q2019186 | Oleg Baklanov | 1 |
| Q382145 | Vladimir Kryuchkov | 1 |
| Q553544 | Vasily Starodubtsev | 1 |
| Q4457171 | Alexander Tizyakov | 1 |
| Q48041 | Dmitry Yazov | 1 |
| Q2666693 | Research Unix | 1 |
| Q18121382 | multiple causes | 1 |
| Q310802 | causes of World War I | 1 |
| Q17097756 | Serbian nationalism | 1 |

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
| Cold War | The Sinews of Peace | Cold War | has effect (P1542) |
| Treaty on the Creation of the Union of Soviet Socialist Republics | Declaration of the Creation of the Union of Soviet Socialist Republics | Treaty on the Creation of the Union of Soviet Socialist Republics | based on (P144) |
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
| iPhone | 9 January 2007 | iPhone OS 1 | 29 June 2007 | operating system (P306) |
| iPhone | 9 January 2007 | iPhone OS 2 | 11 July 2008 | operating system (P306) |
| iPhone | 9 January 2007 | iPhone OS 3 | 17 June 2009 | operating system (P306) |
| Mobile phone | 1973 | SIM card | 1991 | has part(s) (P527) |
| World Wide Web | 12 March 1989 | Website | 1990 | has part(s) (P527) |
| Start of the Cold War | 1945 | Truman Doctrine | 12 March 1947 | has cause (P828) |
| Start of the Cold War | 1945 | The Sinews of Peace | 5 March 1946 | has effect (P1542) |
| Start of the Treaty on the Creation of the Union of Soviet Socialist Republics | 29 December 1922 | Declaration of the Creation of the Union of Soviet Socialist Republics | 30 December 1922 | based on (P144) |
| July Crisis | 23 July 1914 | War declaration of Austria-Hungary to Serbia | 28 July 1914 | has part(s) (P527) |

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
| European Theater of World War II | Eastern European theatre of World War II |
| Interwar period | Soviet–Japanese border conflicts |

## Notes on the curation file

Corrections that had no effect, which may be out of date.

| Number | Note |
|---|---|
| 1 | The link from Q17517 to Q80831 is now in Wikidata, so needn't be added. |
| 2 | The link from Q621427 to Q2822895 is now in Wikidata, so needn't be added. |
| 3 | The link from Q621427 to Q83341 is now in Wikidata, so needn't be added. |
| 4 | The link from Q621427 to Q165970 is now in Wikidata, so needn't be added. |

## Entries in the seed file

Oldest first.

| Name | Date | Dependencies | Enabled | Wikidata ID |
|---|---|---|---|---|
| Voltaic pile | 1800 | 0 | 3 | Q663273 |
| Lithium | 1817 | 0 | 1 | Q568 |
| Electromagnetic induction | 1831 | 1 | 1 | Q988780 |
| Revanchism | 1870s | 0 | 1 | Q1136718 |
| Telephone | 1876 | 2 | 2 | Q11035 |
| Seven-segment display | 1903 | 0 | 1 | Q1046569 |
| Assassination of Archduke Franz Ferdinand | 28 June 1914 | 0 | 2 | Q192050 |
| July Crisis | 23 July 1914 | 1 | 1 | Q917435 |
| Start of the World War I | 28 July 1914 | 2 | 1 | made by the import |
| War declaration of Austria-Hungary to Serbia | 28 July 1914 | 0 | 0 | Q130259975 |
| World War I (period) | 28 July 1914 to 11 November 1918 |  |  | Q361 |
| Declaration of the Rights of the Peoples of Russia | 2 November 1917 | 0 | 1 | Q1047454 |
| The Main Task of Our Time | 1918 | 0 | 1 | Q125253429 |
| End of the World War I | 11 November 1918 | 0 | 0 | made by the import |
| Interwar period (period) | 11 November 1918 to 11 September 1939 |  |  | Q154611 |
| Start of the interwar period | 11 November 1918 | 0 | 0 | made by the import |
| Paris Peace Conference (period) | 18 January 1919 to 21 January 1920 |  |  | Q199820 |
| Start of the Paris Peace Conference | 18 January 1919 | 1 | 1 | made by the import |
| Leninism | 1920s | 0 | 1 | Q155059 |
| Nazism (period) | 1920 to 8 May 1945 |  |  | Q7310 |
| Start of the Nazism | 1920 | 0 | 1 | made by the import |
| Start of the Treaty of Versailles | 10 January 1920 | 1 | 1 | made by the import |
| Treaty of Versailles (period) | 10 January 1920 to present |  |  | Q8736 |
| End of the Paris Peace Conference | 21 January 1920 | 0 | 0 | made by the import |
| Start of the Treaty on the Creation of the Union of Soviet Socialist Republics | 29 December 1922 | 0 | 1 | made by the import |
| Treaty on the Creation of the Union of Soviet Socialist Republics (period) | 29 December 1922 to 8 December 1991 |  |  | Q1443926 |
| Declaration of the Creation of the Union of Soviet Socialist Republics | 30 December 1922 | 0 | 0 | Q5249463 |
| Postfix notation | 1924 | 0 | 1 | Q379695 |
| Treaty of Berlin (1926) | 24 April 1926 | 0 | 1 | Q695215 |
| Soviet–Japanese border conflicts (period) | 1 March 1932 to 16 September 1939 |  |  | Q696389 |
| Start of the Soviet–Japanese border conflicts | 1 March 1932 | 0 | 0 | made by the import |
| Battles of Khalkhin Gol (period) | 11 May 1939 to 16 September 1939 |  |  | Q188925 |
| Start of the Battles of Khalkhin Gol | 11 May 1939 | 0 | 1 | made by the import |
| Molotov–Ribbentrop Pact (period) | 23 August 1939 to 22 June 1941 |  |  | Q130796 |
| Start of the Molotov–Ribbentrop Pact | 23 August 1939 | 2 | 1 | made by the import |
| 1939 Invasion of Poland (period) | 1 September 1939 to 6 October 1939 |  |  | Q150812 |
| Eastern European theatre of World War II (period) | 1 September 1939 to 9 May 1945 |  |  | Q23908696 |
| European Theater of World War II (period) | 1 September 1939 to 8 May 1945 |  |  | Q44700 |
| Start of the 1939 Invasion of Poland | 1 September 1939 | 0 | 1 | made by the import |
| Start of the Eastern European theatre of World War II | 1 September 1939 | 0 | 0 | made by the import |
| Start of the European Theater of World War II | 1 September 1939 | 0 | 0 | made by the import |
| Start of the World War II | 1 September 1939 | 4 | 1 | made by the import |
| World War II (period) | 1 September 1939 to 2 September 1945 |  |  | Q362 |
| End of the interwar period | 11 September 1939 | 0 | 0 | made by the import |
| End of the Battles of Khalkhin Gol | 16 September 1939 | 0 | 0 | made by the import |
| End of the Soviet–Japanese border conflicts | 16 September 1939 | 0 | 0 | made by the import |
| End of the 1939 Invasion of Poland | 6 October 1939 | 0 | 0 | made by the import |
| Eastern Front (period) | 22 June 1941 to 7 May 1945 |  |  | Q189266 |
| End of the Molotov–Ribbentrop Pact | 22 June 1941 | 0 | 0 | made by the import |
| Start of the Eastern Front | 22 June 1941 | 2 | 1 | made by the import |
| Cold War (period) | 1945 to 25 December 1991 |  |  | Q8683 |
| Start of the Cold War | 1945 | 2 | 1 | made by the import |
| End of the Eastern Front | 7 May 1945 | 0 | 0 | made by the import |
| End of the European Theater of World War II | 8 May 1945 | 0 | 0 | made by the import |
| End of the Nazism | 8 May 1945 | 0 | 0 | made by the import |
| End of the Eastern European theatre of World War II | 9 May 1945 | 0 | 0 | made by the import |
| End of the World War II | 2 September 1945 | 0 | 0 | made by the import |
| The Sinews of Peace | 5 March 1946 | 0 | 0 | Q2102143 |
| Truman Doctrine | 12 March 1947 | 0 | 0 | Q171375 |
| Transistor | December 1947 | 0 | 1 | Q5339 |
| On the Cult of Personality and Its Consequences | 25 February 1956 | 0 | 1 | Q1165372 |
| Sputnik programme (period) | 1957 to 1961 |  |  | Q170413 |
| Start of the Sputnik programme | 1957 | 0 | 0 | made by the import |
| Space race (period) | 4 October 1957 to July 1975 |  |  | Q1932 |
| Sputnik 1 | 4 October 1957 | 0 | 0 | Q80811 |
| Start of the space race | 4 October 1957 | 0 | 0 | made by the import |
| Integrated circuit | 1958 | 1 | 4 | Q80831 |
| Calculator (period) | 1960s to present |  |  | Q31087 |
| Start of the calculator | 1960s | 0 | 0 | made by the import |
| Apollo program (period) | 1961 to 1972 |  |  | Q46611 |
| End of the Sputnik programme | 1961 | 0 | 0 | made by the import |
| Start of the Apollo program | 1961 | 0 | 0 | made by the import |
| Dunno on the Moon | 1965 | 0 | 1 | Q3647984 |
| Touchscreen | 1965 | 0 | 1 | Q165970 |
| Apollo Applications Program (period) | 1966 to 1979 |  |  | Q618933 |
| Start of the Apollo Applications Program | 1966 | 0 | 0 | made by the import |
| Liquid-crystal display | 1968 | 0 | 1 | Q83341 |
| ARPANET | 1969 | 2 | 1 | Q177524 |
| Apollo 11 | 16 July 1969 | 1 | 0 | Q43653 |
| Information Age (period) | 1970s to present |  |  | Q956129 |
| Start of the Information Age | 1970s | 0 | 0 | made by the import |
| Microprocessor | 1971 | 1 | 1 | Q5297 |
| End of the Apollo program | 1972 | 0 | 0 | made by the import |
| Mobile phone | 1973 | 2 | 1 | Q17517 |
| HP-65 | 1974 | 3 | 1 | Q220638 |
| Magnetic storage card | 1974 | 0 | 1 | Q123000843 |
| End of the space race | July 1975 | 0 | 0 | made by the import |
| Apollo–Soyuz (period) | 15 July 1975 to 24 July 1975 |  |  | Q208759 |
| Start of the Apollo–Soyuz | 15 July 1975 | 1 | 0 | made by the import |
| End of the Apollo–Soyuz | 24 July 1975 | 0 | 0 | made by the import |
| Berkeley Software Distribution | 1977 | 0 | 3 | Q34264 |
| End of the Apollo Applications Program | 1979 | 0 | 0 | made by the import |
| New political thinking | 1980s | 0 | 1 | Q4323903 |
| Strategic Defense Initiative | 1984 | 0 | 1 | Q211031 |
| Gorbachev's anti-alcohol campaign (period) | 1985 to 1987 |  |  | Q574563 |
| Mach | 1985 | 0 | 1 | Q14643 |
| Perestroika (period) | 1985 to 1991 |  |  | Q167634 |
| Start of the Gorbachev's anti-alcohol campaign | 1985 | 0 | 1 | made by the import |
| Start of the perestroika | 1985 | 1 | 1 | made by the import |
| Reykjavík Summit (period) | 11 October 1986 to 12 October 1986 |  |  | Q1036702 |
| Start of the Reykjavík Summit | 11 October 1986 | 0 | 1 | made by the import |
| End of the Reykjavík Summit | 12 October 1986 | 0 | 0 | made by the import |
| End of the Gorbachev's anti-alcohol campaign | 1987 | 0 | 0 | made by the import |
| 19th All-Union Conference of the Communist Party of the Soviet Union (period) | 28 June 1988 to 1 July 1988 |  |  | Q4053312 |
| Start of the 19th All-Union Conference of the Communist Party of the Soviet Union | 28 June 1988 | 0 | 1 | made by the import |
| End of the 19th All-Union Conference of the Communist Party of the Soviet Union | 1 July 1988 | 0 | 0 | made by the import |
| Revolutions of 1989 (period) | 9 March 1989 to 27 April 1992 |  |  | Q382861 |
| Start of the Revolutions of 1989 | 9 March 1989 | 0 | 1 | made by the import |
| World Wide Web | 12 March 1989 | 1 | 1 | Q466 |
| NeXTSTEP | 18 September 1989 | 2 | 1 | Q831367 |
| Fall of the Berlin Wall | 9 November 1989 | 0 | 0 | Q69163529 |
| Website | 1990 | 0 | 0 | Q35127 |
| Declaration of State Sovereignty of the Russian Soviet Federative Socialist Republic | 12 June 1990 | 0 | 2 | Q4156971 |
| End of the perestroika | 1991 | 0 | 0 | made by the import |
| Lithium-ion battery | 1991 | 2 | 1 | Q2822895 |
| Monetary reform in the Soviet Union, 1991 | 1991 | 0 | 1 | Q4157879 |
| New Union Treaty | 1991 | 0 | 1 | Q218877 |
| SIM card | 1991 | 0 | 0 | Q230110 |
| Soyuz programme (period) | 1991 to present |  |  | Q207329 |
| Start of the Soyuz programme | 1991 | 0 | 0 | made by the import |
| State Committee on the State of Emergency | 18 August 1991 | 2 | 1 | Q3684508 |
| 1991 Soviet coup d'état attempt (period) | 19 August 1991 to 21 August 1991 |  |  | Q221382 |
| Start of the 1991 Soviet coup d'état attempt | 19 August 1991 | 1 | 1 | made by the import |
| End of the 1991 Soviet coup d'état attempt | 21 August 1991 | 0 | 0 | made by the import |
| End of the Treaty on the Creation of the Union of Soviet Socialist Republics | 8 December 1991 | 0 | 0 | made by the import |
| Q33593042 | 24 December 1991 | 0 | 1 | Q33593042 |
| End of the Cold War | 25 December 1991 | 0 | 0 | made by the import |
| Declaration of the Council of Republics of the Supreme Soviet of the USSR No. 142-N of 26 December 1991 | 26 December 1991 | 0 | 1 | Q11836865 |
| Dissolution of the Soviet Union | 26 December 1991 | 17 | 0 | Q5167679 |
| 386BSD | 12 March 1992 | 1 | 1 | Q228413 |
| End of the Revolutions of 1989 | 27 April 1992 | 0 | 0 | made by the import |
| FreeBSD | 1 November 1993 | 2 | 1 | Q34236 |
| Darwin | 15 November 2000 | 2 | 3 | Q14581 |
| iPhone | 9 January 2007 | 6 | 0 | Q621427 |
| iPhone OS 1 | 29 June 2007 | 1 | 0 | Q17058718 |
| iPhone OS 2 | 11 July 2008 | 1 | 0 | Q16927834 |
| iPhone OS 3 | 17 June 2009 | 1 | 0 | Q16969690 |
