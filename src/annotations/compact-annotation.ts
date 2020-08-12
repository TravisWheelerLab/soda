import { Annotation } from "./annotation";

// an interface to define an annotations that can be visually compacted in a chart
export interface CompactAnnotation extends Annotation {
    compacted: boolean;
    compactX: number;
    compactW: number;
}

// we define a custom type guard for this interface, since typescript doesn't
// seem to support runtime type checking for interfaces
export function isCompactAnn(a: Annotation): a is CompactAnnotation {
    // TODO: we can probably make a stronger type guard
    return (<CompactAnnotation> a).compacted !== undefined;
}
