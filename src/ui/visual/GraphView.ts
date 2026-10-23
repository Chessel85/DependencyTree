import { Entry } from '../../core/model/Entry';
import { LinkKind } from '../../core/model/LinkKind';
import { Moment } from '../../core/model/Moment';
import { GraphLayout, LinkPath, NodeBox, PeriodBar, Point } from './GraphLayout';

const SVG = 'http://www.w3.org/2000/svg';
const JAG = 6;

/** The class that styles each kind of link: solid, dashed or dotted (DES-VIEW-003). */
const LINK_CLASS: Record<LinkKind, string> = {
  [LinkKind.DependsOn]: 'link',
  [LinkKind.CausedBy]: 'link cause',
  [LinkKind.InfluencedBy]: 'link influence',
};

/**
 * Draws a finished layout in SVG, and marks the current entry and the
 * highlighted entry (DES-VIEW-001). Clicking a moment or a period chooses it
 * (DES-VIEW-008). The drawing is hidden from screen readers, because the card
 * already gives everything it shows (DES-VIEW-012).
 */
export class GraphView {
  private readonly svg: SVGSVGElement;
  private shapes = new Map<Entry, SVGGElement>();
  private links: { link: LinkPath; element: SVGPathElement }[] = [];
  private layout?: GraphLayout;

  constructor(
    private readonly scroller: HTMLElement,
    private readonly onChoose: (entry: Entry) => void,
  ) {
    this.svg = document.createElementNS(SVG, 'svg');
    this.svg.setAttribute('aria-hidden', 'true');
    this.svg.setAttribute('focusable', 'false');
    scroller.replaceChildren(this.svg);
  }

  render(layout: GraphLayout): void {
    this.layout = layout;
    this.shapes = new Map();
    this.links = [];
    this.svg.setAttribute('width', String(layout.width));
    this.svg.setAttribute('height', String(layout.height));
    this.svg.setAttribute('viewBox', `0 0 ${layout.width} ${layout.height}`);
    this.svg.replaceChildren(
      this.definitions(),
      this.axis(layout),
      this.today(layout),
      ...layout.bars.map((b) => this.bar(b, layout)),
      ...layout.links.map((l) => this.link(l)),
      ...layout.nodes.map((n) => this.node(n)),
    );
  }

  /** Marks the current entry and the highlighted one, and scrolls the current entry to the middle. */
  mark(current: Entry, highlighted: Entry | undefined): void {
    for (const [entry, shape] of this.shapes) {
      shape.classList.toggle('current', entry === current);
      shape.classList.toggle('highlighted', entry === highlighted && entry !== current);
    }
    for (const { link, element } of this.links) {
      element.classList.toggle('near', link.earlier === current || link.later === current);
    }
    this.centreOn(current);
  }

  private centreOn(entry: Entry): void {
    const box = this.layout?.nodes.find((n) => n.moment === entry) ?? this.layout?.bars.find((b) => b.period === entry);
    if (!box) {
      return;
    }
    const visible = Math.min(box.width, this.scroller.clientWidth);
    this.scroller.scrollTo({ left: box.x + visible / 2 - this.scroller.clientWidth / 2, behavior: 'smooth' });
  }

