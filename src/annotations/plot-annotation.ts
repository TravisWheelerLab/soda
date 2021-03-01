import * as d3 from 'd3'
import {Annotation, AnnotationConfig} from "./annotation"

/**
 * An interface for initializing a PlotAnnotation.
 */
export interface PlotAnnotationConfig extends AnnotationConfig {
    points: number[],
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
     * The center of the datum.
     */
    centerX: number,
    /**
     * The width of the point.
     */
    w: number,
    /**
     * The y coordinate of the point.
     */
    value: number,
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
        this.points = interpolatePointData(config.points, this);
    }
}

function isFlat(arr: number[] | [number, number][]): arr is number[] {
    return (typeof(arr[0]) === 'number')
}

function interpolatePointData(values: number[], parent: PlotAnnotation): PointDatum[] {
    let valCnt = values.length;
    const xScale = d3.scaleLinear<number, number>()
        .domain([0, valCnt])
        .range([0, parent.w])

    let points: PointDatum[] = [];
    const datumW = parent.w / valCnt;
    for (let i = 0; i < valCnt; i++) {
        points.push({x: xScale(i),
            w: datumW,
            centerX: xScale(i) + datumW/2,
            value: values[i],
            parent: parent})
    }
    return (points);
}

// let span = config.span || 1;
// for (let i = 0; i < valCnt; i++) {
//     let datumX = config.values[i][0];
//     this.points.push({x: datumX,
//         w: span,
//         centerX: datumX + span/2,
//         value: config.values[i][1],
//         parent: this})
// }
