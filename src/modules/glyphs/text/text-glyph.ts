import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {TextAnnotation} from "../../../annotations/text-annotation";
import {mapIdToSelection} from "../../../plugins/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import * as defaults from "./text-defaults";
import {TextConfig} from "./text-config";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";

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

    // set the position parameters
    merge
        .attr('x', (a: A) => chart.getXScale()(x(a, chart)))
        .attr('y', (a: A) => y(a, chart));

    // for all of the rectangles remaining, update the id->d3 selection map
    merge
        .each((a, i, nodes) => {
            mapIdToSelection(a.id, d3.select(nodes[i]));
        });

    // remove text that is no longer in the chart
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the text
        registerZoomBehavior(chart, new defaults.TextZoomBehavior(conf.selector, conf.textPad || 0, x));
    }
}
