import { Annotation } from "../../annotations/annotation";

// this config defines the binding of a tooltip to some svg element
export interface TooltipConfig<A extends Annotation> {
    // the string we'll use to select the svg element(s)
    selector: string;
    // a function that must be provided to extract the
    // desired text from the Annotation
    textFromAnn: (d: A) => string;
    // we optionally allow the user to define arbitrary
    // functions to be called on the hover events
    mouseover?: (d: A) => void;
    mouseout?: (d: A) => void;
}