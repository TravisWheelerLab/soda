export interface BedRecord {
    chrom: string,
    chromStart: number,
    chromEnd: number,
    name: string,
    score: number,
    strand: number,
    thickStart: number,
    thickEnd: number,
    itemRgb: string,
    blockCount: number,
    blockSizes: number[],
    blockStarts: number[],
}
