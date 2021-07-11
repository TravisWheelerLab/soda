import * as d3 from 'd3'
import {Chart, ChartRenderParams} from "../../../charts/chart";
import {PlotAnnotation, PointDatum} from "../../../annotations/plot-annotation";
import {ZoomBehavior} from "../../zoom/zoom-behavior";

/**
 * @hidden
 */
export const lineFn = <A extends PlotAnnotation, P extends ChartRenderParams>(ann: A, chart: Chart<P>) => {
    let yScale = d3.scaleLinear()
        .domain([ann.minValue, ann.maxValue])
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
    lineFunc: (a: A, c: C) => d3.Line<PointDatum>;

    constructor(selector: string, lineFunc: (a: A, c: C) => d3.Line<PointDatum>) {
        this.selector = `g.${selector}`;
        this.lineFunc = lineFunc;
    }

    public apply(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>) {
        selection
            .selectAll<SVGPathElement, PointDatum[]>(`path`)
            //@ts-ignore
            .attr('d', (d) => {
                let a: PlotAnnotation = d[0].parent;
                //@ts-ignore
                return this.lineFunc(a, chart);
            });
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGGElement, A, HTMLElement, any>, duration: number) {
        selection
            .transition()
            .duration(duration)
            .selectAll<SVGPathElement, PointDatum[]>(`path`)
            //@ts-ignore
            .attr('d', (d) => {
                let a: PlotAnnotation = d[0].parent;
                //@ts-ignore
                return this.lineFunc(a, chart);
            });
    }
}
