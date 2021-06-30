import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {Annotation} from "../../../annotations/annotation";
import {mapIdToAnnotation, mapIdToSelection} from "../../id-map/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import * as defaults from "./arc-defaults";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {GlyphConfig} from "../glyph-config";

/**
 * An interface that holds the parameters for rendering arc glyphs.
 */
export interface ArcConfig<A extends Annotation, C extends Chart<any>> extends GlyphConfig {
    /**
     * A callback to define the y coordinate of the arc glyph.
     * @param a
     * @param c
     */
    y?: (a: A, c: C) => number;
    /**
     * A callback to define the semantic x coordinate of the arc glyph.
     * @param a
     * @param c
     */
    x?: (a: A, c: C) => number;
    /**
     * A callback to define the width of the arc glyph.
     * @param a
     * @param c
     */
    w?: (a: A, c: C) => number;
    /**
     * A callback to define the height of the arc glyph.
     * @param a
     * @param c
     */
    h?: (a: A, c: C) => number;
    /**
     * A callback to define the radius of the conceptual circle on which the arc glyph lies.
     * @param a
     * @param c
     */
    radius?: (a: A, c: C) => number;
    /**
     * A callback to define the translate parameters to place the conceptual circle in the correct spot.
     * @param a
     * @param c
     */
    translate?: (a: A, c: C) => string;
    /**
     * A callback to define the start angle in radians of the arc on the conceptual circle.
     * @param a
     * @param c
     */
    startAngle?: (a: A, c: C) => number;
    /**
     * A callback to define the end angle in radians of the arc on the conceptual circle.
     * @param a
     * @param c
     */
    endAngle?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke width of the border around the arc glyph.
     * @param a
     * @param c
     */
    strokeWidth?: (a: A, c: C) => number;
    /**
     * A callback to define the opacity of the border around the arc glyph.
     * @param a
     * @param c
     */
    strokeOpacity?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke color of the border around the arc glyph.
     * @param a
     * @param c
     */
    strokeColor?: (a: A, c: C) => string;
    /**
     * A callback to define the fill opacity of the arc glyph.
     * @param a
     * @param c
     */
    fillOpacity?: (a: A, c: C) => number;
    /**
     * A callback to define the fill color of the arc glyph.
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
 * This renders a list of Annotation objects in a target chart as arcs.
 * @param chart The target Chart.
 * @param ann The list of Annotation objects to be rendered.
 * @param conf The parameters for configuring the style of the lines.
 */
export function arcGlyph<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: ArcConfig<A, C>): d3.Selection<SVGPathElement, A, HTMLElement, any> {
    const selection = chart.svgSelection
        .selectAll<SVGPathElement, A>(`path.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    const enter = selection.enter()
        .append('path');

    const merge = enter.merge(selection);

    const strokeWidth = conf.strokeWidth || (() => 1);
    const strokeOpacity = conf.strokeOpacity || (() => 1);
    const strokeColor = conf.strokeColor || (() => 'black');
    const fillOpacity = conf.fillOpacity || (() => 1);
    const fillColor = conf.fillColor || (() => 'black');

    enter
        .attr('class', conf.selector)
        .attr('id', (a: A) => a.id)
        .style('stroke-width', (a: A) => strokeWidth(a, chart))
        .style('stroke-opacity', (a: A) => strokeOpacity(a, chart))
        .style('stroke', (a: A) => strokeColor(a, chart))
        .style('fill-opacity', (a: A) => fillOpacity(a, chart))
        .style('fill', (a: A) => fillColor(a, chart));

    const x: (a: A, c: C) => number = conf.x || defaults.arcXFn;
    const w: (a: A, c: C) => number = conf.w || defaults.arcWFn;
    const h: (a: A, c: C) => number = conf.h || defaults.arcHFn;
    const y: (a: A, c: C) => number = conf.y || defaults.arcYFn;

    const radius: (a: A, c: C) => number = conf.radius || defaults.buildArcRadiusFn(x, w, h);
    const translate: (a: A, c: C) => string = conf.translate || defaults.buildArcTranslateFn(x, w, h, y, radius);
    const startAngle: (a: A, c: C) => number = conf.startAngle || defaults.buildArcStartAngleFn(x, w, radius);
    const endAngle: (a: A, c: C) => number = conf.endAngle || defaults.buildArcEndAngleFn(x, w, radius);

    merge
        .attr("transform", (a) => translate(a, chart))
        .attr("d", d3.arc<any, A>()
            .innerRadius((a) => radius(a, chart) - 1)
            .outerRadius((a) => radius(a, chart))
            .startAngle((a) => startAngle(a, chart))
            .endAngle((a) => endAngle(a, chart))
        )

    merge
        .each((a, i, nodes) => {
            mapIdToSelection(a.id, d3.select(nodes[i]));
            mapIdToAnnotation(a.id, a);
        });

    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the arcs
        registerZoomBehavior(chart, conf.zoom || new defaults.ArcZoomBehavior(conf.selector, radius, translate, startAngle, endAngle));
    }

    return merge;
}
