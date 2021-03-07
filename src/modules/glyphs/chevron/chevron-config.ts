import {Annotation} from "../../../annotations/annotation";
import {Chart} from "../../../charts/chart";
import {GlyphConfig} from "../glyph-config";

/**
 * An interface that defines the common parameters for rendering chevron glyphs.
 */
export interface ChevronPrimitiveConfig<A extends Annotation, C extends Chart<any>> extends GlyphConfig {
    /**
     * The semantic query width at which the chevron patterns will be disabled. At this point, they will look like
     * regular rectangles or lines.
     */
    disableChevronAt?: number;
    /**
     * A callback to define the height attribute of the rectangle that is used for the background of the chevron glyph.
     * @param a
     * @param c
     */
    backgroundH?: (a: A, c: C) => number;
    /**
     * A callback to define the color attribute of the rectangle that is used for the background of the chevron
     * glyph.
     * @param a
     * @param c
     */
    backgroundFillColor?: (a: A, c: C) => string;
    /**
     * A callback to define the opacity attribute of the rectangle that is used for the background of the chevron
     * glyph.
     * @param a
     * @param c
     */
    backgroundFillOpacity?: (a: A, c: C) => number;
    /**
     * A callback to define the y coordinate of the chevron pattern.
     * @param a
     * @param c
     */
    chevronY?: (a: A, c: C) => number;
    /**
     * A callback to define the height of the chevron SVG path that is placed inside of the background rectangle.
     * @param a
     * @param c
     */
    chevronH?: (a: A, c: C) => number;
    /**
     * A callback to define the spacing between chevrons in the SVG pattern that is affixed to the glyph.
     * @param a
     * @param c
     */
    chevronSpacing?: (a: A, c: C) => number;
    /**
     * A callback to define the fill color of the SVG path that is placed inside of the background rectangle.
     * @param a
     * @param c
     */
    chevronFillColor?: (a: A, c: C) => string;
    /**
     * A callback to define the fill opacity of the SVG path that is placed inside of the background rectangle.
     * @param a
     * @param c
     */
    chevronFillOpacity?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke color of the SVG path that is placed inside of the background rectangle.
     * @param a
     * @param c
     */
    chevronStrokeColor?: (a: A, c: C) => string;
    /**
     * A callback to define the stroke width of the SVG path that is placed inside of the background rectangle.
     * @param a
     * @param c
     */
    chevronStrokeWidth?: (a: A, c: C) => number;
    /**
     * A callback to define the stroke opacity of the SVG path that is placed inside of the background rectangle.
     * @param a
     * @param c
     */
    chevronStrokeOpacity?: (a: A, c: C) => number;
}
