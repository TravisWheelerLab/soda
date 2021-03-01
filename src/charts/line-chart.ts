import * as d3 from 'd3';
import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation} from "../annotations/plot-annotation";
import {linePlot, LinePlotConfig} from "../modules/glyphs/line-plot/line-plot";
import {barPlot} from "../modules/glyphs/bar-plot/bar-plot";

export interface LineChartConfig extends TrackChartConfig {

}

export interface LineChartRenderParams extends TrackChartRenderParams {
    data: PlotAnnotation[],
}

export class LineChart extends TrackChart<LineChartRenderParams> {
    yScale: d3.ScaleLinear<number, number>;
    _axis: d3.Axis<number | { valueOf(): number }> | undefined;
    _axisSelection: d3.Selection<any, any, any, any> | undefined;

    constructor(config: LineChartConfig) {
        super(config);
        this.yScale = d3.scaleLinear()
            .domain([100, 0])
            .range([0, this.binHeight])

        this._axis = d3.axisRight(this.yScale)
        this._axisSelection = this.svgSelection
            .attr('class', 'y-axis')
            .call(this.getAxis());
        
        this._axisSelection
            .selectAll('text')
            // .attr('x', 20)
            // .style('text-anchor', 'start');
    }

    public getAxis(): d3.Axis<number | {valueOf(): number}> {
        if (this._axis == null) {
            throw ("_axis is null or undefined");
        }
        return (this._axis);
    }

    public inRender(params: LineChartRenderParams) {
        let conf: LinePlotConfig<PlotAnnotation, LineChart> = {
            selector: 'line-plot',
        }
        linePlot(this, [params.data[0]], conf)
    }
}
