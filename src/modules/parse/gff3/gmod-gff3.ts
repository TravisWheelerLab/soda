export interface GmodGff3 {
    seq_id: string,
    source: string,
    type: string,
    start: number,
    end: number,
    score: number,
    strand: string,
    phase: number,
    // attributes: Map<string, string[]>;
    attributes: Object;
    child_features: GmodGff3[][],
    derived_features: GmodGff3[][],
}
