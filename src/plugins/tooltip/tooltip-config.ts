import { Annotation } from "../../annotations/annotation";
import {Chart} from "../../charts/chart";

// this config defines the binding of a tooltip to some svg element
export interface TooltipConfig<A extends Annotation, C extends Chart<any>> {
    // the annotation objects that we will bind the tooltip to
    ann: A;
    // a function that must be provided to extract the
    // desired text from the Annotation
    text:               (a: A, c: C) => string;
    textColor?:          (a: A, c: C) => string;
    opacity?:           (a: A, c: C) => number;
    backgroundColor?:   (a: A, c: C) => string;
    borderRadius?:      (a: A, c: C) => number;
    padding?:           (a: A, c: C) => number;
}
