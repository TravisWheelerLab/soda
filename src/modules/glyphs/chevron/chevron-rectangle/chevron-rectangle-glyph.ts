import {Chart} from "../../../../charts/chart";
import {OrientedAnnotation} from "../../../../annotations/oriented-annotation";
import {isZoomableChart} from "../../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../../zoom/zoom-utilities";
import * as defaults from "../chevron-defaults";
import {ChevronRectangleConfig} from "./chevron-rectangle-config";
import {Orientation} from "../chevron-config";
import {createChevronPatterns, ChevronPatternType, chevronPatternId} from "../chevron-patterns";
import {rectangleGlyph} from "../../rectangle/rectangle-glyph";

export function forwardChevronRectangle<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: ChevronRectangleConfig<A, C>) {
    chevronRectangleGlyph(chart, ann, conf, Orientation.Forward);
    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.ForwardChevronZoomBehavior(conf.selector));
    }
}

export function reverseChevronRectangle<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: ChevronRectangleConfig<A, C>) {
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
