import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {PlotAnnotation, PointDatum} from "../../../annotations/plot-annotation";
import {mapIdToAnnotation, mapIdToSelection} from "../../id-map/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import * as defaults from "./line-plot-defaults";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {getPlotGSelection} from "./plot-defaults";
import {GlyphConfig} from "../glyph-config";

/**
 * An interface that holds the parameters to style a line plot.
 */
export interface LinePlotConfig<A extends PlotAnnotation, C extends Chart<any>> extends GlyphConfig {
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
     * A custom defined d3.Line function, which is what is used to determine the x and y coordinates of each point.
     */
    lineFunc?: d3.Line<PointDatum>
    /**
     * A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by
     * experienced users only.
     */
    zoom?: ZoomBehavior<C, d3.Selection<SVGElement, A, HTMLElement, any>>;
}

/**
 * This renders PlotAnnotations as a line plot.
 * @param chart The Chart in which we will render the plot.
 * @param ann The PlotAnnotations to be rendered.
 * @param conf The parameters for configuring the styling of the plot.
 */
export function linePlot<A extends PlotAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: LinePlotConfig<A, C>): void {
    const strokeWidth = conf.strokeWidth || (() => 1);
    const strokeOpacity = conf.strokeOpacity || (() => 1);
    const strokeColor = conf.strokeColor || (() => 'black');
    const strokeDashArray = conf.strokeDashArray || (() => "");
    let lineFunc = conf.lineFunc || defaults.lineFn(chart)

    let [outerEnter, outerMerge] = getPlotGSelection(chart, ann, conf);

    outerEnter
        .style('stroke-width', (a: A) => strokeWidth(a, chart))
        .style('stroke-opacity', (a: A) => strokeOpacity(a, chart))
        .style('stroke-dasharray', (a: A) => strokeDashArray(a, chart))
        .style('stroke', (a: A) => strokeColor(a, chart))
        .style('fill', 'none')

    outerMerge
        // iterate over the G tags and render the charts inside
        .each((a, i, nodes) => {
            // for now, I think mapping the annotations to the G tags make sense
            mapIdToSelection(a.id, d3.select(nodes[i]));
            mapIdToAnnotation(a.id, a);

            const innerSelection = d3.select(nodes[i])

            innerSelection
              .selectAll<SVGPathElement, PointDatum[]>(`path.${conf.selector}`)
                .remove();

            innerSelection
              .append('path')
                .datum(a.points)
                .attr('class', conf.selector)
                .attr('d', lineFunc);
        });

    if (isZoomableChart(chart)) {
        registerZoomBehavior(chart, conf.zoom || new defaults.LinePlotZoomBehavior(conf.selector, lineFunc));
    }
}
