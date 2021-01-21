import {Annotation, AnnotationConfig} from "../../annotations/annotation";
import {StringParser} from "./string-parser";
import {Gff3Annotation, Gff3AnnotationConfig, Phase} from "../../annotations/gff3-annotation";
import {Orientation} from "../../annotations/oriented-annotation";
import {AnnotationGroup} from "../../annotations/annotation-group";

const GFF3_FIELD_COUNT = 9;
const GFF3_SEPARATOR = '\t';
const GFF3_ATTR_SEPARATOR = ';';

// export class Gff3Parser implements StringParser<Gff3Annotation> {
export class Gff3Parser {
    lineCount = 0;
    ann: Gff3Annotation[] = [];
    groupMap: Map<string, Gff3Annotation[]> = new Map();

    constructor() {
    }

    public parseLine(line: string): Gff3Annotation | void {
        this.lineCount++;
        let fields = line.split(GFF3_SEPARATOR);
        if (fields.length !== GFF3_FIELD_COUNT) {
            console.error(`Incorrect field count at line ${this.lineCount}.\n${line}`);
            return;
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
        return new Gff3Annotation(conf);
    }

    public parseLines(lines: string): AnnotationGroup[] {
        for (const line of lines.split('\n')) {
            let a = this.parseLine(line);
            if (a !== undefined) {
                this.ann.push(a);
                let parentId = a.attributes.get('Parent');

                if (parentId !== undefined) {
                    let group = this.groupMap.get(parentId);
                    if (group == undefined) {
                        group = [];
                        this.groupMap.set(parentId, group);
                    }
                }

                group.push(a);
            }
        }

        let annGroups: AnnotationGroup[] = [];
        let keys = Array.from(this.groupMap.keys());
        for (const id of keys) {

            let ann = this.groupMap.get(id)!;
            let a0 = ann[0];
            let conf: AnnotationConfig = {
                id: id,
                x: a0.x,
                w: a0.w,
                y: 0,
                h: 0,
            }
            let annGroup = new AnnotationGroup(conf);
            for (const a of ann.slice(0)) {
                annGroup.add(a);
            }
            annGroups.push(annGroup);
        }
        return annGroups;
    }
}
