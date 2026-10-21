import { Moment } from './Moment';

/** One "depends on" link: `dependent` could not have happened without `dependency` (DES-REL-001). */
export class Dependency {
  constructor(
    readonly dependent: Moment,
    readonly dependency: Moment,
  ) {}
}
