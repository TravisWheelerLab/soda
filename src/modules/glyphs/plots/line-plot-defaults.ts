import * as d3 from 'd3'
import {Chart, ChartRenderParams} from "../../../charts/chart";
import {PlotAnnotation, PointDatum} from "../../../annotations/plot-annotation";
import {ZoomBehavior} from "../../zoom/zoom-behavior";

/**
 * @hidden
 */
export const lineFn = <P extends ChartRenderParams>(chart: Chart<P>, domain: [number, number] = [0, 100]) => {
    let yScale = d3.scaleLinear()
        .domain(domain)
        .range([chart.binHeight, 0]);

    let fn = d3.line<PointDatum>()
        .x((d) => chart.getXScale()(d.parent.x + d.x))
        .y((d) => (d.parent.y * chart.binHeight) + chart.verticalPad + yScale(d.value));

    return fn;
}

/**
 * @hidden
 */
export class LinePlotZoomBehavior<A extends PlotAnnotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGGElement, A, HTMLElement, any>> {
    id: string = 'default-line-plot-zoom-behavior';
    selector: string;
    lineFunc: d3.Line<PointDatum>;

    constructor(selector: string, lineFunc: d3.Line<PointDatum>) {
        this.selector = `g.${selector}`;
        this.lineFunc = lineFunc;
    }

    public apply(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>) {
        selection
            .selectAll<SVGPathElement, PointDatum[]>(`path`)
            .attr('d', this.lineFunc);
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>, duration: number) {
        selection
            .transition()
            .duration(duration)
            .selectAll<SVGPathElement, PointDatum[]>(`path.${this.selector}`)
            .attr('d', this.lineFunc);
    }
}
