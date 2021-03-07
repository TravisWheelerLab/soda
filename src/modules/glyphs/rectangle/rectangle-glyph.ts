import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {Annotation} from "../../../annotations/annotation";
import {mapIdToAnnotation, mapIdToSelection} from "../../id-map/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import * as defaults from "./rectangle-defaults";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {GlyphConfig} from "../glyph-config";

/**
 * An interface that holds the parameters for rendering rectangle glyphs.
 */
export interface RectangleConfig<A extends Annotation, C extends Chart<any>> extends GlyphConfig {
    /**
     * A callback to define the y coordinate of the rectangle glyph.
     * @param a
     * @param c
     */
    y?: (a: A, c: C) => number;
    /**
     * A callback to define the semantic x coordinate of the rectangle glyph.
     * @param a
     * @param c
     */
    x?: (a: A, c: C) => number;
    /**
     * A callback to define the width of the rectangle glyph.
     * @param a
     * @param c
     */
    w?: (a: A, c: C) => number;
    /**
     * A callback to define the height of the rectangle glyph.
     * @param a
     * @param c
     */
    h?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke width of the border around the rectangle glyph.
     * @param a
     * @param c
     */
    strokeWidth?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke width of the border around the rectangle glyph.
     * @param a
     * @param c
     */
    strokeOpacity?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke color of the border around the rectangle glyph.
     * @param a
     * @param c
     */
    strokeColor?: (a: A, c: C) => string;
    /**
     * A callback to define the fill opacity of the rectangle glyph.
     * @param a
     * @param c
     */
    fillOpacity?: (a: A, c: C) => number;
    /**
     * A callback to define the fill color of the rectangle glyph.
     * @param a
     * @param c
     */
    fillColor?: (a: A, c: C) => string;
    /**
     * A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by
     * experienced users only.
     */
    zoom?: ZoomBehavior<C, d3.Selection<SVGElement, A, HTMLElement, any>>;
}

/**
 * This renders a list of Annotation objects in a target chart as rectangles.
 * @param chart The target Chart.
 * @param ann The list of Annotation objects to be rendered.
 * @param conf The parameters for configuring the style of the lines.
 */
export function rectangleGlyph<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: RectangleConfig<A, C>): d3.Selection<SVGRectElement, A, HTMLElement, any> {
    // the function that takes Annotation data and draws rectangles in the DOM

    // bind the data to rectangles
    const selection = chart.svgSelection
        .selectAll<SVGRectElement, A>(`rect.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    const enter = selection.enter()
        .append('rect');

    const merge = enter.merge(selection);

    const strokeWidth = conf.strokeWidth || (() => 1);
    const strokeOpacity = conf.strokeOpacity || (() => 1);
    const strokeColor = conf.strokeColor || (() => 'black');
    const fillOpacity = conf.fillOpacity || (() => 1);
    const fillColor = conf.fillColor || (() => 'black');

    // set the constant style parameters
    enter
        .attr('class', conf.selector)
        .style('stroke-width', (a: A) => strokeWidth(a, chart))
        .style('stroke-opacity', (a: A) => strokeOpacity(a, chart))
        .style('stroke', (a: A) => strokeColor(a, chart))
        .style('fill-opacity', (a: A) => fillOpacity(a, chart))
        .style('fill', (a: A) => fillColor(a, chart));

    const x: (a: A, c: C) => number = conf.x || defaults.rectXFn;
    const y: (a: A, c: C) => number = conf.y || defaults.rectYFn;
    const w: (a: A, c: C) => number = conf.w || defaults.rectWFn;
    const h: (a: A, c: C) => number = conf.h || defaults.rectHFn;

    // set the position parameters
    merge
        .attr('x', (a: A) => chart.getXScale()(x(a, chart)))
        .attr('y', (a: A) => y(a, chart))
        .attr('width', (a: A) => chart.getXScale()(x(a, chart) + w(a, chart)) - chart.getXScale()(x(a, chart)))
        .attr('height', (a: A) => h(a, chart));

    // for all of the rectangles remaining, update the id->d3 selection map
    merge
        .each((a, i, nodes) => {
            mapIdToSelection(a.id, d3.select(nodes[i]));
            mapIdToAnnotation(a.id, a);
        });

    // remove rectangles that are no longer in the chart
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the rectangles
        registerZoomBehavior(chart, conf.zoom || new defaults.RectZoomBehavior(conf.selector, x, w));
    }

    return merge;
}
