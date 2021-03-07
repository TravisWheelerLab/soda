import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation} from "../annotations/plot-annotation";
import {linePlot, LinePlotConfig} from "../modules/glyphs/plots";
import {verticalAxis, VerticalAxisConfig} from "../modules/glyphs/plots/vertical-axis";

/**
 * A simple interface that holds the arguments for the LineChart constructor.
 */
export interface LineChartConfig extends TrackChartConfig {}

/**
 * A simple interface that holds the arguments for the LineChart render() method.
 */
export interface LineChartRenderParams extends TrackChartRenderParams {
    data: PlotAnnotation,
}

/**
 * This is a Chart class that renders a single PlotAnnotation as a line plot.
 */
export class LineChart extends TrackChart<LineChartRenderParams> {

    /**
     * This uses the line plot glyph module to render the heatmap and the verticalAxis glyph module to draw a fixed
     * y axis.
     * @param params
     */
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
