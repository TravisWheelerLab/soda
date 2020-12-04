import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {SequenceAnnotation, CharacterDatum} from "../../../annotations/sequence-annotation";

export const sequenceXFn = <A extends SequenceAnnotation, C extends Chart<any>>(a: A) => a.getX();
export const characterXFn = <D extends CharacterDatum, C extends Chart<any>>(d: D) => d.x;
export const sequenceYFn = <A extends SequenceAnnotation, C extends Chart<any>>(a: A, c: C) => a.y * c.binHeight;

export class SequenceZoomBehavior<A extends SequenceAnnotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGGElement, A, HTMLElement, any>> {
    selector: string;
    x: (a: A, c: C) => number;
    y: (a: A, c: C) => number;

    constructor(selector: string, x: (a: A, c: C) => number, y: (a: A, c: C) => number) {
        this.selector = `g.${selector}`;
        this.x = x;
        this.y = y;
    }

    public apply(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>): void {
        selection
            .attr('transform', (a) => `translate(${chart.getXScale()(this.x(a, chart))},${this.y(a, chart)})`);//, scale(${chart.svgSelection.node().__zoom.k}, 1)`);
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>, duration: number): void {
        selection
            .transition()
            .duration(duration)
            .attr('transform', (a) => `translate(${chart.getXScale()(this.x(a, chart))},${this.y(a, chart)})`);//, scale(${chart.svgSelection.node().__zoom.k}, 1)`);
    }
}

export class SequenceCharacterZoomBehavior<D extends CharacterDatum, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGTextElement, D, HTMLElement, any>> {
    selector: string;
    // x: (d: D, c: C) => number;

    constructor(selector: string) {
        this.selector = `text.${selector}`;
        // this.x = x;
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
