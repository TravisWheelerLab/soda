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
export const arcYFn = <A extends Annotation, C extends Chart<any>>(a: A, c: C) => (a.y + 1) * c.binHeight;
/**
 * @hidden
 */
export const arcHFn = <A extends Annotation, C extends Chart<any>>(a: A, c: C) => c.binHeight;
/**
 * @hidden
 * @param x
 * @param w
 * @param h
 */
export function buildArcRadiusFn <A extends Annotation, C extends Chart<any>>(
    x: (a: A, c: C) => number,
    w: (a: A, c: C) => number,
    h: (a: A, c: C) => number): (a: A, c: C) => number {

    let fn = (a: A, c: C) => {
        let hCalculated = h(a, c);
        let wCalculated = c.getXScale()(x(a, c) + w(a, c)) - c.getXScale()(x(a, c));
        let radius = (hCalculated / 2) + (Math.pow(wCalculated, 2) / (hCalculated * 8));
        return radius
    }
    return fn;
}

/**
 * @hidden
 */
export function buildArcTranslateFn <A extends Annotation, C extends Chart<any>>(
    x: (a: A, c: C) => number,
    w: (a: A, c: C) => number,
    h: (a: A, c: C) => number,
    y: (a: A, c: C) => number,
    radius: (a: A, c: C) => number): (a: A, c: C) => string {

    let fn = (a: A, c: C) => {
        let wCalculated = c.getXScale()(x(a, c) + w(a, c)) - c.getXScale()(x(a, c));
        let translateX = c.getXScale()(x(a, c)) + wCalculated / 2;
        let radiusCalculated = radius(a, c);
        let translateY = y(a, c) + radiusCalculated - h(a, c);
        return `translate(${translateX}, ${translateY})`
    }
    return fn
}
/**
 * @hidden
 */
export function buildArcEndAngleFn <A extends Annotation, C extends Chart<any>>(
    x: (a: A, c: C) => number,
    w: (a: A, c: C) => number,
    radius: (a: A, c: C) => number): (a: A, c: C) => number {

    let fn = (a: A, c: C) => {
        let radiusCalculated = radius(a, c);
        let wCalculated = c.getXScale()(x(a, c) + w(a, c)) - c.getXScale()(x(a, c));
        let angle = Math.asin((wCalculated / 2) / radiusCalculated);
        return angle;
    }
    return fn;
}
/**
 * @hidden
 */
export function buildArcStartAngleFn <A extends Annotation, C extends Chart<any>>(
    x: (a: A, c: C) => number,
    w: (a: A, c: C) => number,
    radius: (a: A, c: C) => number): (a: A, c: C) => number {

    let fn = (a: A, c: C) => {
        let radiusCalculated = radius(a, c);
        let wCalculated = c.getXScale()(x(a, c) + w(a, c)) - c.getXScale()(x(a, c));
        let angle = Math.asin((wCalculated / 2) / radiusCalculated);
        return -angle;
    }
    return fn;
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
            .attr("transform", (a) => this.translate(a, chart))
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
            .attr("transform", (a) => this.translate(a, chart))
            .attr("d", d3.arc<any, A>()
                .innerRadius((a) => this.radius(a, chart) - 1)
                .outerRadius((a) => this.radius(a, chart))
                .startAngle((a) => this.startAngle(a, chart))
                .endAngle((a) => this.endAngle(a, chart))
            )
    }
}
