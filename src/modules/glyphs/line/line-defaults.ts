import * as d3 from "d3";
import {Annotation} from "../../../annotations/annotation";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {Chart} from "../../../charts/chart";

export const horizontalLineX1Fn = <A extends Annotation>(a: A) => a.getX();
export const horizontalLineX2Fn = <A extends Annotation>(a: A) => a.getX() + a.getW();
export const horizontalLineYFn = <A extends Annotation, C extends Chart<any>>(a: A, c: C) => a.y * c.binHeight + c.binHeight / 2;

export const verticalLineXFn = <A extends Annotation>(a: A) => (a.getX() + a.getW()) / 2;
export const verticalLineY1Fn = <A extends Annotation, C extends Chart<any>>(a: A, c: C) => a.y * c.binHeight;
export const verticalLineY2Fn = <A extends Annotation, C extends Chart<any>>(a: A, c: C) => (a.y + 1) * c.binHeight;

export class LineZoomBehavior<A extends Annotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGLineElement, A, HTMLElement, any>> {
    // the default ZoomBehavior for a vertical line drawn with this module
    // it moves and stretches the line horizontally
    selector: string;
    x1: (d: A, c: C) => number;
    x2: (d: A, c: C) => number;

    constructor(selector: string, x1: (d: A, c: C) => number, x2: (d: A, c: C) => number) {
        this.selector = `line.${selector}`;
        this.x1 = x1;
        this.x2 = x2;
    }

    public apply(chart: C, selection: d3.Selection<SVGLineElement, A, HTMLElement, any>): void {
        selection
            .attr('x1', (a: A) => chart.getXScale()(this.x1(a, chart)))
            .attr('x2', (a: A) => chart.getXScale()(this.x2(a, chart)));
    }
}
