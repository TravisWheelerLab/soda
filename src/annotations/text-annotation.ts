import {Annotation} from "./annotation";

// this interface to define an annotations that will be represented as text
export interface TextAnnotation extends Annotation {
    // the text is an array, because it is likely that we will want to display
    // different text depending on how much room the annotations has on the screen
    text: string[];
    // we define thresholds at which to draw the different text stored in the object
    // the indices of these thresholds should correspond to those of the desired text
    drawThresholds: number[];
}