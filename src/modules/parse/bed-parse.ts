import BED from '@gmod/bed'
import {BedAnnotation, BedAnnotationConfig} from "../../annotations/bed-annotation";
import {Orientation} from "../../annotations/oriented-annotation";
import {Annotation} from "../../annotations/annotation";
import {BedRecord} from "./bed-record";

/**
 * A function that explicitly parses a BED6 object from a string of BED records.
 * @param lines The BED records, newline separated.
 */
export function bed6Parse(lines: string): BedAnnotation[] {
    let bedParser = new BED();
    let results = lines.split("\n").map((line) => bedParser.parseLine(line));
    let ann: BedAnnotation[] = [];
    let id = 0;
    for (const bedObj of results) {
        let conf: BedAnnotationConfig = {
            id: `BED6.${id++}`,
            x: bedObj.chromStart,
            w: bedObj.chromEnd - bedObj.chromStart,
            y: 0,
            score: bedObj.score,
            name: bedObj.name,
            orientation: Orientation.Forward,
        }
        ann.push(new BedAnnotation(conf));
    }
    return ann;
}

/**
 * A function that uses a custom parsing callback function to parse a string of BED records into an arbitrary type of
 * Annotation objects.
 * @param lines The BED records, newline separated.
 * @param parseCallback The callback function that defines how to transform a BedRecord object into an Annotation
 * object.
 * @typeParam A The Annotation type that this function will return.
 */
export function customBedParse<A extends Annotation>(lines: string,
                                                     parseCallback: (bedObj: BedRecord) => A): A[] {
    lines = lines.replace(/\n*$/, '');
    lines = lines.replace(/^\s*[\r\n]/gm, '');
    let bedParser = new BED();
    let results = lines.split("\n").map((line) => bedParser.parseLine(line));
    let ann: A[] = [];
    for (const bedObj of results) {
        ann.push(parseCallback(bedObj));
    }
    return ann;
}
