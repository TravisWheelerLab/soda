import {PlotAnnotation, PointDatum} from "../../../annotations/plot-annotation";
import {Chart} from "../../../charts/chart";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import * as d3 from "d3";

/**
 * @hidden
 */
export class HeatmapZoomBehavior<A extends PlotAnnotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGGElement, A, HTMLElement, any>> {
    id: string = 'default-heatmap-zoom-behavior';
    selector: string;

    constructor(selector: string) {
        this.selector = `g.${selector}`;
    }

    public apply(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>) {
        selection
            .selectAll<SVGRectElement, PointDatum>('rect')
            .attr('x', (a) => chart.getXScale()(a.parent.x + a.x))
            .attr('width', (a) => chart.getXScale()(a.x + a.w) - chart.getXScale()(a.x));
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>, duration: number) {
        selection
            .selectAll<SVGRectElement, PointDatum>('rect')
            .transition()
            .duration(duration)
            .attr('x', (a) => chart.getXScale()(a.parent.x + a.x))
            .attr('width', (a) => chart.getXScale()(a.x + a.w) - chart.getXScale()(a.x));
    }
}
