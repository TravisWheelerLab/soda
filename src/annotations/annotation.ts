import { AnnotationConfig } from './annotation-config'

/**
 * Annotation objects are the main data structure used by SODA to store information about alignments. In many cases,
 * this should be sufficient to store the information to represent a single glyph in a visualization. If more
 * information is needed, the Annotation class should be extended.
 */
export class Annotation {
    /**
     * A unique identifier for an Annotation object. Currently, it is up to users to make sure that this field is
     * uniquely assigned. SODA will not behave as intended if two distinct Annotations have the same id.
     */
    readonly id: string;

    /**
     * The x position of the annotation in semantic coordinates (generally a position on a chromosome in base pairs)
     */
    readonly x: number;

    /**
     * The y position of the annotation. This rarely has semantic meaning, and is probably used to prevent
     * horizontal overlap or preserve clarity in the visualization.
     */
    y: number;

    /**
     * The width of the annotation in semantic coordinates.
     */
    readonly w: number;
    /**
     * The height of an annotation in the visualization. This is currently not used by the SODA core.
     */
        // TODO: get rid of this?
    readonly h: number;

    constructor(config: AnnotationConfig) {
        this.id = config.id;
        this.x = config.x;
        this.y = config.y;
        this.w = config.w;
        this.h = config.h;
    }

    /**
     * Getter for the x coordinate.
     * @returns The x coordinate.
     */
    public getX(): number {
        return (this.x);
    }

    /**
     * Getter for the width.
     * @returns The width.
     */
    public getW(): number {
        return (this.w);
    }
}
