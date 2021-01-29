import * as d3 from 'd3'
import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation} from "../annotations/plot-annotation";
import {ZoomBehavior} from "../modules/zoom/zoom-behavior";
import {registerZoomBehavior} from "../modules/zoom/zoom-utilities";

export interface LineChartConfig extends TrackChartConfig {

}

export interface LineChartRenderParams extends TrackChartRenderParams {
    data: PlotAnnotation[],
}

export class LineChart extends TrackChart<LineChartRenderParams> {
    yScale: d3.ScaleLinear<number, number>;
    lineFunc: d3.Line<any>;

    constructor(config: LineChartConfig) {
        super(config);

        this.yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, this.binHeight]);

        this.lineFunc = d3.line<[number, number, number, number]>()
            .x((d) => this.getXScale()(d[2] + d[0]))
            .y((d) => d[3] * this.binHeight + this.yScale(d[1]));
            // .y((d) => {
            //     let a = d[2] * this.binHeight;
            //     let b = this.yScale(d[1]);
            //     let c = a + b
            //     console.log(d[1], a, b, c)
            //     return(c)
            // }
            // )
    }

    public inRender(params: LineChartRenderParams) {
        this.svgSelection
            .selectAll('path')
            .data(params.data)
            .enter()
            .append('path')
            // .datum(params.data.points)
            .datum((d) => d.points)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', this.lineFunc);

        let zoomBehavior: ZoomBehavior<LineChart, d3.Selection<SVGPathElement, ([number, number, number])[], HTMLElement, any>> = {
            selector: 'path.line',
            apply(chart, selection) {
                selection
                    .attr('d', chart.lineFunc);
            },

            applyDuration(chart, selection, duration) {
                selection
                    .transition()
                    .duration(duration)
                    .attr('d', chart.lineFunc);
            }
        }
        registerZoomBehavior(this, zoomBehavior);
    }
}
