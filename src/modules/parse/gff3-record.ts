/**
 * An interface that describes the SODA representation of a GFF3 record.
 */
export interface Gff3Record {
    seq_id: string,
    source: string,
    type: string,
    start: number,
    end: number,
    score: number,
    strand: string,
    phase: number,
    attributes: Object;
    child_features: Gff3Record[][],
    derived_features: Gff3Record[][],
}
