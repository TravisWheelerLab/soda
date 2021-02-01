import * as d3 from 'd3'
import {Annotation, AnnotationConfig} from "./annotation"

/**
 * An interface for initializing a PlotAnnotation.
 */
export interface PlotAnnotationConfig extends AnnotationConfig {
    values: number[],
}

/**
 * A simple interface to define one point in a PlotAnnotation.
 */
export interface PointDatum {
    /**
     * The x coordinate of the point relative to the start of the PlotAnnotation.
     */
    x: number,
    /**
     * The y coordinate of the point.
     */
    y: number,
    /**
     * The PlotAnnotation that this PointDatum is a part of.
     */
    parent: PlotAnnotation,
}

/**
 * An Annotation object that can be used to represent data that should be visualized as a plot.
 */
export class PlotAnnotation extends Annotation {
    /**
     * The individual data points for the plot.
     */
    points: PointDatum[] = [];

    constructor(config: PlotAnnotationConfig) {
        super(config);
        let valCnt = config.values.length
        let xScale = d3.scaleLinear<number, number>()
            .domain([0, valCnt])
            .range([0, this.w])

        for (let i = 0; i < valCnt; i++) {
            this.points.push({x: xScale(i), y: config.values[i], parent:this})
        }
    }
}
