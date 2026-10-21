import { Moment } from '../model/Moment';
import { Visit } from './Visit';

/** The path the user has taken, for Backspace and P (DES-NAV-007). */
export class PathHistory {
  private readonly visits: Visit[] = [];

  push(visit: Visit): void {
    this.visits.push(visit);
  }

  pop(): Visit | undefined {
    return this.visits.pop();
  }

  /** The moments visited before the current one, oldest first. */
  get moments(): Moment[] {
    return this.visits.map((v) => v.moment);
  }
}
