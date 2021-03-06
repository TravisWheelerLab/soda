import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {Annotation} from "../../../annotations/annotation";
import {Chart} from "../../../charts/chart";
import * as d3 from "d3";
import {chevronPatternId, ChevronPatternType} from "./chevron-patterns";
import {Orientation, OrientedAnnotation} from "../../../annotations/oriented-annotation";
import {horizontalLineYFn} from "../line/line-defaults";
import {rectYFn} from "../rectangle/rectangle-defaults";

/**
 * @hidden
 */
export const chevronRectYFn = rectYFn;
/**
 * @hidden
 */
export const chevronLineYFn = horizontalLineYFn;
/**
 * @hidden
 */
export const chevronHFn = <A extends Annotation, C extends Chart<any>>(a: A, c: C) => c.binHeight - 4;

/**
 * @hidden
 */
export const chevronPathDFn = <A extends OrientedAnnotation>(a: A, h: number) => {
    if (a.orientation == Orientation.Forward) {
        return (forwardChevronPathFn(a, h));
    }
    else if (a.orientation == Orientation.Reverse) {
        return (reverseChevronPathFn(a, h));
    }
    else {
        throw("Bad orientation in chevronPathDFn");
    }
};

/**
 * @hidden
 */
export const forwardChevronPathFn = <A extends Annotation>(a: A, h: number) => `M0,0 L${h/2},${h/2} L0,${h}`;
/**
 * @hidden
 */
export const reverseChevronPathFn = <A extends Annotation>(a: A, h: number) => `M${h/2},0 L0,${h/2} L${h/2},${h}`;

/**
 * @hidden
 */
export const chevronXFn = <A extends OrientedAnnotation>(a: A) => {
    if (a.orientation == Orientation.Forward) {
        return (forwardChevronXFn(a));
    }
    else if (a.orientation == Orientation.Reverse) {
        return (reverseChevronXFn(a));
    }
    else {
        throw("Bad orientation in chevronXFn");
    }
};

/**
 * @hidden
 */
export const forwardChevronXFn = <A extends Annotation>(a: A) => a.getX();
/**
 * @hidden
 */
export const reverseChevronXFn = <A extends Annotation>(a: A) => a.getX() + a.getW();

/**
 * @hidden
 */
export const chevronPatternViewBoxFn = <A extends Annotation>(a: A, h: number, s: number) => `0,0,${(h/2 + s)},${h}`;

/**
 * @hidden
 */
export class ForwardChevronZoomBehavior<A extends Annotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGPatternElement, A, HTMLElement, any>> {
    selector: string;
    id = 'default-forward-chevron-zoom-behavior';

    constructor(selector: string) {
        this.selector = `pattern.${selector}`;
    }

    public apply(chart: C, selection: d3.Selection<SVGPatternElement, A, HTMLElement, any>): void {
        selection
            .attr('x', (a: A) => chart.getXScale()(forwardChevronXFn(a)))
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGPatternElement, A, HTMLElement, any>, duration: number): void {
        selection
            .transition()
            .duration(duration)
            .attr('x', (a: A) => chart.getXScale()(forwardChevronXFn(a)))
    }
}

/**
 * @hidden
 */
export class ReverseChevronZoomBehavior<A extends Annotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGPatternElement, A, HTMLElement, any>> {
    selector: string;
    id = 'default-reverse-chevron-zoom-behavior';

    constructor(selector: string) {
        this.selector = `pattern.${selector}`;
    }

    public apply(chart: C, selection: d3.Selection<SVGPatternElement, A, HTMLElement, any>): void {
        selection
            .attr('x', (a: A) => chart.getXScale()(reverseChevronXFn(a)))
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGPatternElement, A, HTMLElement, any>, duration: number = 0): void {
        selection
            .transition()
            .duration(duration)
            .attr('x', (a: A) => chart.getXScale()(reverseChevronXFn(a)))
    }
}

/**
 * @hidden
 */
export class ChevronZoomBehavior<A extends OrientedAnnotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGPatternElement, A, HTMLElement, any>> {
    selector: string;
    id = 'default-chevron-zoom-behavior';

    constructor(selector: string) {
        this.selector = `pattern.${selector}`;
    }

    public apply(chart: C, selection: d3.Selection<SVGPatternElement, A, HTMLElement, any>): void {
        selection
            .attr('x', (a: A) => chart.getXScale()(chevronXFn(a)))
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGPatternElement, A, HTMLElement, any>, duration: number = 0): void {
        selection
            .transition()
            .duration(duration)
            .attr('x', (a: A) => chart.getXScale()(chevronXFn(a)))
    }
}

/**
 * @hidden
 */
export class PatternSwitchZoomBehavior<A extends Annotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGRectElement, A, HTMLElement, any>> {
    selector: string;
    id = 'default-pattern-switch-zoom-behavior';

    fillColor: (a: A, c: C) => string;
    patternType: ChevronPatternType;

    public constructor(selector: string, fillColor: (a: A, c: C) => string, patternType: ChevronPatternType) {
        this.selector = `rect.${selector}`;
        this.fillColor = fillColor;
        this.patternType = patternType;
    }

    public apply(chart: C, selection: d3.Selection<SVGRectElement, A, HTMLElement, any>) {
        selection
            .style('fill', (a) => {
                if (chart.getSemanticViewRange().width < 20000) {
                    return (`url(#${chevronPatternId(this.patternType)}-${a.id})`);
                }
                else {
                    return (this.fillColor(a, chart));
                }
            });
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGRectElement, A, HTMLElement, any>, duration: number = 0) {
        selection
            .transition()
            .duration(duration)
            .style('fill', (a) => {
                if (chart.getSemanticViewRange().width < 20000) {
                    return (`url(#${chevronPatternId(this.patternType)}-${a.id})`);
                }
                else {
                    return (this.fillColor(a, chart));
                }
            });
    }
}
