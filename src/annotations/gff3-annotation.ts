import {Annotation, AnnotationConfig} from "./annotation";
import {Orientation, OrientedAnnotation} from "./oriented-annotation";

export enum Phase {
    /**
     * Represents a lack of phase information.
     */
    Null = ".",
    /**
     * Phase of 0 base pair.
     */
    Zero = 0,
    /**
     * Phase of 1 base pair,
     */
    One = 1,
    /**
     * Phase of 2 base pairs.
     */
    Two = 2,
}

/**
 * A simple interface that holds the arguments for a Gff3Annotation constructor.
 */
export interface Gff3AnnotationConfig extends AnnotationConfig {
    /**
     * The sequence to which the annotation references.
     */
    seqId: string;
    /**
     * The source of the annotation, e.g. the software or database.
     */
    source: string;
    /**
     * The type of annotation, e.g gene or exon.
     */
    type: string;
    /**
     * A metric that should give some measure of significance, e.g. e-values or p-values.
     */
    score: number;
    /**
     * The chromosome strand.
     */
    orientation: Orientation;
    /**
     * A field for the 'CDS' type. It is used to indicate where the next codon begins relative to the current CDS
     * feature. For more information refer to https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md
     */
    phase: Phase;
    /**
     * A map of attributes for the annotation.
     */
    attributes: Map<string, string>;
}

/**
 * An Annotation definition for GFF3 records.
 */
export class Gff3Annotation extends Annotation implements OrientedAnnotation {
    /**
     * The sequence to which the annotation references.
     */
    seqId: string;
    /**
     * The source of the annotation, e.g. the software or database.
     */
    source: string;
    /**
     * The type of annotation, e.g gene or exon.
     */
    type: string;
    /**
     * A metric that should give some measure of significance, e.g. e-values or p-values.
     */
    score: number;
    /**
     * The chromosome strand.
     */
    orientation: Orientation;
    /**
     * A field for the 'CDS' type. It is used to indicate where the next codon begins relative to the current CDS
     * feature. For more information refer to https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md
     */
    phase: Phase;
    /**
     * A map of attributes for the annotation.
     */
    attributes: Map<string, string>;

    constructor(config: Gff3AnnotationConfig) {
        super(config);
        this.seqId = config.seqId;
        this.source = config.source;
        this.type = config.type;
        this.score = config.score;
        this.phase = config.phase;
        this.orientation = config.orientation;
        this.attributes = config.attributes;
    }

    getW(): number {
        return 0;
    }

    getX(): number {
        return 0;
    }
}
