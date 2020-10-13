import * as soda from "@traviswheelerlab/soda";
import * as d3 from "d3";

export interface ExampleChartRenderParams extends soda.TrackChartRenderParams {
    ann: soda.Annotation[];
}

export interface ExampleChartConfig extends soda.TrackChartConfig {
    // extra chart configuration would go here
}

export class ExampleChart extends soda.TrackChart<ExampleChartRenderParams> {
    constructor(config: ExampleChartConfig) {
        super(config);
    }

    inRender(params: ExampleChartRenderParams): void {
        // an extended chart need only override the inRender() function
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain([]);

        const rectConf = {
            class: 'ann', fillColor: (d: soda.Annotation) => colorScale(d.id)
        };
        soda.rectangle(this, params.ann, rectConf);
    }
}
