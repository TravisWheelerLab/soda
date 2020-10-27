import * as d3 from "d3";
import {Annotation} from "../../annotations/annotation";
import {Chart} from "../../charts/chart";
import {ZoomBehavior} from "../../plugins/zoom/zoom-behavior";

export interface RectangleConfig<A extends Annotation, C extends Chart<any>> {
    // the class to apply to the svg when it's created
    selector: string;
    // dimensional configuration
    y?: (a: A, c: C) => number;
    x?: (a: A, c: C) => number;
    w?: (a: A, c: C) => number;
    h?: (a: A, c: C) => number;
    // style configuration
    strokeWidth?:   (a: A, c: C) => number;
    strokeOpacity?: (a: A, c: C) => number;
    strokeColor?:   (a: A, c: C) => string;
    fillColor?:     (a: A, c: C) => string;
    // the user can optionally provide a custom ZoomBehavior for the primitive
    zoom?: ZoomBehavior<C, d3.Selection<SVGElement, A, HTMLElement, any>>;
}
