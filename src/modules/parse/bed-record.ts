/**
 * An interface that describes the SODA representation of a BED record object created by gmod/bed-js (see
 * https://github.com/GMOD/bed-js).
 */
export interface BedRecord {
    /**
     * The name of the chromosome that the record is on.
     */
    chrom: string,
    /**
     * The start coordinate of the record.
     */
    chromStart: number,
    /**
     * The end coordinate of the record.
     */
    chromEnd: number,
    /**
     * The name of the record.
     */
    name: string,
    /**
     * The score of the record. This metric is rarely consistent across various data sources.
     */
    score: number,
    /**
     * A number that represents the chromosome strand that the record is on. In the BED format spec, this is either
     * a '+' or a '-'. Here, it's a number because that's what gmod/bed-js changes it into.
     */
    strand: number,
    /**
     * A BED field that describes at which coordinate the feature should be drawn "thickly."
     */
    thickStart: number,
    /**
     * A BED field that describes at which coordinate the feature should stop being drawn "thickly."
     */
    thickEnd: number,
    /**
     * The color that the feature should be drawn.
     */
    itemRgb: string,
    /**
     * A BED field that describes the number of (typically discontiguous) "blocks" that make up this record.
     */
    blockCount: number,
    /**
     * A list of the sizes of each block counted by the blockCount field.
     */
    blockSizes: number[],
    /**
     * The offset from chromStart at which each block starts.
     */
    blockStarts: number[],
}
