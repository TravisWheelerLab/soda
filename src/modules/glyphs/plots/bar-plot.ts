import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {PlotAnnotation, PointDatum} from "../../../annotations/plot-annotation";
import {mapIdToAnnotation, mapIdToSelection} from "../../id-map/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import * as defaults from "./bar-plot-defaults";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {getPlotGSelection} from "./plot-defaults";
import {GlyphConfig} from "../glyph-config";

/**
 * An interface that holds the parameters to style a bar plot.
 */
export interface BarPlotConfig<A extends PlotAnnotation, C extends Chart<any>> extends GlyphConfig {
    zoom?: ZoomBehavior<C, d3.Selection<SVGElement, A, HTMLElement, any>>;
}

/**
 * This renders PlotAnnotations as a bar plot.
 * @param chart The Chart in which we will render the plot.
 * @param ann The PlotAnnotations to be rendered.
 * @param conf The parameters for configuring the styling of the plot.
 */
export function barPlot<A extends PlotAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: BarPlotConfig<A, C>): void {
    let [_, outerMerge] = getPlotGSelection(chart, ann, conf);

    const barHeightFunc = defaults.barHeightFn(chart);

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
                .attr('y', (a) => chart.binHeight * (a.parent.y + 1) + chart.verticalPad - barHeightFunc(a.value))
                .attr('height', (a) => barHeightFunc(a.value))
                .attr('fill', 'green')

            const innerMerge = innerEnter.merge(innerSelection);

            innerMerge
                .attr('x', (a) => chart.getXScale()(a.parent.x + a.x))
                .attr('width', 5)

        });


    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the plot
        registerZoomBehavior(chart, conf.zoom || new defaults.BarPlotZoomBehavior(conf.selector));
    }
}
