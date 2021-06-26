import {Annotation, AnnotationConfig} from "./annotation";
import {Orientation, OrientedAnnotation} from "./oriented-annotation";

/**
 * A simple interface that holds the arguments for a BedAnnotation constructor.
 */
export interface BedAnnotationConfig extends AnnotationConfig {
    /**
     * The orientation of the record.
     */
    orientation?: Orientation,
    /**
     * The score of the record.
     */
    score?: number,
    /**
     * The name of the record.
     */
    name?: string,
    /**
     * A BED field that describes at which coordinate the feature should be drawn "thickly."
     */
    thickStart?: number,
    /**
     * A BED field that describes at which coordinate the feature should stop being drawn "thickly."
     */
    thickEnd?: number,
    /**
     * The color that the feature should be drawn.
     */
    itemRgb?: string,
}

/**
 * An Annotation definition for BED records. For more information on BED records, see
 * https://genome.ucsc.edu/FAQ/FAQformat.html#format1.
 */
export class BedAnnotation extends Annotation implements OrientedAnnotation {
    /**
     * The orientation of the record.
     */
    orientation: Orientation;
    /**
     * The score of the record.
     */
    score?: number;
    /**
     * The name of the record.
     */
    name?: string;
    /**
     * A BED field that describes at which coordinate the feature should stop being drawn "thickly."
     */
    thickStart?: number;
    /**
     * The color that the feature should be drawn.
     */
    thickEnd?: number;
    /**
     * The color that the feature should be drawn.
     */
    itemRgb?: string;

    constructor(config: BedAnnotationConfig) {
        super(config);
        if (config.orientation) {
            this.orientation = config.orientation;
        }
        else {
            this.orientation = Orientation.Unoriented;
        }
        this.score = config.score;
        this.name = config.name;
        this.thickStart = config.thickStart;
        this.thickEnd = config.thickEnd;
        this.itemRgb = config.itemRgb;
    }
}
