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
    attributes: Map<string, string[]>;
    /**
     * The ID from the GFF3 file. This comes from the optional attributes. For more information see
     * https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md#description-of-the-format
     */
    gff3Id?: string;
    /**
     * The annotation(s) that this one is a sub-component of. In the GFF3 spec, a feature can have multiple parents. In
     * those cases, the feature is probably meant to be visualized multiple times as a part of distinct groups of
     * features. This does not really work very well with the way that SODA is designed. Instead, we create multiple
     * SODA Gff3Annotation objects for each identical copy of a feature, and each one gets exactly one different parent.
     */
    parent?: Gff3Annotation;
    /**
     * The annotations that are considered as a sub-component of this annotation.
     */
    children?: Gff3Annotation[];
    /**
     * The annotation from which this one is derived.
     */
    derivedFrom?: Gff3Annotation;
    /**
     * The annotations that are considered as derived from this annotation.
     */
    derivatives?: Gff3Annotation[];
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
    attributes: Map<string, string[]>;
    /**
     * The ID from the GFF3 file. This comes from the optional attributes. For more information see
     * https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md#description-of-the-format
     */
    gff3Id?: string;
    /**
     * The annotation(s) that this one is a sub-component of. In the GFF3 spec, a feature can have multiple parents. In
     * those cases, the feature is probably meant to be visualized multiple times as a part of distinct groups of
     * features. This does not really work very well with the way that SODA is designed. Instead, we create multiple
     * SODA Gff3Annotation objects for each identical copy of a feature, and each one gets exactly one different parent.
     */
    parent?: Gff3Annotation;
    /**
     * The annotations that are considered as a sub-component of this annotation.
     */
    children?: Gff3Annotation[];
    /**
     * The annotation from which this one is derived.
     */
    derivedFrom?: Gff3Annotation;
    /**
     * The annotations that are considered as derived from this annotation.
     */
    derivatives?: Gff3Annotation[];

    constructor(config: Gff3AnnotationConfig) {
        super(config);
        this.seqId = config.seqId;
        this.source = config.source;
        this.type = config.type;
        this.score = config.score;
        this.phase = config.phase;
        this.orientation = config.orientation;
        this.attributes = config.attributes;
        this.gff3Id = config.gff3Id;
        this.children = config.children;
        this.parent = config.parent;
        this.derivatives = config.derivatives;
        this.derivedFrom = config.derivedFrom;
    }

    public addChild(ann: Gff3Annotation) {
        if (this.children !== undefined) {
            this.children.push(ann);
        } else {
            this.children = [ann];
        }
    }

    public addDerivative(ann: Gff3Annotation) {
        if (this.derivatives !== undefined) {
            this.derivatives.push(ann);
        }
        else {
            this.derivatives = [ann];
        }
    }
}
