import * as d3 from 'd3';
import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation} from "../annotations/plot-annotation";
import {heatmap, HeatmapConfig} from "../modules/glyphs/plots/heatmap";


/**
 * A simple interface that holds the arguments for the HeatmapChart constructor.
 */
export interface HeatmapChartConfig extends TrackChartConfig {}


/**
 * A simple interface that holds the arguments for the HeatmapChart render() method.
 */
export interface HeatmapChartRenderParams extends TrackChartRenderParams {
    data: PlotAnnotation,
}

/**
 * This is a Chart class that renders a single PlotAnnotation as a heatmap.
 */
export class HeatmapChart extends TrackChart<HeatmapChartRenderParams> {
    colorScale: d3.ScaleSequential<string>;

    constructor(config: HeatmapChartConfig) {
        super(config);
        this.colorScale = d3.scaleSequential(d3.interpolatePRGn)
            .domain([0, 100]);
    }

    /**
     * This uses the heatmap plot glyph module to render the heatmap.
     * @param params
     */
    public inRender(params: HeatmapChartRenderParams) {
        const rectConf: HeatmapConfig<PlotAnnotation, HeatmapChart> = {
            selector: 'heatmap',
        };
        heatmap(this, [params.data], rectConf);
    }
}
