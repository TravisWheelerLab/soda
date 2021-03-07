import * as d3 from 'd3';
import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation} from "../annotations/plot-annotation";
import {heatmap, HeatmapConfig} from "../modules/glyphs/plots/heatmap";

export interface HeatmapChartConfig extends TrackChartConfig {
}

export interface HeatmapChartRenderParams extends TrackChartRenderParams {
    data: PlotAnnotation,
}

export class HeatmapChart extends TrackChart<HeatmapChartRenderParams> {
    colorScale: d3.ScaleSequential<string>;

    constructor(config: HeatmapChartConfig) {
        super(config);
        this.colorScale = d3.scaleSequential(d3.interpolatePRGn)
            .domain([0, 100]);
    }

    public inRender(params: HeatmapChartRenderParams) {
        const rectConf: HeatmapConfig<PlotAnnotation, HeatmapChart> = {
            selector: 'heatmap',
        };
        heatmap(this, [params.data], rectConf);
    }
}
