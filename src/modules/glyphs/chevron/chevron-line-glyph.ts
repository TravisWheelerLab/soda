import {Chart} from "../../../charts/chart";
import {OrientedAnnotation} from "../../../annotations/oriented-annotation";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import * as defaults from "./chevron-defaults";
import {chevronPatternId, ChevronPatternType, createChevronPatterns} from "./chevron-patterns";
import {ChevronPrimitiveConfig, Orientation} from "./chevron-config";
import {horizontalLine, HorizontalLineConfig} from "../line/line-glyph";
import {RectangleConfig} from "../rectangle/rectangle-config";
import {rectangleGlyph} from "../rectangle/rectangle-glyph";

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
    chevronLineGlyph(chart, ann, conf, Orientation.Forward);
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
    chevronLineGlyph(chart, ann, conf, Orientation.Reverse);
    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.ReverseChevronZoomBehavior(conf.selector));
    }
}

function chevronLineGlyph<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[],
                                                                              conf: ChevronLineConfig<A, C>,
                                                                              orientation: Orientation): void {

    conf.chevronH = conf.chevronH || conf.h;
    createChevronPatterns(chart, ann, conf, orientation, ChevronPatternType.Line);
    horizontalLine(chart, ann, conf);
    const h = conf.h || defaults.chevronHFn;
    const y = conf.y || (() => 0);

    const rectConf: RectangleConfig<A, C> = {
        selector: conf.selector,
        strokeOpacity: () => 0,
        y: (a, c) => y(a, c) - h(a, c)/2,
        h: h
    };

    const rectSelection = rectangleGlyph(chart, ann, rectConf);
    rectSelection
        .style('fill', (a ) => `url(#${chevronPatternId(ChevronPatternType.Line)}-${a.id})`);
}
