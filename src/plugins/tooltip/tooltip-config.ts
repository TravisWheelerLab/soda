import { Annotation } from "../../annotations/annotation";

// this config defines the binding of a tooltip to some svg element
export interface TooltipConfig<A extends Annotation> {
    // the annotation objects that we will bind the tooltip to
    ann: A;
    // a function that must be provided to extract the
    // desired text from the Annotation
    text: (a: A) => string;
}
