/**
 * An interface that describes the SODA representation of a GFF3 record created by gmod/gff3-js (see
 * https://github.com/GMOD/gff-js).
 */
export interface Gff3Record {
    /**
     * The name of the chromosome or scaffold that the record is on.
     */
    seq_id: string,
    /**
     * The source of the record, e.g. software title or database.
     */
    source: string,
    /**
     * The type of the feature. This is supposed to be a term from the SOFA sequence ontology (see
     * http://www.sequenceontology.org/so_wiki/index.php/Category:SO:SOFA).
     */
    type: string,
    /**
     * The start coordinate of the feature.
     */
    start: number,
    /**
     * The end coordinate of the feature.
     */
    end: number,
    /**
     * The score of the record. This metric is rarely consistent across various data sources.
     */
    score: number,
    /**
     * A string that represents the chromosome strand that the record is on, it should be either '+' for forward or
     * '-' for reverse.
     */
    strand: string,
    /**
     * A field for the CDS type. This is either 0, 1, or 2 to describe the phase of the codons.
     */
    phase: number,
    /**
     * This field can hold any number of tag-value pairs. It can get very complicated (see http://gmod.org/wiki/GFF3)
     */
    attributes: Object;
    /**
     * A tag that is often in the attributes of a GFF3 record. It describes any other features in the data that are
     * a child of this feature.
     */
    child_features: Gff3Record[][],
    /**
     * A tag that is often in the attributes of a GFF3 record. It describes any other features in the data that are
     * derived from this feature.
     */
    derived_features: Gff3Record[][],
}
