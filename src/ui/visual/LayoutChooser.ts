import { LayoutEngine } from './LayoutEngine';

const ADDRESS_PARAMETER = 'layout';

/**
 * The drop-down list of layouts in the experiment (DES-VIEW-011), with a note
 * on the chosen one. The choice is kept in the page address, so a reviewer
 * can share a link to a particular layout.
 */
export class LayoutChooser {
  constructor(
    private readonly select: HTMLSelectElement,
    private readonly note: HTMLElement,
    private readonly engines: readonly LayoutEngine[],
    private readonly onChoose: (engine: LayoutEngine) => void,
  ) {
    select.replaceChildren(
      ...engines.map((engine) => {
        const option = document.createElement('option');
        option.value = engine.key;
        option.textContent = engine.title;
        return option;
      }),
    );
    select.addEventListener('change', () => this.choose(select.value, true));
  }

  /** Chooses the layout named in the page address, or the first one. */
  start(): void {
    const asked = new URLSearchParams(window.location.search).get(ADDRESS_PARAMETER);
    this.choose(asked ?? this.engines[0].key, false);
  }

  private choose(key: string, remember: boolean): void {
    const engine = this.engines.find((e) => e.key === key) ?? this.engines[0];
    this.select.value = engine.key;
    this.note.textContent = engine.note;
    if (remember) {
      const address = new URL(window.location.href);
      address.searchParams.set(ADDRESS_PARAMETER, engine.key);
      window.history.replaceState(null, '', address);
    }
    this.onChoose(engine);
  }
}
