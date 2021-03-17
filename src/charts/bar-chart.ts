import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation} from "../annotations/plot-annotation";
import {barPlot, BarPlotConfig} from "../modules/glyphs/plots";
import {verticalAxis, VerticalAxisConfig} from "../modules/glyphs/plots/vertical-axis";

/**
 * A simple interface that holds the arguments for the BarChart constructor.
 */
export interface BarChartConfig extends TrackChartConfig {}

/**
 * A simple interface that holds the arguments for the BarChart render() method.
 */
export interface BarChartRenderParams extends TrackChartRenderParams {
    /**
     * The data that will be plotted.
     */
    data: PlotAnnotation,
}

/**
 * This is a Chart class that renders a single PlotAnnotation as a bar plot.
 */
export class BarChart extends TrackChart<BarChartRenderParams> {

    /**
     * This uses the bar plot glyph module to render the heatmap and the verticalAxis glyph module to draw a fixed
     * y axis.
     * @param params
     */
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
