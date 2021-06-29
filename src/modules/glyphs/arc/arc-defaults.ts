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
export const radiusFn: <A extends Annotation, C extends Chart<any>>(a: A, c: C) => number = (a, c) => {
    let hCalculated = arcHFn(a, c);
    let wCalculated = c.getXScale()(arcWFn(a));
    return ( (hCalculated / 2) + (Math.pow(wCalculated, 2) / (hCalculated * 8)) );
};
/**
 * @hidden
 */
export const translateFn: <A extends Annotation, C extends Chart<any>>(a: A, c: C) => string = (a, c) => {
    let translateX = c.getXScale()(arcXFn(a)) + c.getXScale()(arcWFn(a)) / 2;
    let radiusCalculated = radiusFn(a, c);
    let translateY = (a.y + 1) * c.binHeight + radiusCalculated - arcHFn(a, c);
    return `translate(${translateX}, ${translateY})`
}
/**
 * @hidden
 */
export const endAngleFn: <A extends Annotation, C extends Chart<any>>(a: A, c: C) => number = (a, c) => {
    let radiusCalculated = radiusFn(a, c);
    let angle = Math.asin( (c.getXScale()(arcWFn(a)) / 2 ) / radiusCalculated );
    return angle
}
/**
 * @hidden
 */
export const startAngleFn: <A extends Annotation, C extends Chart<any>>(a: A, c: C) => number = (a, c) => {
    let angle = -(endAngleFn(a, c));
    return angle;
}

/**
 * @hidden
 */
export class ArcZoomBehavior<A extends Annotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGPathElement, A, HTMLElement, any>> {
    selector: string;
    id = 'default-arc-zoom-behavior';
    radius: (a: A, c: C) => number;
    translate: (a: A, c: C) => string;
    startAngle: (a: A, c: C) => number;
    endAngle: (a: A, c: C) => number;

    constructor(selector: string,
                radius: (a: A, c: C) => number,
                translate: (a: A, c: C) => string,
                startAngle: (a: A, c: C) => number,
                endAngle: (a: A, c: C) => number) {
        this.selector = `path.${selector}`;
        this.radius = radius;
        this.translate = translate;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    public apply(chart: C, selection: d3.Selection<SVGPathElement, A, HTMLElement, any>): void {
        selection
            .attr("d", d3.arc<any, A>()
                .innerRadius((a) => this.radius(a, chart) - 1)
                .outerRadius((a) => this.radius(a, chart))
                .startAngle((a) => this.startAngle(a, chart))
                .endAngle((a) => this.endAngle(a, chart))
            )
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGPathElement, A, HTMLElement, any>, duration: number): void {
        selection
            .transition()
            .duration(duration)
    }
}
