import { Arrangement } from './GraphLayout';

/** One of the layouts in the experiment (DES-VIEW-005, DES-VIEW-010, DES-VIEW-011). */
export interface LayoutEngine {
  /** A short name, for the layout chooser and the page address, such as "linear". */
  readonly key: string;
  readonly title: string;
  /** One or two sentences for reviewers on what to look for. */
  readonly note: string;
  arrange(): Promise<Arrangement>;
}
