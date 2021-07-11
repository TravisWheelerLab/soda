import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {Annotation} from "../../../annotations/annotation";
import {getPlotGSelection} from "./plot-defaults";
import * as defaults from "./axis-defaults";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {GlyphConfig} from "../glyph-config";

/**
 * An interface that holds the parameters to style a vertical axis.
 */
export interface VerticalAxisConfig<A extends Annotation, C extends Chart<any>> extends GlyphConfig {
    x?: (a: A, c: C) => number;
    domain?: (a: A, c: C) => [number, number];
    range?: (a: A, c: C) => [number, number];
    ticks?: (a: A, c: C) => number;
    tickSizeOuter?: (a: A, c: C) => number;
    fixed?: boolean;
    zoom?: ZoomBehavior<C, d3.Selection<SVGGElement, A, HTMLElement, any>>;
}

/**
 * This renders Annotations as vertical axes in a chart. This is intended to be used in conjunction with one of the
 * plotting glyph modules. The vertical axes can be fixed in place, but they are configured to move during zoom
 * events by default.
 * @param chart The Chart in which we will render the axes.
 * @param ann The Annotations to be rendered.
 * @param conf The parameters for configuring the styling of the axes.
 */
export function verticalAxis<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: VerticalAxisConfig<A, C>): void {
    let x = conf.x || defaults.axisXFn;
    let w = conf.x || defaults.axisXFn;
    let domain = conf.domain || (() => [0, 100]);
    let range = conf.range || (() => [0, chart.binHeight]);
    let ticks = conf.ticks || (() => 5);
    let tickSizeOuter = conf.tickSizeOuter || (() => 6);
    let fixed = conf.fixed || false;

    let gSelections = getPlotGSelection(chart, ann, conf);
    let outerMerge = gSelections[1];

    outerMerge
        .attr('transform', (a) => `translate(${chart.getXScale()(x(a, chart))}, ${chart.binHeight * a.y + chart.verticalPad})`)
        .each( (a, i, nodes) => {
            let yScale = d3.scaleLinear()
                .domain(domain(a, chart))
                .range(range(a, chart));

            let axis = d3.axisRight(yScale)
                .ticks(ticks(a, chart))
                .tickSizeOuter(tickSizeOuter(a, chart));

            d3.select(nodes[i])
                .call(axis);
        });

    if (!fixed) {
        if (isZoomableChart(chart)) {
            // if the chart is zoomable, register the ZoomBehavior for the rectangles
            registerZoomBehavior(chart, conf.zoom || new defaults.VerticalAxisZoomBehavior(conf.selector, x, w));
        }
    }
}
