import {Annotation} from "./annotation";

/**
 * An interface to define an Annotation that can be dynamically compacted and un-compacted in a visualization.
 */
export interface CompactAnnotation extends Annotation {
    /**
     * The flag that indicates whether the Annotation is currently compacted.
     */
    compacted: boolean;
    /**
     * The adjusted semantic x-coordinate to use in rendering when the Annotation is compacted.
     */
    compactX: number;
    /**
     * The adjusted semantic width to use in rendering when the Annotation is compacted.
     */
    compactW: number;
}

/**
 * A type guard function to check whether an arbitrary Annotation object is compactable. This may not
 * currently be entirely robust, but it should be fine to use with reasonable caution.
 * @param a The Annotation object to type check.
 */
export function isCompactAnn(a: Annotation): a is CompactAnnotation {
    // TODO: we can probably make a stronger type guard
    return (<CompactAnnotation> a).compacted !== undefined;
}
