import { Period } from '../../core/model/Period';
import { NavigationState } from '../../core/navigation/NavigationState';
import { GraphLayout } from './GraphLayout';
import { GraphLayoutAssembler } from './GraphLayoutAssembler';
import { GraphView } from './GraphView';
import { LayoutEngine } from './LayoutEngine';

/**
 * Keeps the drawing in step with the navigator (REQ-VIEW-006). It draws the
 * chosen layout, working each one out only once, and marks the current and
 * highlighted entries whenever the navigation state changes.
 */
export class VisualView {
  private readonly finished = new Map<LayoutEngine, Promise<GraphLayout>>();
  private shown?: LayoutEngine;

  constructor(
    private readonly view: GraphView,
    private readonly state: NavigationState,
    private readonly periods: readonly Period[],
    private readonly assembler = new GraphLayoutAssembler(),
  ) {}

  async show(engine: LayoutEngine): Promise<void> {
    this.shown = engine;
    let layout = this.finished.get(engine);
    if (!layout) {
      layout = engine.arrange().then((a) => this.assembler.assemble(a, this.periods));
      this.finished.set(engine, layout);
    }
    const ready = await layout;
    // A slow layout mustn't replace one chosen after it.
    if (this.shown === engine) {
      this.view.render(ready);
      this.update();
    }
  }

  /** Called whenever the current entry, the active list or its highlight changes. */
  update(): void {
    this.view.mark(this.state.currentEntry, this.state.activeList.highlighted);
  }
}
