/**
 * Speaks text through an ARIA live region. A new announcement replaces one
 * that hasn't been spoken yet (DES-ANN-006). Clearing the region first means
 * the same words are spoken again if repeated.
 */
export class LiveAnnouncer {
  private pending: number | undefined;

  constructor(private readonly region: HTMLElement) {}

  say(text: string): void {
    if (!text) {
      return;
    }
    window.clearTimeout(this.pending);
    this.region.textContent = '';
    this.pending = window.setTimeout(() => {
      this.region.textContent = text;
    }, 50);
  }
}
