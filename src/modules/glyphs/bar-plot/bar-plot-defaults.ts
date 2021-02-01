import {PlotAnnotation, PointDatum} from "../../../annotations/plot-annotation";
import {Chart, ChartRenderParams} from "../../../charts/chart";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import * as d3 from "d3";

export const barHeightFunc = <P extends ChartRenderParams>(chart: Chart<P>, domain: [number, number] = [0, 100]) => {
    let yScale = d3.scaleLinear()
        .domain(domain)
        .range([0, chart.binHeight]);

    let func = (y: number) => yScale(y);
    return func;
}

export class BarPlotZoomBehavior<A extends PlotAnnotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGPathElement, A, HTMLElement, any>> {
    selector: string;

    constructor(selector: string) {
        this.selector = `g.${selector}`;
    }

    public apply(chart: C, selection: d3.Selection<SVGPathElement, A, HTMLElement, any>) {
        selection
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGPathElement, A, HTMLElement, any>, duration: number) {
        selection
            .transition()
            .duration(duration)
    }
}
