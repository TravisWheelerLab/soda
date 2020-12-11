import {Annotation} from "./annotation";

/**
 * A simple enum to define orientation
 */
export enum Orientation {
    /**
     * Represents the forward strand
     */
    Forward = "+",
    /**
     * Represents the reverse strand
     */
    Reverse = "-",
}

/**
 * An interface to define an Annotation that has a semantic orientation. This is most likely going to indicate
 * whether the Annotation is on the forward or reverse strand in a chromosome.
 */
export interface OrientedAnnotation extends Annotation {
    /**
     *  The orientation.
      */
    orientation: Orientation;
}
