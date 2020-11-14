import {Annotation} from "./annotation";

/**
 * An interface to represent an Annotation that will be represented as text. Generally, this will be a label that is
 * rendered near another Annotation. TextAnnotations are capable of trying to be "smart" about displaying their
 * underlying data. They can be provided with a list of strings of various levels of detail/length, and they will
 * display the most detailed/longest text that will fit inside of the space available in the target Chart. When
 * paired with the default TextAnnotation ZoomBehavior, this behavior can be dynamically applied as the Chart is
 * zoomed or changes dimensions.
 */
export interface TextAnnotation extends Annotation {
    /**
     * A list of text at different levels of detail/length. These should sorted in order of increasing detail.
     */
    text: string[];
    /**
     * A list of thresholds, measured in the semantic width of the current view in a Chart, at which the different
     * levels of text detail will be displayed. When TextAnnotations are passed to the TextGlyph() function, these
     * values are precomputed before an initial render takes place. These should not be set directly.
     */
    drawThresholds: number[];
}
