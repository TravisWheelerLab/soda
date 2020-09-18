import * as d3 from 'd3';
import { registerZoomBehavior } from "../primitives";
import {Annotation, TextAnnotation} from "../annotations";
import { ChartBase } from "../charts";
import { isZoomableChart, ZoomBehavior, ZoomController } from "../plugins/zoom";

// a module that provides an abstracted interface for drawing text in a chart

export interface TextConfig {
    // the class to apply to the svg when it's created
    class: string;
    // the number of pixels to pad the text with
    textPad: number;
    // a function to extract the x coordinate from an Annotation object
    xFromAnn(d: TextAnnotation): number;
    yFromAnn?(d: TextAnnotation): number;
    // a function to extract the text from an Annotation object
    textFromAnn(d: TextAnnotation): string[];
    // the user can optionally provide a custom ZoomBehavior for the line
    zoom?: ZoomBehavior<d3.Selection<SVGTextElement, TextAnnotation, HTMLElement, any>>;
}

export class DefaultTextZoomBehavior implements ZoomBehavior<d3.Selection<SVGTextElement, TextAnnotation, HTMLElement, any>> {
    // the default ZoomBehavior for text drawn with this module
    // it moves the text horizontally and changes the level of detail based on how
    // much room the text has to draw in
    selector: string;
    textPad: number;
    xFromAnn: (d: TextAnnotation) => number;

    constructor(selector: string, textPad: number, xFromAnn: (d: TextAnnotation) => number) {
        this.selector = `text.${selector}`;
        this.textPad = textPad;
        this.xFromAnn = xFromAnn;
    }

    public apply(controller: ZoomController, selection: d3.Selection<SVGTextElement, TextAnnotation, HTMLElement, any>): void {
        selection
            .attr('x', (d: TextAnnotation) => controller.getZoomedXScale()(this.xFromAnn(d)) - this.textPad)
            .text((d: TextAnnotation) => {
                // figure out the semantic view range of the zoom controller
                let viewWidth = controller.getSemanticViewRange().width;
                let i = 0;
                for (const thresh of d.drawThresholds) {
                    // find out which level of text detail to draw
                    if (viewWidth <= thresh) {
                        return (d.text[i]);
                    }
                    i++;
                }
                return "";
            });
    }
}

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

export function text(chart: ChartBase<any>, data: TextAnnotation[], conf: TextConfig): void {
    // the function that takes TextAnnotation data and draws text in the dom

    // first figure out the size of all of the text
    // and figure out all of the drawing thresholds
    for (const ann of data) {
        ann.text = conf.textFromAnn(ann);
        for (const t of ann.text) {
            let tSize = getTextSize(t);
            let tThresh = (ann.getW() * chart.width) / (tSize + conf.textPad);
            ann.drawThresholds.push(tThresh);
        }
    }

    // bind the data to text
    const selection = chart.svgSelection
      .selectAll<SVGTextElement, TextAnnotation>(`text.${conf.class}`)
        .data(data, (d: TextAnnotation) => d.id);

    const enter = selection.enter()
        .append('text');
    const merge = enter.merge(selection);

    // set the constant parameters
    enter
        .attr('class', conf.class)
        .style('text-anchor', 'end')
        .style('fill', 'black')
        .text((d: TextAnnotation) => {
            // figure out what detail level to initially draw the text at
            let viewWidth = chart.getSemanticViewRange().width;
            let i = 0;
            for (const thresh of d.drawThresholds) {
                if (viewWidth <= thresh) {
                    return (d.text[i]);
                }
                i++;
            }
            return "";
        });

    let yFromAnn: (d: TextAnnotation) => number;
    if (conf.yFromAnn == undefined) {
        yFromAnn = (d: TextAnnotation) => d.y * chart.binHeight + 5;
    }
    else {
        yFromAnn = conf.yFromAnn;
    }

    // set the position parameters
    merge
        .attr('x', (d: TextAnnotation) => chart.getXScale()(conf.xFromAnn(d)))
        .attr('y', (d: TextAnnotation) => yFromAnn(d));

    // remove text that is no longer in the chart
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the text
        registerZoomBehavior(chart, new DefaultTextZoomBehavior(conf.class, conf.textPad, conf.xFromAnn));
    }
}
