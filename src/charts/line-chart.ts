import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation} from "../annotations/plot-annotation";
import {linePlot, LinePlotConfig} from "../modules/glyphs/line-plot/line-plot";

export interface LineChartConfig extends TrackChartConfig {

}

export interface LineChartRenderParams extends TrackChartRenderParams {
    data: PlotAnnotation[],
}

export class LineChart extends TrackChart<LineChartRenderParams> {

    constructor(config: LineChartConfig) {
        super(config);
    }

    public inRender(params: LineChartRenderParams) {
        let conf: LinePlotConfig<PlotAnnotation, LineChart> = {
            selector: 'line-plot',
        }
        linePlot(this, params.data, conf)
    }
}
