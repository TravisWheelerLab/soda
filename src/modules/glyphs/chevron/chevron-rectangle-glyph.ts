import {Chart} from "../../../charts/chart";
import {OrientedAnnotation} from "../../../annotations/oriented-annotation";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import * as defaults from "./chevron-defaults";
import {ChevronPrimitiveConfig, Orientation} from "./chevron-config";
import {chevronPatternId, ChevronPatternType, createChevronPatterns} from "./chevron-patterns";
import {rectangleGlyph} from "../rectangle/rectangle-glyph";
import {RectangleConfig} from "../rectangle/rectangle-config";

/**
 * An interface that holds the parameters for rendering and configuring a chevron rectangle glyph.
 */

export interface ChevronRectangleConfig<A extends OrientedAnnotation, C extends Chart<any>> extends ChevronPrimitiveConfig<A, C>, RectangleConfig<A, C> {
}

/**
 * This renders a list of Annotation objects in a target chart as forward facing chevron rectangles.
 * @param chart The target Chart.
 * @param ann The list of Annotation objects to be rendered.
 * @param conf The parameters for configuring the style of the lines.
 */
export function forwardChevronRectangleGlyph<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: ChevronRectangleConfig<A, C>) {
    chevronRectangleGlyph(chart, ann, conf, Orientation.Forward);
    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.ForwardChevronZoomBehavior(conf.selector));
    }
}

/**
 * This renders a list of Annotation objects in a target chart as reverse facing chevron rectangles.
 * @param chart The target Chart.
 * @param ann The list of Annotation objects to be rendered.
 * @param conf The parameters for configuring the style of the lines.
 */
export function reverseChevronRectangleGlyph<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: ChevronRectangleConfig<A, C>) {
    chevronRectangleGlyph(chart, ann, conf, Orientation.Reverse);
    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.ReverseChevronZoomBehavior(conf.selector));
    }
}

function chevronRectangleGlyph<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[],
                                                                                   conf: ChevronRectangleConfig<A, C>,
                                                                                   orientation: Orientation): void {
    conf.chevronH = conf.chevronH || conf.h;
    conf.backgroundH = conf.backgroundH || conf.h;
    conf.backgroundFillColor = conf.backgroundFillColor || conf.fillColor;
    createChevronPatterns(chart, ann, conf, orientation, ChevronPatternType.Rectangle);
    const rectSelection = rectangleGlyph(chart, ann, conf);

    const fillColor = conf.fillColor || (() => 'black');
    rectSelection
        .style('fill', (a) => {
            if (chart.getSemanticViewRange().width < (conf.disableChevronAt || 20000)) {
                return (`url(#${chevronPatternId(ChevronPatternType.Rectangle)}-${a.id})`);
            }
            else {
                return fillColor(a, chart);
            }
        });

    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.PatternSwitchZoomBehavior(conf.selector, fillColor, ChevronPatternType.Rectangle));
    }
}
