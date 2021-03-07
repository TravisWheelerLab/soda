import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation} from "../annotations/plot-annotation";
import {barPlot, BarPlotConfig} from "../modules/glyphs/plots";
import {verticalAxis, VerticalAxisConfig} from "../modules/glyphs/plots/vertical-axis";

export interface BarChartConfig extends TrackChartConfig {

}

export interface BarChartRenderParams extends TrackChartRenderParams {
    data: PlotAnnotation,
}

export class BarChart extends TrackChart<BarChartRenderParams> {
    public inRender(params: BarChartRenderParams) {
        let conf: BarPlotConfig<PlotAnnotation, BarChart> = {
            selector: 'bar-plot',
        }
        barPlot(this, [params.data], conf);

        let axisConf: VerticalAxisConfig<PlotAnnotation, BarChart> = {
            selector: 'vertical-axis',
            fixed: true,
        }
        verticalAxis(this, [params.data], axisConf);
    }
}
