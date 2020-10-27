import * as d3 from "d3";
import {ZoomBehavior} from "../../plugins/zoom/zoom-behavior";
import {Annotation} from "../../annotations/annotation";
import {Chart} from "../../charts/chart";

export const rectXFn = <A extends Annotation>(a: A) => a.x;
export const rectWFn = <A extends Annotation>(a: A) => a.w;
export const rectYFn = <A extends Annotation, C extends Chart<any>>(a: A, c: C) => a.y * c.binHeight + 2;
export const rectHFn = <A extends Annotation, C extends Chart<any>>(a: A, c: C) => c.binHeight - 4;

export class RectZoomBehavior<A extends Annotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGRectElement, A, HTMLElement, any>> {
    // the default zoom behavior for a rectangle
    // it basically just allows stretching/panning in the horizontal direction
    selector: string;
    x: (a: A, c: C) => number;
    w: (a: A, c: C) => number;

    constructor(selector: string, x: (a: A, c: C) => number, w: (a: A, c: C) => number) {
        this.selector = `rect.${selector}`;
        this.x = x;
        this.w = w;
    }

    public apply(chart: C, selection: d3.Selection<SVGRectElement, A, HTMLElement, any>): void {
        selection
            .attr('x', (a: A) => chart.getXScale()(this.x(a, chart)))
            .attr('width', (a: A) => chart.getXScale()(this.w(a, chart) + this.x(a, chart)) - chart.getXScale()(this.x(a, chart)));
    }
}
