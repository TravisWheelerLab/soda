import * as d3 from 'd3'
import {Chart, ChartRenderParams} from "../../../charts/chart";
import {PlotAnnotation, PointDatum} from "../../../annotations/plot-annotation";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {Annotation} from "../../../annotations/annotation";

// export const yScale =
//     this.yScale = d3.scaleLinear()
//         .domain([0, 100])
//         .range([0, this.binHeight]);
// export const lineFunc = d3.line<[number, number, number, number]>()
//                             .x((d) => this.getXScale()(d[2] + d[0]))
//                             .y((d) => d[3] * this.binHeight + this.yScale(d[1]));


export const lineFunc = <P extends ChartRenderParams>(chart: Chart<P>, domain: [number, number] = [0, 100]) => {
   let yScale = d3.scaleLinear()
       .domain(domain)
       .range([0, chart.binHeight]);

   let func = d3.line<PointDatum>()
      .x((d) => chart.getXScale()(d.parent.x + d.x))
      .y((d) => d.parent.y * chart.binHeight + yScale(d.y));

   return func;
}

// export class LinePlotZoomBehavior<A extends PlotAnnotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGPathElement, A, HTMLElement, any>> {
//    selector: string;
//    lineFunc: d3.Line<PointDatum>;
//
//    constructor(selector: string, lineFunc: d3.Line<PointDatum>) {
//       this.selector = selector;
//       this.lineFunc = lineFunc;
//    }
//
//    public apply(chart: C, selection: d3.Selection<SVGPathElement, A, HTMLElement, any>) {
//       selection
//           .attr('d', this.lineFunc);
//    }
//
//    public applyDuration(chart: C, selection: d3.Selection<SVGPathElement, A, HTMLElement, any>, duration: number) {
//       selection
//           .transition()
//           .duration(duration)
//           .attr('d', chart.lineFunc);
//    }
// }
