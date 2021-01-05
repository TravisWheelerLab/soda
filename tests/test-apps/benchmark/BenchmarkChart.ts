import * as d3 from 'd3'
import * as soda from "@traviswheelerlab/soda";

export enum BenchGlyph {
    Rect,
    Line,
    Text,
    ChevronRect,
    ChevronLine,
    Sequence
}

export interface BenchAnnotation extends soda.OrientedAnnotation, soda.TextAnnotation {}

export interface BenchmarkRenderParams extends soda.TrackChartRenderParams {
    ann: BenchAnnotation[];
    glyph: BenchGlyph;
}

export class BenchmarkChart extends soda.TrackChart<BenchmarkRenderParams> {
    colorScale = d3.scaleOrdinal(d3.schemeDark2);
    zoomTimes: number[] = [];
    protected callZoomTrigger(): void {
        let t = performance.now();
        let transform;
        if (d3.event == null) {
            transform = this.svgSelection.node().__zoom;
        } else {
            transform = d3.event.transform;
        }
        if (this.zoomController !== undefined) {
            this.zoomController.trigger(transform);
        } else {
            console.error("no zoom controller");
        }
        let t2 = performance.now();
        let elapsed = (t2-t);
        this.zoomTimes.push(elapsed);
        d3.select('h1')
            .text(this.getAvgZoomTime());
    }
    public preRender(params: BenchmarkRenderParams) {
        d3.select('div#done')
            .remove();
        this.svgSelection
            .selectAll('*')
            .remove();
        super.preRender(params);
        this.reset();
    }

    public inRender(params: BenchmarkRenderParams ) {
        if (params.glyph == BenchGlyph.Rect) {
            let rectConf: soda.RectangleConfig<soda.Annotation, BenchmarkChart> = {
                selector: 'ann',
                fillColor: (a, c) => c.colorScale(a.id)
            };
            soda.rectangleGlyph(this, params.ann, rectConf);
        }
        else if (this.getRenderParams().glyph == BenchGlyph.Line) {
            let lineConf: soda.HorizontalLineConfig<soda.Annotation, BenchmarkChart> = {
                selector: 'ann',
                strokeColor: (a, c) => c.colorScale(a.id)
            };
            soda.horizontalLine(this, params.ann, lineConf);
        }
        else if (this.getRenderParams().glyph == BenchGlyph.Text) {
            let textConf: soda.TextConfig<soda.TextAnnotation, BenchmarkChart> = {
                selector: 'ann',
                text: () => ['Some long text', 'Some long...', 'Some...', '...'],
            }
            soda.textGlyph(this, params.ann, textConf);
        }
        else if (this.getRenderParams().glyph == BenchGlyph.ChevronRect) {
            let rectConf: soda.ChevronRectangleConfig<soda.OrientedAnnotation, BenchmarkChart> = {
                selector: 'ann',
                fillColor: (a, c) => c.colorScale(a.id)
            };
            soda.chevronRectangleGlyph(this, params.ann, rectConf);
        }
        else if (this.getRenderParams().glyph == BenchGlyph.ChevronLine) {
            let rectConf: soda.ChevronLineConfig<soda.OrientedAnnotation, BenchmarkChart> = {
                selector: 'ann',
                strokeColor: (a, c) => c.colorScale(a.id)
            };
            soda.chevronLineGlyph(this, params.ann, rectConf);
        }
        else if (this.getRenderParams().glyph == BenchGlyph.Sequence) {
            //TODO: this
        }

        d3.select('body')
            .append('div')
            .attr('id', 'done')
    }

    public reset(): void {
        this.zoomTimes = [];
    }

    public getAvgZoomTime(): number {
        if (this.zoomTimes.length > 1) {
            return this.zoomTimes.slice(1).reduce((a, b) => a + b) / this.zoomTimes.length;
        }
        else {
            return 0;
        }
    }
}
