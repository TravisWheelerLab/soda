/**
 * A simple interface that holds the arguments for an Annotation constructor.
 */
export interface AnnotationConfig {
    /**
     * A unique identifier for an Annotation object. Currently, it is up to users to make sure that this field is
     * uniquely assigned. SODA will not behave as intended if two distinct Annotations have the same id.
     */
    id: string,
    /**
     * The x position of the annotation in semantic coordinates (generally a position on a chromosome in base pairs)
     */
    x: number,
    /**
     * The y position of the annotation. This rarely has semantic meaning, and is probably used to prevent
     * horizontal overlap or preserve clarity in the visualization.
     */
    y: number,
    /**
     * The width of the annotation in semantic coordinates.
     */
    w: number,
}

/**
 * :trst-class:`Annotation` objects are the main data structure used by SODA to store information about alignments. In
 * many cases, this should be sufficient to store the information to represent a single glyph in a visualization. If
 * more information is needed, the Annotation class should be extended.
 */
export class Annotation {
    /**
     * A unique identifier for an Annotation object. Currently, it is up to users to make sure that this field is
     * uniquely assigned. SODA will not behave as intended if two distinct Annotations have the same id.
     */
    id: string;
    /**
     * The x position of the annotation in semantic coordinates (generally a position on a chromosome in base pairs)
     */
    x: number;
    /**
     * The y position of the annotation. This rarely has semantic meaning, and is probably used to prevent
     * horizontal overlap or preserve clarity in the visualization.
     */
    y: number;
    /**
     * The width of the annotation in semantic coordinates.
     */
    w: number;
    constructor(config: AnnotationConfig) {
        this.id = config.id;
        this.x = config.x;
        this.y = config.y;
        this.w = config.w;
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

    /**
     * Gets the x2 coordinate.
     */
    public getX2(): number {
        return (this.x + this.w);
    }

    /**
     * Sets the y coordinate. This exists largely to let the layout module be oblivious to the existence of
     * AnnotationGroups.
     */
    public setY(y: number) {
        console.log("setting y: ", y);
        this.y = y;
    }
}
