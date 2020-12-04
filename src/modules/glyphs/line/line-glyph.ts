import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {Annotation} from "../../../annotations/annotation";
import {mapIdToAnnotation, mapIdToSelection} from "../../../plugins/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import * as defaults from "./line-defaults";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {GlyphConfig} from "../glyph-config";

/**
 * An interface that holds the common parameters for rendering line glyphs.
 */
interface CommonLineConfig<A extends Annotation, C extends Chart<any>> extends GlyphConfig<A, C> {
    /**
     * A callback to define the stroke color of the line glyph.
     * @param a
     * @param c
     */
    strokeColor?: (a: A, c: C) => string;
    /**
     * A callback to define the stroke width of the line glyph.
     * @param a
     * @param c
     */
    strokeWidth?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke opacity of the line glyph.
     * @param a
     * @param c
     */
    strokeOpacity?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke dash array of the line glyph. Supplying this will allow lines to be
     * dotted/dashed.
     * @param a
     * @param c
     */
    strokeDashArray?: (a: A, c: C) => string;
    /**
     * A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by
     * experienced users only.
     */
    zoom?: ZoomBehavior<C, d3.Selection<SVGElement, A, HTMLElement, any>>;
}

/**
 * An interface that holds the parameters for rendering generic line glyphs.
 */
export interface LineConfig<A extends Annotation, C extends Chart<any>> extends CommonLineConfig<A, C> {
    /**
     * A callback to define the semantic x1 coordinate of the line glyph.
     * @param a
     * @param c
     */
    x1: (a: A, c: C) => number;
    /**
     * A callback to define the semantic x2 coordinate of the line glyph.
     * @param a
     * @param c
     */
    x2: (a: A, c: C) => number;
    /**
     * A callback to define the y1 coordinate of the line glyph.
     * @param a
     * @param c
     */
    y1: (a: A, c: C) => number;
    /**
     * A callback to define the y2 coordinate of the line glyph.
     * @param a
     * @param c
     */
    y2: (a: A, c: C) => number;
}

/**
 * An interface that holds the parameters for rendering vertical line glyphs.
 */
export interface VerticalLineConfig<A extends Annotation, C extends Chart<any>> extends CommonLineConfig<A, C> {
    /**
     * A callback to define the semantic x coordinate of the vertical line glyph.
     * @param a
     * @param c
     */
    x?: (a: A, c: C) => number;
    /**
     * A callback to define the y1 coordinate of the vertical line glyph.
     * @param a
     * @param c
     */
    y1?: (a: A, c: C) => number;
    /**
     * A callback to define the y2 coordinate of the vertical line glyph.
     * @param a
     * @param c
     */
    y2?: (a: A, c: C) => number;
}

/**
 * An interface that holds the parameters for rendering horizontal line glyphs.
 */
export interface HorizontalLineConfig<A extends Annotation, C extends Chart<any>> extends CommonLineConfig<A, C> {
    /**
     * A callback to define the semantic x1 coordinate of the horizontal line glyph.
     * @param a
     * @param c
     */
    x1?: (a: A, c: C) => number;
    /**
     * A callback to define the semantic x2 coordinate of the horizontal line glyph.
     * @param a
     * @param c
     */
    x2?: (a: A, c: C) => number;
    /**
     * A callback to define the y coordinate of the horizontal line glyph.
     * @param a
     * @param c
     */
    y?: (a: A, c: C) => number;
}

/**
 * This renders a list of Annotation objects in a target chart as vertical lines.
 * @param chart The target Chart.
 * @param ann The list of Annotation objects to be rendered.
 * @param conf The parameters for configuring the style of the lines.
 */
export function verticalLine<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: VerticalLineConfig<A, C>): void {
    const lineConfig: LineConfig<A, C> = {
        selector: conf.selector,
        strokeColor: conf.strokeColor,
        strokeDashArray: conf.strokeDashArray,
        strokeOpacity: conf.strokeOpacity,
        strokeWidth: conf.strokeWidth,
        x1: conf.x || defaults.verticalLineXFn,
        x2: conf.x || defaults.verticalLineXFn,
        y1: conf.y1 || defaults.verticalLineY1Fn,
        y2: conf.y2 || defaults.verticalLineY2Fn,
        zoom: conf.zoom,
    };
    lineGlyph(chart, ann, lineConfig);
}

/**
 * This renders a list of Annotation objects in a target chart as horizontal lines.
 * @param chart The target Chart.
 * @param ann The list of Annotation objects to be rendered.
 * @param conf The parameters for configuring the style of the lines.
 */
export function horizontalLine<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: HorizontalLineConfig<A, C>): void {
    const lineConfig: LineConfig<A, C> = {
        selector: conf.selector,
        strokeColor: conf.strokeColor,
        strokeDashArray: conf.strokeDashArray,
        strokeOpacity: conf.strokeOpacity,
        strokeWidth: conf.strokeWidth,
        x1: conf.x1 || defaults.horizontalLineX1Fn,
        x2: conf.x2 || defaults.horizontalLineX2Fn,
        y1: conf.y || defaults.horizontalLineYFn,
        y2: conf.y || defaults.horizontalLineYFn,
        zoom: conf.zoom,
    };
    lineGlyph(chart, ann, lineConfig);
}

/**
 * This renders a list of Annotation objects in a target chart as lines.
 * @param chart The target Chart.
 * @param ann The list of Annotation objects to be rendered.
 * @param conf The parameters for configuring the style of the lines.
 */
export function lineGlyph<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: LineConfig<A, C>): void {
    // bind the provided data to new svg lines
    const selection = chart.svgSelection
      .selectAll<SVGLineElement, A>(`line.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    const enter = selection.enter()
        .append('line');

    const merge = enter.merge(selection);

    const strokeWidth = conf.strokeWidth || (() => 1);
    const strokeOpacity = conf.strokeOpacity || (() => 1);
    const strokeColor = conf.strokeColor || (() => 'black');
    const strokeDashArray = conf.strokeDashArray || (() => "");

    // set the constant style parameters
    enter
        .attr('class', conf.selector)
        .style('stroke-width', (a: A) => strokeWidth(a, chart))
        .style('stroke-opacity', (a: A) => strokeOpacity(a, chart))
        .style('stroke-dasharray', (a: A) => strokeDashArray(a, chart))
        .style('stroke', (a: A) => strokeColor(a, chart));

    // set the position parameters
    merge
        .attr('x1', (a: A) => chart.getXScale()(conf.x1(a, chart)))
        .attr('x2', (a: A) => chart.getXScale()(conf.x2(a, chart)))
        .attr('y1', (a: A) => conf.y1(a, chart))
        .attr('y2', (a: A) => conf.y2(a, chart));

    // for all of the lines remaining, update the id->d3 selection map
    merge
        .each((a, i, nodes) => {
            mapIdToSelection(a.id, d3.select(nodes[i]));
            mapIdToAnnotation(a.id, a);
        });

    // remove lines no longer in the visualization
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the lines
        registerZoomBehavior(chart, conf.zoom || new defaults.LineZoomBehavior(conf.selector, conf.x1, conf.x2));
    }
}
