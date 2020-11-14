import {Annotation} from "./annotation";

/**
 * An interface to define an Annotation that has a semantic orientation. This is most likely going to indicate
 * whether the Annotation is on the forward or reverse strand in a chromosome.
 */
export interface OrientedAnnotation extends Annotation {
    // TODO: make this an enum
    /**
     *  A string to represent the orientation.
      */
    orientation: string;
}
