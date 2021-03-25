import {CharacterDatum, SequenceAnnotation} from "../../../annotations/sequence-annotation";
import {Chart} from "../../../charts/chart";
import * as defaults from "./sequence-defaults";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import {GlyphConfig} from "../glyph-config";

/**
 * An interface that holds the parameters for rendering sequence glyphs.
 */
export interface SequenceConfig<A extends SequenceAnnotation, C extends Chart<any>> extends GlyphConfig {
    /**
     * A callback to define the semantic x coordinate of the sequence glyph.
     * @param a
     * @param c
     */
    x: (a: A, c: C) => number;
    /**
     * A callback to define the semantic width coordinate of the sequence glyph.
     * @param a
     * @param c
     */
    w: (a: A, c: C) => number;
    /**
     * A callback to define the y coordinate of the sequence glyph.
     * @param a
     * @param c
     */
    y: (a: A, c: C) => number;
}

/**
 * An experimental function that renders a list of Annotation objects in a target chart as sequence glyphs. In a
 * sequence glyph, each integer semantic coordinate that the Annotation covers is rendered as a character. This
 * works, but it is very hard on performance.
 * @param chart
 * @param ann
 * @param conf
 */
export function sequenceGlyph<A extends SequenceAnnotation, D extends CharacterDatum, C extends Chart<any>>(chart: C, ann: A[], conf: SequenceConfig<A, C>) {
    let x: (a: A, c: C) => number = conf.x || defaults.sequenceXFn;
    // let w: (a: A, c: C) => number = conf.w;
    let y: (a: A, c: C) => number = conf.y || defaults.sequenceYFn ;

    const selection = chart.svgSelection
        .selectAll<SVGGElement, A>(`g.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    const enter = selection.enter()
        .append('g');

    const merge = enter.merge(selection);

    enter
        .attr('class', conf.selector)
        .attr('id', (a: A) => a.id)
        .selectAll(`text.${conf.selector}`)
            .data((a) => a.characters)
            .enter()
                .append('text')
                .attr('class', conf.selector)
                .text((c) => c.char)
                .attr('y', 0)
                .style('text-anchor', 'middle');

    console.log(merge);
    merge
        .attr('transform', (a) => `translate(0, ${y(a, chart)})`)
        .selectAll<SVGTextElement, CharacterDatum>(`text.${conf.selector}`)
            .attr('x', (d) => chart.getXScale()(d.x))

    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the text
        // registerZoomBehavior(chart, new defaults.SequenceZoomBehavior(conf.selector, x, y));
        registerZoomBehavior(chart, new defaults.SequenceCharacterZoomBehavior(conf.selector));
    }
}
