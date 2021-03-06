import * as d3 from 'd3';
import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation} from "../annotations/plot-annotation";
import {linePlot, LinePlotConfig} from "../modules/glyphs/plots";

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
            .ticks(5);

        this._axisSelection = this.svgSelection
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(0, ${this.verticalPad})`)
            .call(this.getAxis());
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
