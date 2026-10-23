/** A box whose left and right edges are fixed, waiting for a lane. */
export interface LaneRequest {
  x: number;
  width: number;
  /** The lane it would like, for example from the layered layout. */
  preferredLane: number;
}

/**
 * Puts boxes into horizontal lanes so that no two boxes in a lane overlap.
 * Each box gets its preferred lane if that is free, or else the nearest free
 * one, trying below before above.
 */
export class LanePlacer {
  constructor(private readonly gap = 12) {}

  /** The lane for each request, in the same order. */
  place(requests: readonly LaneRequest[]): number[] {
    const order = requests.map((_, i) => i).sort((a, b) => requests[a].x - requests[b].x);
    const lanes: [number, number][][] = [];
    const result: number[] = new Array(requests.length);
    for (const i of order) {
      const box = requests[i];
      const lane = this.nearestFree(lanes, box);
      (lanes[lane] ??= []).push([box.x, box.x + box.width]);
      result[i] = lane;
    }
    return result;
  }

  private nearestFree(lanes: [number, number][][], box: LaneRequest): number {
    const preferred = Math.max(0, box.preferredLane);
    for (let distance = 0; ; distance++) {
      for (const lane of [preferred + distance, preferred - distance]) {
        if (lane >= 0 && this.isFree(lanes[lane] ?? [], box)) {
          return lane;
        }
      }
    }
  }

  private isFree(taken: [number, number][], box: LaneRequest): boolean {
    const left = box.x - this.gap;
    const right = box.x + box.width + this.gap;
    return taken.every(([start, end]) => end <= left || start >= right);
  }
}
