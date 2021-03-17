import {Chart} from "../../../charts/chart";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import * as d3 from "d3";
import {Annotation} from "../../../annotations/annotation";

/**
 * @hidden
 */
export const axisXFn = <A extends Annotation>(a: A) => a.getX();

/**
 * @hidden
 */
export class VerticalAxisZoomBehavior<A extends Annotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGGElement, A, HTMLElement, any>> {
    id: string = 'default-vertical-axis-zoom-behavior';
    selector: string;
    x: (a: A, c: C) => number;
    w: (a: A, c: C) => number;

    constructor(selector: string, x: (a: A, c: C) => number, w: (a: A, c: C) => number) {
        this.selector = `g.${selector}`;
        this.x = x;
        this.w = w;
    }

    public apply(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>) {
        selection
            .attr('transform', (a) => `translate(${chart.getXScale()(this.x(a, chart))}, ${chart.binHeight * a.y + chart.verticalPad})`)
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>, duration: number) {
        selection
            .transition()
            .duration(duration)
            .attr('transform', (a) => `translate(${chart.getXScale()(this.x(a, chart))}, ${chart.binHeight * a.y + chart.verticalPad})`)
    }
}
