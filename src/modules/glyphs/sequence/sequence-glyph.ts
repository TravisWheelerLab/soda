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
     * A callback to define the x coordinate of each character in the sequence glyph.
     * @param d
     * @param c
     */
    characterX?: (d: CharacterDatum, c: C) => number;
    /**
     * A callback to define the y coordinate of the sequence glyph.
     * @param a
     * @param c
     */
    y?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke opacity of the text.
     * @param a
     * @param c
     */
    strokeOpacity?: (d: CharacterDatum, c: C) => number;
    /**
     * A callback to define the stroke color of the text.
     * @param a
     * @param c
     */
    strokeColor?: (d: CharacterDatum, c: C) => string;
    /**
     * A callback to define the opacity of the background behind the text.
     * @param a
     * @param c
     */
    backgroundOpacity?: (d: CharacterDatum, c: C) => string;
    /**
     * A callback to define the color of the background behind the text.
     * @param a
     * @param c
     */
    backgroundColor?: (d: CharacterDatum, c: C) => string;
}

/**
 * An experimental function that renders a list of Annotation objects in a target chart as sequence glyphs. In a
 * sequence glyph, each integer semantic coordinate that the Annotation covers is rendered as a character. This
 * works, but it is very hard on performance.
 * @param chart
 * @param ann
 * @param conf
 */
export function sequenceGlyph<A extends SequenceAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: SequenceConfig<A, C>) {
    const characterX: (d: CharacterDatum, c: C) => number = conf.characterX || defaults.characterXFn;
    const y: (a: A, c: C) => number = conf.y || defaults.sequenceYFn;
    const strokeOpacity = conf.strokeOpacity || (() => 1);
    const strokeColor = conf.strokeColor || (() => 'black');

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

    merge
        .attr('transform', (a) => `translate(0, ${y(a, chart)})`)
        .selectAll<SVGTextElement, CharacterDatum>(`text.${conf.selector}`)
            .attr('x', (d) => chart.getXScale()(characterX(d, chart)))
            .style('stroke-opacity', (d) => strokeOpacity(d, chart))
            .style('stroke', (d) => strokeColor(d, chart))

    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the text
        // registerZoomBehavior(chart, new defaults.SequenceZoomBehavior(conf.selector, x, y));
        registerZoomBehavior(chart, new defaults.SequenceCharacterZoomBehavior(conf.selector));
    }
}
