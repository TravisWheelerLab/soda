import * as d3 from "d3";
import {Annotation} from "../../annotations/annotation";
import {ZoomBehavior} from "../../plugins/zoom/zoom-behavior";
import {Chart} from "../../charts/chart";

export interface LineConfig<A extends Annotation, C extends Chart<any>> {
    // the class to apply to the svg when it's created
    selector: string;
    // dimensional configuration
    x1: (a: A, c: C) => number;
    x2: (a: A, c: C) => number;
    y1: (a: A, c: C) => number;
    y2: (a: A, c: C) => number;
    // style configuration
    strokeColor?: (a: A, c: C) => string;
    strokeWidth?:   (a: A, c: C) => number;
    strokeOpacity?: (a: A, c: C) => number;
    // controls dashed/dotted line parameters
    strokeDashArray?: (a: A, c: C) => string;
    // the user can optionally provide a custom ZoomBehavior for the line
    zoom?: ZoomBehavior<C, d3.Selection<SVGLineElement, A, HTMLElement, any>>;
}

export interface VerticalLineConfig<A extends Annotation, C extends Chart<any>> {
    // the class to apply to the svg when it's created
    selector: string;
    // dimensional configuration
    x?: (a: A, c: C) => number;
    y1?: (a: A, c: C) => number;
    y2?: (a: A, c: C) => number;
    // style configuration
    strokeColor?: (a: A, c: C) => string;
    strokeWidth?:   (a: A, c: C) => number;
    strokeOpacity?: (a: A, c: C) => number;
    // controls dashed/dotted line parameters
    strokeDashArray?: (a: A, c: C) => string;
    // the user can optionally provide a custom ZoomBehavior for the line
    zoom?: ZoomBehavior<C, d3.Selection<SVGLineElement, A, HTMLElement, any>>;
}

export interface HorizontalLineConfig<A extends Annotation, C extends Chart<any>> {
    // the class to apply to the svg when it's created
    selector: string;
    // dimensional configuration
    x1?: (a: A, c: C) => number;
    x2?: (a: A, c: C) => number;
    y?: (a: A, c: C) => number;
    // style configuration
    strokeColor?: (a: A, c: C) => string;
    strokeWidth?:   (a: A, c: C) => number;
    strokeOpacity?: (a: A, c: C) => number;
    // controls dashed/dotted line parameters
    strokeDashArray?: (a: A, c: C) => string;
    // the user can optionally provide a custom ZoomBehavior for the line
    zoom?: ZoomBehavior<C, d3.Selection<SVGLineElement, A, HTMLElement, any>>;
}
