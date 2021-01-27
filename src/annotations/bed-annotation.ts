import {Annotation, AnnotationConfig} from "./annotation";
import {Orientation, OrientedAnnotation} from "./oriented-annotation";

export interface BedAnnotationConfig extends AnnotationConfig {
    orientation?: Orientation,
    score?: number,
    name?: string,
    thickStart?: number,
    thickEnd?: number,
    itemRgb?: string,
}

/**
 * An Annotation definition for BED records.
 */
export class BedAnnotation extends Annotation implements OrientedAnnotation {
    orientation: Orientation;
    score?: number;
    name?: string;
    thickStart?: number;
    thickEnd?: number;
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
