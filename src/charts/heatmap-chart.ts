import * as d3 from 'd3';
import {TrackChart, TrackChartConfig, TrackChartRenderParams} from "./track-chart";
import {PlotAnnotation, PointDatum} from "../annotations/plot-annotation";
import {RectangleConfig, rectangleGlyph} from "../modules/glyphs/rectangle/rectangle-glyph";

export interface HeatmapChartConfig extends TrackChartConfig {

}

export interface HeatmapChartRenderParams extends TrackChartRenderParams {
    data: PlotAnnotation[],
}

export class HeatmapChart extends TrackChart<HeatmapChartRenderParams> {
    colorScale: d3.ScaleSequential<string>;

    constructor(config: HeatmapChartConfig) {
        super(config);
        this.colorScale = d3.scaleSequential(d3.interpolatePRGn)
            .domain([0, 100]);
    }

    public inRender(params: HeatmapChartRenderParams) {
        const rectConf: RectangleConfig<PointDatum, HeatmapChart> = {
            selector: 'heatmap-cell',
            strokeOpacity: () => 0,
            x: (p) => p.parent.x + p.centerX - 5,
            fillColor: (p) => this.colorScale(p.value),
        };
        rectangleGlyph(this, params.data[0].points, rectConf);
    }
}
