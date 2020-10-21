import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {OrientedAnnotation} from "../../../annotations/oriented-annotation";
import {isZoomableChart} from "../../../plugins/zoom/zoomable-chart";
import {
    horizontalLine,
    rectangle,
    RectangleConfig,
    registerZoomBehavior
} from "../../../primitives";
import * as defaults from "../chevron-defaults";
import {ChevronLineConfig} from "./chevron-line-config";
import {chevronPatternId, ChevronPatternType, createChevronPatterns} from "../chevron-patterns";
import {Orientation} from "../chevron-config";

export function forwardChevronLine<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: ChevronLineConfig<A, C>) {
    chevronLine(chart, ann, conf, Orientation.Forward);
    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.ForwardChevronZoomBehavior(conf.selector));
    }
}

export function reverseChevronLine<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: ChevronLineConfig<A, C>) {
    chevronLine(chart, ann, conf, Orientation.Reverse);
    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.ReverseChevronZoomBehavior(conf.selector));
    }
}

function chevronLine<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[],
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

    const rectSelection = rectangle(chart, ann, rectConf);
    rectSelection
        .style('fill', (a ) => `url(#${chevronPatternId(ChevronPatternType.Line)}-${a.id})`);
}
