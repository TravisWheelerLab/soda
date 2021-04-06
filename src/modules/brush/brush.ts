import {Annotation} from "../../annotations/annotation";
import {Chart} from "../../charts/chart";
import * as d3 from "d3";

/**
 * An interface to define the configuration for registering a brushXBehavior.
 */
export interface BrushXConfig<A extends Annotation, C extends Chart<any>>  {
    /**
     * The callback for the start of the brush event.
     */
    start?: { (args: BrushCallbackArgs<A, C>): void };
    /**
     * The callback that is repeatedly called throughout the brush event (as the brush is moved).
     */
    brush?: { (args: BrushCallbackArgs<A, C>): void };
    /**
     * The callback for the end of the brush event.
     */
    end?: { (args: BrushCallbackArgs<A, C>): void };
}

/**
 * @hidden
 * A convenience function to build brushXCallbackArgs for a Chart.
 * @param chart
 */
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

/**
 * @hidden
 * An interface that defines the arguments to a brush callback function.
 */
interface BrushCallbackArgs<A extends Annotation, C extends Chart<any>> {
    /**
     * The start of the range that was brushed.
     */
    start: number;
    /**
     * The end of the range that was brushed.
     */
    end: number;
    /**
     * A D3 Selection of the brushed glyphs.
     */
    selection: d3.Selection<any, any, any, any> | undefined;
    /**
     * The Annotations whose glyphs were in the selected range.
     */
    annotations: A | undefined;
    /**
     * The Chart that was brushed.
     */
    chart: C;
}

/**
 * Add a brushX behavior to a chart.
 * @param chart The Chart to add the behavior to.
 * @param config The configuration of the behavior.
 */
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
