import {Annotation} from "../../annotations/annotation";
import {Chart} from "../../charts/chart";

/**
 * A simple interface that holds the common parameters for rendering glyphs.
 */
export interface GlyphConfig<A extends Annotation, C extends Chart<any>> {
    selector: string;
}
