import BED from '@gmod/bed'
import {BedAnnotation, BedAnnotationConfig} from "../../../annotations/bed-annotation";
import {Orientation} from "../../../annotations/oriented-annotation";

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
            h: 0,
            score: bedObj.score,
            name: bedObj.name,
            orientation: Orientation.Forward,
        }
        ann.push(new BedAnnotation(conf));
    }
    return ann;
}
