import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {TextAnnotation} from "../../../annotations/text-annotation";
import {mapIdToAnnotation, mapIdToSelection} from "../../id-map/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import * as defaults from "./text-defaults";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import {ZoomBehavior} from "../../zoom/zoom-behavior";
import {GlyphConfig} from "../glyph-config";

// a module that provides an abstracted interface for drawing text in a chart

function getTextSize(text: string): number {
    // for some given text, figure out how big it will be when it is drawn in the browser
    let selection = d3.select('body')
      .append('svg');

    let width = selection
      .append('text')
        .attr('class', 'tmp-text')
        .text(text)
          .node()!
          .getComputedTextLength();

    selection.remove();
    return (width);
}

export interface TextConfig<A extends TextAnnotation, C extends Chart<any>> extends GlyphConfig {
    /**
     * The number of pixels to pad the text width.
     */
    textPad?: number;
    /**
     * A callback to define the semantic x coordinate of the text glyph.
     * @param a
     * @param c
     */
    x?: (a: A, c: C) => number;
    /**
     * A callback to define the y coordinate of the text glyph.
     * @param a
     * @param c
     */
    y?: (a: A, c: C) => number;
    /**
     * A callback to extract a list of text to display from the represented Annotation object. It is a list of text
     * because TextGlyphs can display varying length text depending on how much room is available in the
     * target Chart's SVG viewport.
     * @param a
     * @param c
     */
    text: (a: A, c: C) => string[];
    /**
     * A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by
     * experienced users only.
     */
    zoom?: ZoomBehavior<C, d3.Selection<SVGTextElement, A, HTMLElement, any>>;
}


/**
 * This renders a list of Annotation objects in a target chart as text glyphs. These are most likely to be used as
 * labels that will be affixed next to another glyph.
 * @param chart The target Chart.
 * @param ann The list of Annotation objects to be rendered.
 * @param conf The parameters for configuring the style of the lines.
 */
export function textGlyph<A extends TextAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: TextConfig<A, C>): void {
    // the function that takes TextAnnotation data and draws text in the dom

    // first figure out the size of all of the text
    // and figure out all of the drawing thresholds
    for (const a of ann) {
        a.text = conf.text(a, chart);
        for (const t of a.text) {
            let tSize = getTextSize(t);
            let tThresh = (a.getW() * chart.width) / (tSize + (conf.textPad || 0));
            a.drawThresholds.push(tThresh);
        }
    }

    // bind the data to text
    const selection = chart.svgSelection
      .selectAll<SVGTextElement, A>(`text.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    const enter = selection.enter()
        .append('text');
    const merge = enter.merge(selection);

    // set the constant parameters
    enter
        .attr('class', conf.selector)
        .attr('id', (a: A) => a.id)
        .style('text-anchor', 'end')
        .style('fill', 'black')
        .text((a: A) => {
            // figure out what detail level to initially draw the text at
            let viewWidth = chart.getSemanticViewRange().width;
            let i = 0;
            for (const thresh of a.drawThresholds) {
                if (viewWidth <= thresh) {
                    return (a.text[i]);
                }
                i++;
            }
            return "";
        });

    let x: (a: A, c: C) => number = conf.x || defaults.textXFn;
    let y: (a: A, c: C) => number = conf.y || defaults.textYFn;
    let textPad: number = conf.textPad || 0;

    // set the position parameters
    merge
        .attr('x', (a: A) => chart.getXScale()(x(a, chart)) - textPad)
        .attr('y', (a: A) => y(a, chart));

    // for all of the rectangles remaining, update the id->d3 selection map
    merge
        .each((a, i, nodes) => {
            mapIdToSelection(a.id, d3.select(nodes[i]));
            mapIdToAnnotation(a.id, a);
        });

    // remove text that is no longer in the chart
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the text
        registerZoomBehavior(chart, new defaults.TextZoomBehavior(conf.selector, textPad, x));
    }
}
