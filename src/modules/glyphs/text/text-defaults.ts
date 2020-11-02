import * as d3 from "d3";
import {TextAnnotation} from "../../../annotations/text-annotation";
import {Chart} from "../../../charts/chart";
import {ZoomBehavior} from "../../zoom/zoom-behavior";

export const textXFn = <A extends TextAnnotation, C extends Chart<any>>(a: A) => a.getX();
export const textYFn = <A extends TextAnnotation, C extends Chart<any>>(a: A, c: C) => a.y * c.binHeight;

export class TextZoomBehavior<A extends TextAnnotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGTextElement, A, HTMLElement, any>> {
    // the default ZoomBehavior for text drawn with this module
    // it moves the text horizontally and changes the level of detail based on how
    // much room the text has to draw in
    selector: string;
    textPad: number;
    x: (d: A, c: C) => number;

    constructor(selector: string, textPad: number, x: (d: A, c: C) => number) {
        this.selector = `text.${selector}`;
        this.textPad = textPad;
        this.x = x;
    }

    public apply(chart: C, selection: d3.Selection<SVGTextElement, A, HTMLElement, any>): void {
        selection
            .attr('x', (a) => chart.getXScale()(this.x(a, chart)) - this.textPad)
            .text((a) => {
                // figure out the semantic view range of the zoom controller
                let viewWidth = chart.getSemanticViewRange().width;
                let i = 0;
                for (const thresh of a.drawThresholds) {
                    // find out which level of text detail to draw
                    if (viewWidth <= thresh) {
                        return (a.text[i]);
                    }
                    i++;
                }
                return "";
            });
    }
}
