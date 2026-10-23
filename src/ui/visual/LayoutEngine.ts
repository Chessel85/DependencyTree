import { Arrangement } from './GraphLayout';

/** One of the layouts the user can choose between (DES-VIEW-011). */
export interface LayoutEngine {
  /** A short name, for the layout chooser and the page address, such as "linear". */
  readonly key: string;
  readonly title: string;
  /** One or two sentences on how the layout spaces the moments. */
  readonly note: string;
  arrange(): Promise<Arrangement>;
}
