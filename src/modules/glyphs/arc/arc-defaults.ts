import * as d3 from "d3";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {Annotation} from "../../../annotations/annotation";
import {Chart} from "../../../charts/chart";

/**
 * @hidden
 */
export const arcXFn = <A extends Annotation>(a: A) => a.x;
/**
 * @hidden
 */
export const arcWFn = <A extends Annotation>(a: A) => a.w;
/**
 * @hidden
 */
export const arcYFn = <A extends Annotation, C extends Chart<any>>(a: A, c: C) => a.y * c.binHeight + 2;
/**
 * @hidden
 */
export const arcHFn = <A extends Annotation, C extends Chart<any>>(a: A, c: C) => c.binHeight;

/**
 * @hidden
 */
export class ArcZoomBehavior<A extends Annotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGPathElement, A, HTMLElement, any>> {

    selector: string;
    id = 'default-rect-zoom-behavior';

    x: (a: A, c: C) => number;
    w: (a: A, c: C) => number;

    constructor(selector: string, x: (a: A, c: C) => number, w: (a: A, c: C) => number) {
        this.selector = `rect.${selector}`;
        this.x = x;
        this.w = w;
    }

    public apply(chart: C, selection: d3.Selection<SVGPathElement, A, HTMLElement, any>): void {
        selection
            .attr('x', (a: A) => chart.getXScale()(this.x(a, chart)))
            .attr('width', (a: A) => chart.getXScale()(this.w(a, chart) + this.x(a, chart)) - chart.getXScale()(this.x(a, chart)));
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGPathElement, A, HTMLElement, any>, duration: number): void {
        selection
            .transition()
            .duration(duration)
            .attr('x', (a: A) => chart.getXScale()(this.x(a, chart)))
            .attr('width', (a: A) => chart.getXScale()(this.w(a, chart) + this.x(a, chart)) - chart.getXScale()(this.x(a, chart)));
    }
}
