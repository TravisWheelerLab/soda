import * as d3 from 'd3'
import {Annotation, AnnotationConfig} from "./annotation"

export interface PlotAnnotationConfig extends AnnotationConfig {
    values: number[],
}

export interface PointDatum {
    x: number,
    y: number,
    parent: PlotAnnotation,
}

export class PlotAnnotation extends Annotation {
    // points: [number, number, number, number][] = [];
    points: PointDatum[] = [];

    constructor(config: PlotAnnotationConfig) {
        super(config);
        let valCnt = config.values.length
        let xScale = d3.scaleLinear<number, number>()
            .domain([0, valCnt])
            .range([0, this.w])

        for (let i = 0; i < valCnt; i++) {
            // this.points.push([xScale(i), config.values[i], this.x, this.y])
            this.points.push({x: xScale(i), y: config.values[i], parent:this})
        }
    }
}
