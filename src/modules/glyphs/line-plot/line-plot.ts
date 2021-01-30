import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {PlotAnnotation, PointDatum} from "../../../annotations/plot-annotation";
import {mapIdToAnnotation, mapIdToSelection} from "../../../plugins/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import * as defaults from "./line-plot-defaults";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {GlyphConfig} from "../glyph-config";


export interface LinePlotConfig<A extends PlotAnnotation, C extends Chart<any>> extends GlyphConfig<A, C> {
    /**
     * A callback to define the stroke color of the line plot.
     * @param a
     * @param c
     */
    strokeColor?: (a: A, c: C) => string;
    /**
     * A callback to define the stroke width of the line plot.
     * @param a
     * @param c
     */
    strokeWidth?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke opacity of the line plot.
     * @param a
     * @param c
     */
    strokeOpacity?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke dash array of the line plot. Supplying this will allow lines to be
     * dotted/dashed.
     * @param a
     * @param c
     */
    strokeDashArray?: (a: A, c: C) => string;
    /**
     * A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by
     * experienced users only.
     */
    zoom?: ZoomBehavior<C, d3.Selection<SVGElement, A, HTMLElement, any>>;
}

export function linePlot<A extends PlotAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: LinePlotConfig<A, C>): void {
    // bind the provided data to new svg lines
    const selection = chart.svgSelection
        .selectAll<SVGPathElement, A>(`line.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    console.log("FIRST SELECTION:", selection);

    const enter = selection.enter()
        .append('path');

    console.log("ENTER:", enter)

    const merge = enter.merge(selection);

    console.log("MERGE:", enter)

    const strokeWidth = conf.strokeWidth || (() => 1);
    const strokeOpacity = conf.strokeOpacity || (() => 1);
    const strokeColor = conf.strokeColor || (() => 'black');
    const strokeDashArray = conf.strokeDashArray || (() => "");

    // set the constant style parameters
    enter
        .attr('class', conf.selector)
        .style('stroke-width', (a: A) => strokeWidth(a, chart))
        .style('stroke-opacity', (a: A) => strokeOpacity(a, chart))
        .style('stroke-dasharray', (a: A) => strokeDashArray(a, chart))
        .style('stroke', (a: A) => strokeColor(a, chart))

    // let lineFunc = conf.lineFunc || defaults.lineFunc(chart)
    let lineFunc = defaults.lineFunc(chart)

    // set the position parameters
    merge
        .datum((a) => a.points)
        .attr('d', lineFunc);

    //
    //
    // // for all of the lines remaining, update the id->d3 selection map
    // merge
    //     .each((a, i, nodes) => {
    //         mapIdToSelection(a.id, d3.select(nodes[i]));
    //         mapIdToAnnotation(a.id, a);
    //     });
    //
    // remove lines no longer in the visualization
    selection.exit()
        .remove();

    // if (isZoomableChart(chart)) {
    //     // if the chart is zoomable, register the ZoomBehavior for the lines
    //     registerZoomBehavior(chart, conf.zoom || new defaults.LinePlotZoomBehavior(conf.selector));
    // }
}
