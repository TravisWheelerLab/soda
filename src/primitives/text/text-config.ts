import * as d3 from "d3";
import {TextAnnotation} from "../../annotations/text-annotation";
import {ZoomBehavior} from "../../plugins/zoom/zoom-behavior";
import {Chart} from "../../charts/chart";

export interface TextConfig<A extends TextAnnotation, C extends Chart<any>> {
    // the class to apply to the svg when it's created
    selector: string;
    // the number of pixels to pad the text with
    textPad?: number;
    x?: (a: A, c: C) => number;
    y?: (a: A, c: C) => number;
    // a function to extract the text from an Annotation object
    text: (a: A, c: C) => string[];
    // the user can optionally provide a custom ZoomBehavior for the line
    zoom?: ZoomBehavior<C, d3.Selection<SVGTextElement, A, HTMLElement, any>>;
}
