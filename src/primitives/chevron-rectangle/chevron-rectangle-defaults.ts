import {ZoomBehavior} from "../../plugins/zoom/zoom-behavior";

export {rectHFn} from "../rectangle/rectangle-defaults";
import {OrientedAnnotation} from "../../annotations/oriented-annotation";
import {Annotation} from "../../annotations/annotation";
import {Chart} from "../../charts/chart";
import * as d3 from "d3";

export const chevronPathDfn = <A extends OrientedAnnotation>(a: A, h: number) => {
    return (a.orientation == '>' || a.orientation == '+') ? forwardChevronPathFn(a, h) : reverseChevronPathFn(a, h);
};
export const forwardChevronPathFn = <A extends OrientedAnnotation>(a: A, h: number) => `M${h/2},0 L0,${h/2} L${h/2},${h}`;
export const reverseChevronPathFn = <A extends OrientedAnnotation>(a: A, h: number) => `M0,0 L${h/2},${h/2} L0,${h}`;

export const chevronXFn = <A extends OrientedAnnotation>(a: A) => {
    return (a.orientation == '>' || a.orientation == '+') ? forwardChevronXFn(a) : reverseChevronXFn(a);
};
export const forwardChevronXFn  = <A extends OrientedAnnotation>(a: A) => a.getX();
export const reverseChevronXFn  = <A extends OrientedAnnotation>(a: A) => a.getX() + a.getW();

export const chevronPatternViewBoxFn = <A extends OrientedAnnotation>(a: A, h: number) => `0,0,${h/2},${h}`;

export class PatternZoomBehavior<A extends OrientedAnnotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGPatternElement, A, HTMLElement, any>> {
    // we need a zoom behavior for the patterns so that they don't cause
    // a nauseating sliding effect when the chart is zoomed/panned
    selector: string;

    constructor(selector: string) {
        this.selector = `pattern.${selector}`;
    }

    public apply(chart: C, selection: d3.Selection<SVGPatternElement, A, HTMLElement, any>): void {
        selection
            .attr('x', (a: A) => chart.getXScale()(chevronXFn(a)))
    }
}

export class PatternSwitchZoomBehavior<A extends OrientedAnnotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGRectElement, A, HTMLElement, any>> {
    selector: string;
    fillColor: (a: A, c: C) => string;

    public constructor(selector: string, fillColor: (a: A, c: C) => string) {
        this.selector = `rect.${selector}`;
        this.fillColor = fillColor;
    }

    public apply(chart: C, selection: d3.Selection<SVGRectElement, A, HTMLElement, any>) {
        selection
            .style('fill', (a) => {
                if (chart.getSemanticViewRange().width < 20000) {
                    return (`url(#chevron-rect-bg-${a.id})`);
                }
                else {
                    return (this.fillColor(a, chart));
                }
            });
    }
}
