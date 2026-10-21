/** Plays a short sound, starting again from the beginning if it is already playing (DES-ANN-011). */
export class SoundPlayer {
  private readonly audio: HTMLAudioElement;

  constructor(url: string) {
    this.audio = new Audio(url);
  }

  play(): void {
    this.audio.currentTime = 0;
    // Browsers may refuse to play before the user has interacted with the page. That doesn't matter here.
    this.audio.play().catch(() => undefined);
  }
}
