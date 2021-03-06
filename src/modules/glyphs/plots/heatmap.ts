import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {PlotAnnotation, PointDatum} from "../../../annotations/plot-annotation";
import {mapIdToAnnotation, mapIdToSelection} from "../../id-map/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import * as defaults from "./heatmap-defaults";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {getPlotGSelection} from "./plot-defaults";
import {GlyphConfig} from "../glyph-config";

/**
 * An interface that holds the parameters to style a bar plot.
 */
export interface HeatmapConfig<A extends PlotAnnotation, C extends Chart<any>> extends GlyphConfig {
    zoom?: ZoomBehavior<C, d3.Selection<SVGElement, A, HTMLElement, any>>;
}

/**
 * This renders PlotAnnotations as a heatmap.
 * @param chart The Chart in which we will render the plot.
 * @param ann The PlotAnnotations to be rendered.
 * @param conf The parameters for configuring the styling of the plot.
 */
export function heatmap<A extends PlotAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: HeatmapConfig<A, C>): void {
    let [_, outerMerge] = getPlotGSelection(chart, ann, conf);

    let colorScale = d3.scaleSequential(d3.interpolatePRGn)
        .domain([0, 100]);

    outerMerge
        // iterate over the G tags and render the charts inside
        .each((a, i, nodes) => {
            // for now, I think mapping the annotations to the G tags make sense
            mapIdToSelection(a.id, d3.select(nodes[i]));
            mapIdToAnnotation(a.id, a);

            const innerSelection = d3.select(nodes[i])
                .selectAll<SVGRectElement, PointDatum>(`rect.${conf.selector}`)
                .data(a.points);

            const innerEnter = innerSelection.enter()
                .append('rect')
                .attr('class', conf.selector)
                .attr('y', (a) => chart.binHeight * a.parent.y + chart.verticalPad)
                .attr('height', chart.binHeight)
                .attr('fill', (a) => colorScale(a.value))

            const innerMerge = innerEnter.merge(innerSelection);

            innerMerge
                .attr('x', (a) => chart.getXScale()(a.parent.x + a.x))
                .attr('width', (a) => chart.getXScale()(a.x + a.w) - chart.getXScale()(a.x))
        });


    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the plot
        registerZoomBehavior(chart, conf.zoom || new defaults.HeatmapZoomBehavior(conf.selector));
    }
}
