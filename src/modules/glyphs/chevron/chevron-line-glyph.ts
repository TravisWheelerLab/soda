import {Chart} from "../../../charts/chart";
import {Orientation, OrientedAnnotation} from "../../../annotations/oriented-annotation";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import * as defaults from "./chevron-defaults";
import {chevronPatternId, ChevronPatternType, createChevronPatterns} from "./chevron-patterns";
import {ChevronPrimitiveConfig} from "./chevron-config";
import {horizontalLineGlyph, HorizontalLineConfig} from "../line/line-glyph";
import {RectangleConfig, rectangleGlyph} from "../rectangle/rectangle-glyph";

/**
 * An interface that holds the parameters for rendering and configuring a chevron line glyph.
 */
export interface ChevronLineConfig<A extends OrientedAnnotation, C extends Chart<any>> extends ChevronPrimitiveConfig<A, C>, HorizontalLineConfig<A, C> {
    h?: (a: A, c: C) => number;
}

/**
 * This renders a list of Annotation objects in a target chart as forward facing chevron lines.
 * @param chart The target Chart.
 * @param ann The list of Annotation objects to be rendered.
 * @param conf The parameters for configuring the style of the lines.
 */
export function forwardChevronLine<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: ChevronLineConfig<A, C>) {
    chevronLineGlyph(chart, ann, conf);
    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.ForwardChevronZoomBehavior(conf.selector));
    }
}

/**
 * This renders a list of Annotation objects in a target chart as reverse facing chevron lines.
 * @param chart The target Chart.
 * @param ann The list of Annotation objects to be rendered.
 * @param conf The parameters for configuring the style of the lines.
 */
export function reverseChevronLine<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: ChevronLineConfig<A, C>) {
    chevronLineGlyph(chart, ann, conf);
    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.ReverseChevronZoomBehavior(conf.selector));
    }
}

export function chevronLineGlyph<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[],
                                                                                    conf: ChevronLineConfig<A, C>): void {
    conf.chevronY = conf.chevronY || conf.y;
    conf.chevronH = conf.chevronH || conf.h;
    createChevronPatterns(chart, ann, conf, ChevronPatternType.Line);
    horizontalLineGlyph(chart, ann, conf);
    const h = conf.h || defaults.chevronHFn;
    const y = conf.y || defaults.chevronLineYFn;

    const rectConf: RectangleConfig<A, C> = {
        selector: conf.selector,
        strokeOpacity: () => 0,
        y: (a, c) => y(a, c) - h(a, c)/2,
        h: h
    };

    const rectSelection = rectangleGlyph(chart, ann, rectConf);
    rectSelection
        .style('fill', (a ) => `url(#${chevronPatternId(ChevronPatternType.Line)}-${a.id})`);

    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.ReverseChevronZoomBehavior(conf.selector));
    }
}
