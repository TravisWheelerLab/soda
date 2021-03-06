import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {SequenceAnnotation, CharacterDatum} from "../../../annotations/sequence-annotation";

/**
 * @hidden
 */
export const characterXFn = <D extends CharacterDatum, C extends Chart<any>>(d: D) => d.x;
/**
 * @hidden
 */
export const sequenceYFn = <A extends SequenceAnnotation, C extends Chart<any>>(a: A, c: C) => (a.y + 1) * c.binHeight;

/**
 * @hidden
 */
export class SequenceZoomBehavior<A extends SequenceAnnotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGGElement, A, HTMLElement, any>> {
    selector: string;
    id = 'default-sequence-zoom-behavior';

    x: (a: A, c: C) => number;
    y: (a: A, c: C) => number;

    constructor(selector: string, x: (a: A, c: C) => number, y: (a: A, c: C) => number) {
        this.selector = `g.${selector}`;
        this.x = x;
        this.y = y;
    }

    public apply(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>): void {
        selection
            .attr('transform', (a) => `translate(${chart.getXScale()(this.x(a, chart))},${this.y(a, chart)})`);
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>, duration: number): void {
        selection
            .transition()
            .duration(duration)
            .attr('transform', (a) => `translate(${chart.getXScale()(this.x(a, chart))},${this.y(a, chart)})`);
    }
}

/**
 * @hidden
 */
export class SequenceCharacterZoomBehavior<D extends CharacterDatum, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGTextElement, D, HTMLElement, any>> {
    selector: string;
    id = 'default-sequence-character-zoom-behavior';

    constructor(selector: string) {
        this.selector = `text.${selector}`;
    }

    public apply(chart: C, selection: d3.Selection<SVGTextElement, D, HTMLElement, any>): void {
        selection
            .attr('x', (d) => chart.getXScale()(d.x))
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGTextElement, D, HTMLElement, any>, duration: number): void {
        selection
            .transition()
            .duration(duration)
            .attr('x', (d) => chart.getXScale()(d.x))
    }
}
