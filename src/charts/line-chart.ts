import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation} from "../annotations/plot-annotation";
import {linePlot, LinePlotConfig} from "../modules/glyphs/plots";
import {verticalAxis, VerticalAxisConfig} from "../modules/glyphs/plots/vertical-axis";

export interface LineChartConfig extends TrackChartConfig {

}

export interface LineChartRenderParams extends TrackChartRenderParams {
    data: PlotAnnotation,
}

export class LineChart extends TrackChart<LineChartRenderParams> {
    public inRender(params: LineChartRenderParams) {
        let conf: LinePlotConfig<PlotAnnotation, LineChart> = {
            selector: 'line-plot',
        }
        linePlot(this, [params.data], conf)

        let axisConf: VerticalAxisConfig<PlotAnnotation, LineChart> = {
            selector: 'vertical-axis',
            fixed: true,
        }
        verticalAxis(this, [params.data], axisConf);
    }
}
