import {Annotation} from "../../annotations/annotation";
import {Chart} from "../../charts/chart";
import * as d3 from "d3";

export interface BrushCallbackArgs<A extends Annotation, C extends Chart<any>> {
    start: number;
    end: number;
    selection: d3.Selection<any, any, any, any> | undefined;
    annotations: A | undefined;
    chart: C;
}

export interface BrushXConfig<A extends Annotation, C extends Chart<any>>  {
    start?: { (args: BrushCallbackArgs<A, C>): void };
    brush?: { (args: BrushCallbackArgs<A, C>): void };
    end?: { (args: BrushCallbackArgs<A, C>): void };
}

function getBrushCallbackArgs<A extends Annotation, C extends Chart<any>>(chart: C): BrushCallbackArgs<A, C> {
    let args : BrushCallbackArgs<A, C> = {
        start: d3.event.selection[0][0],
        end: d3.event.selection[1][0],
        selection: undefined,
        annotations: undefined,
        chart: chart,
    }
    return args
}

function getBrushXCallbackArgs<A extends Annotation, C extends Chart<any>>(chart: C): BrushCallbackArgs<A, C> {
    let args : BrushCallbackArgs<A, C> = {
        start: d3.event.selection[0],
        end: d3.event.selection[1],
        selection: undefined,
        annotations: undefined,
        chart: chart,
    }
    return args
}

export function brushXBehavior<A extends Annotation, C extends Chart<any>>(chart: C, config: BrushXConfig<A, C>) {
    let start = config.start || (() => {});
    let brush = config.brush || (() => {});
    let end = config.end || (() => {});

    chart.svgSelection
        .call(d3.brushX()
            .on('start', () => {
                start(getBrushXCallbackArgs(chart));
            })
            .on('brush', () => {
                brush(getBrushXCallbackArgs(chart));
            })
            .on('end', () => {
                end(getBrushXCallbackArgs(chart));
            })
        );
}

// function getBrushed<A extends Annotation, C extends Chart<any>>(chart: C, extent: [[number, number], [number, number]]): A[] {
//     let sel = chart.svgSelection.selectAll()
//     return []
// }