  private definitions(): SVGDefsElement {
    const defs = this.element('defs', {});
    const marker = this.element('marker', {
      id: 'arrow', viewBox: '0 0 10 10', refX: '10', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto',
    });
    marker.append(this.element('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head' }));
    const soft = this.element('linearGradient', { id: 'soft' });
    for (const [offset, opacity] of [['0', '0'], ['0.2', '1'], ['0.8', '1'], ['1', '0']]) {
      soft.append(this.element('stop', { offset, 'stop-color': 'var(--uncertain)', 'stop-opacity': opacity }));
    }
    defs.append(marker, soft);
    return defs;
  }

  private axis(layout: GraphLayout): SVGGElement {
    const group = this.element('g', { class: 'axis' });
    for (const tick of layout.ticks) {
      group.append(
        this.element('line', { x1: String(tick.x), y1: '18', x2: String(tick.x), y2: String(layout.height), class: 'grid' }),
        this.text(tick.label, tick.x, 14, 'tick-label'),
      );
    }
    return group;
  }

  /** The line for today (DES-VIEW-009). */
  private today(layout: GraphLayout): SVGGElement {
    const group = this.element('g', { class: 'today' });
    const x = String(layout.todayX);
    group.append(
      this.element('line', { x1: x, y1: '18', x2: x, y2: String(layout.height) }),
      this.text('Today', layout.todayX + 4, 14, 'today-label'),
    );
    return group;
  }

  private bar(bar: PeriodBar, layout: GraphLayout): SVGGElement {
    const group = this.chosenBy(bar.period, 'period');
    const { x, y, width, height } = bar;
    const shape = bar.ongoing
      ? this.element('path', { d: this.jaggedBar(bar), class: 'bar' })
      : this.element('rect', { x: String(x), y: String(y), width: String(width), height: String(height), rx: '3', class: 'bar' });
    group.append(shape);
    for (const mark of bar.marks) {
      group.append(this.element('circle', { cx: String(mark), cy: String(y + height / 2), r: '3', class: 'mark' }));
    }
    group.append(this.text(bar.period.name, x + 8, y + height / 2 + 4, 'bar-label'));
    group.append(this.guides(bar, layout));
    return group;
  }

  /** Dotted lines from a period's marks down to its moments, shown while the period is current. */
  private guides(bar: PeriodBar, layout: GraphLayout): SVGGElement {
    const group = this.element('g', { class: 'guides' });
    for (const stop of bar.period.stops) {
      const node = layout.nodes.find((n) => n.moment === stop);
      if (stop instanceof Moment && node) {
        const cx = String(node.x + node.width / 2);
        group.append(this.element('line', { x1: cx, y1: String(bar.y + bar.height), x2: cx, y2: String(node.y) }));
      }
    }
    return group;
  }

  /** A bar whose right-hand edge is jagged, for a period still going on (DES-VIEW-002). */
  private jaggedBar({ x, y, width, height }: PeriodBar): string {
    const right = x + width;
    const steps = 4;
    let d = `M ${x} ${y} L ${right} ${y}`;
    for (let i = 1; i <= steps; i++) {
      const dx = i % 2 === 1 ? -JAG : 0;
      d += ` L ${right + dx} ${y + (height * i) / steps}`;
    }
    return `${d} L ${x} ${y + height} Z`;
  }

  private link(link: LinkPath): SVGPathElement {
    const element = this.element('path', { d: this.linkPath(link.points, link.curved), class: LINK_CLASS[link.kind], 'marker-end': 'url(#arrow)' });
    this.links.push({ link, element });
    return element;
  }

  private linkPath(points: Point[], curved: boolean): string {
    const [first, ...rest] = points;
    if (!curved) {
      return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(' ');
    }
    const last = rest[rest.length - 1];
    const pull = Math.max(40, Math.abs(last.x - first.x) / 2);
    return `M ${first.x} ${first.y} C ${first.x + pull} ${first.y}, ${last.x - pull} ${last.y}, ${last.x} ${last.y}`;
  }

  private node(node: NodeBox): SVGGElement {
    const group = this.chosenBy(node.moment, 'node');
    group.classList.toggle('uncertain', node.uncertain);
    group.classList.toggle('planned', node.planned);
    if (node.span && node.span[1] - node.span[0] > 2) {
      const [left, right] = node.span;
      group.append(this.element('rect', {
        x: String(left), y: String(node.y + node.height + 2), width: String(right - left), height: '5', class: 'span',
      }));
    }
    group.append(
      this.element('rect', {
        x: String(node.x), y: String(node.y), width: String(node.width), height: String(node.height), rx: '6', class: 'box',
      }),
      this.text(node.name, node.x + 8, node.y + 17, 'name'),
      this.text(node.date, node.x + 8, node.y + 32, 'date'),
    );
    return group;
  }

  private chosenBy(entry: Entry, kind: string): SVGGElement {
    const group = this.element('g', { class: kind });
    group.addEventListener('click', () => this.onChoose(entry));
    this.shapes.set(entry, group);
    return group;
  }

  private text(content: string, x: number, y: number, className: string): SVGTextElement {
    const text = this.element('text', { x: String(x), y: String(y), class: className });
    text.textContent = content;
    return text;
  }

  private element<K extends keyof SVGElementTagNameMap>(tag: K, attributes: Record<string, string>): SVGElementTagNameMap[K] {
    const element = document.createElementNS(SVG, tag);
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
    return element;
  }
}
