import * as d3 from 'd3'
import {Annotation, AnnotationConfig} from "./annotation"

/**
 * An interface for initializing a PlotAnnotation.
 */
export interface PlotAnnotationConfig extends AnnotationConfig {
    points: number[],
}

export interface PointDatumConfig extends AnnotationConfig {
    value: number;
    parent: PlotAnnotation;
}

/**
 * A simple class to define one point in a PlotAnnotation.
 */
export class PointDatum extends Annotation {
    /**
     * The center of the datum.
     */
    centerX: number;
    /**
     * The y coordinate of the point.
     */
    value: number;
    /**
     * The PlotAnnotation that this PointDatum is a part of.
     */
    parent: PlotAnnotation;

    constructor(config: PointDatumConfig) {
        super(config);
        this.value = config.value;
        this.parent = config.parent;
        this.centerX = this.x + this.w/2;
    }
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
        this.points =  distributePointData(config.points, this);
    }
}

function isFlat(arr: number[] | [number, number][]): arr is number[] {
    return (typeof(arr[0]) === 'number')
}

function distributePointData(values: number[], parent: PlotAnnotation): PointDatum[] {
    let valCnt = values.length;
    const xScale = d3.scaleLinear<number, number>()
        .domain([0, valCnt])
        .range([0, parent.w])

    let points: PointDatum[] = [];
    const datumW = parent.w / valCnt;
    for (let i = 0; i < valCnt; i++) {
        let conf: PointDatumConfig = {
            y: 0,
            id: ``,
            x: xScale(i),
            w: datumW,
            value: values[i],
            parent: parent
        }
        points.push(new PointDatum(conf));
    }
    return (points);
}
