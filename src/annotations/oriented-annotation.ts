import {Annotation} from "./annotation";

// this interface to define an annotation that has an orientation
export interface OrientedAnnotation extends Annotation {
    // TODO: make this an enum
    orientation: string;
}