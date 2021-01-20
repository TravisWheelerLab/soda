import {Annotation} from "../../annotations/annotation";
import {StringParser} from "./string-parser";
import {Gff3Annotation, Gff3AnnotationConfig, Phase} from "../../annotations/gff3-annotation";
import {Orientation} from "../../annotations/oriented-annotation";

const GFF3_FIELD_COUNT = 9;
const GFF3_SEPARATOR = '\t';
const GFF3_ATTR_SEPARATOR = ';';

export class Gff3Parser implements StringParser<Gff3Annotation> {
    lineCount = 0;
    constructor() {
    }

    public parseLine(line: string): Gff3Annotation[] {
        this.lineCount++;
        let fields = line.split(GFF3_SEPARATOR);
        if (fields.length !== GFF3_FIELD_COUNT) {
            throw(`Incorrect field count at line ${this.lineCount}.\n${line}`);
        }
        let attributePairs = fields[8].split(GFF3_ATTR_SEPARATOR);
        let attributes: Map<string, string> = new Map();
        for (const pair of attributePairs) {
            let [key, value] = pair.split('=')
            attributes.set(key, value);
        }

        let conf: Gff3AnnotationConfig = {
            id: (() => {
                // get the id from the attributes
                let id = attributes.get('ID');
                if (id == undefined) {
                    // or if it doesn't exist, we'll give it a default
                   id = `GFF3.${this.lineCount}`;
                }
                return id;
            })(),
            w: +fields[4] - +fields[3] + 1,
            x: +fields[3],
            y: 0,
            h: 0,
            seqId: fields[0],
            source: fields[1],
            type: fields[3],
            score: +fields[5],
            orientation: <Orientation>fields[6],
            phase: <Phase>fields[7],
            attributes: attributes,
        }
        return [];
    }
}
