import {AnnotationConfig} from "../../../annotations/annotation";
import {Gff3Annotation, Gff3AnnotationConfig, Phase} from "../../../annotations/gff3-annotation";
import {Orientation} from "../../../annotations/oriented-annotation";
import {AnnotationGroup} from "../../../annotations/annotation-group";
import {GmodGff3} from "./gmod-gff3";

let idCnt = 0;

import gff from '@gmod/gff';


    // public parseLine(line: string): Gff3Annotation | void {
    //     this.lineCount++;
    //     let fields = line.split(GFF3_SEPARATOR);
    //     if (fields.length !== GFF3_FIELD_COUNT) {
    //         console.error(`Incorrect field count at line ${this.lineCount}.\n${line}`);
    //         return;
    //     }
    //     let attributePairs = fields[8].split(GFF3_ATTR_SEPARATOR);
    //     let attributes: Map<string, string> = new Map();
    //     for (const pair of attributePairs) {
    //         let [key, value] = pair.split('=')
    //         attributes.set(key, value);
    //     }
    //
    //     let conf: Gff3AnnotationConfig = {
    //         id: (() => {
    //             // get the id from the attributes
    //             let id = attributes.get('ID');
    //             if (id == undefined) {
    //                 // or if it doesn't exist, we'll give it a default
    //                id = `GFF3.${this.lineCount}`;
    //             }
    //             return id;
    //         })(),
    //         w: +fields[4] - +fields[3] + 1,
    //         x: +fields[3],
    //         y: 0,
    //         h: 0,
    //         seqId: fields[0],
    //         source: fields[1],
    //         type: fields[3],
    //         score: +fields[5],
    //         orientation: <Orientation>fields[6],
    //         phase: <Phase>fields[7],
    //         attributes: attributes,
    //     }
    //     return new Gff3Annotation(conf);
    // }

function recursiveGmodGff3Parse(obj: GmodGff3): Gff3Annotation[] {
    let annotations: Gff3Annotation[] = [];
    let children: Gff3Annotation[] = [];
    let derivatives: Gff3Annotation[] = [];
    if (obj.child_features.length) {
        for (const child of obj.child_features) {
            children = children.concat(recursiveGmodGff3Parse(child[0]));
        }
    }
    if (obj.derived_features.length) {
        for (const deriv of obj.derived_features) {
            derivatives = derivatives.concat(recursiveGmodGff3Parse(deriv[0]));
        }
    }
    let conf: Gff3AnnotationConfig = {
        id: (() => {
            // TODO: this should not be suppressed. Instead, I need to create an interface that describes the object
            //  that gff-js uses in place of a map.
            // @ts-ignore
            let id: string = obj.attributes['ID'];
            if (id == undefined) {
               id = `GFF3.${idCnt++}`;
            }
            return id;
        })(),
        x: obj.start,
        w: obj.end - obj.start + 1,
        y: 0,
        h: 0,
        orientation: <Orientation>obj.strand,
        seqId: obj.seq_id,
        source: obj.source,
        type: obj.type,
        score: obj.score,
        phase: <Phase>obj.phase,
        attributes: <Map<string, string[]>>obj.attributes,
        children: children,
        derivatives: derivatives,
    }
    let ann = new Gff3Annotation(conf);
    annotations.push(ann);
    annotations = annotations.concat(children);
    annotations = annotations.concat(derivatives);
    return annotations;
}

export function gff3Parse(lines: string): AnnotationGroup[] {
    // we pull a two dimensional array of objects from the GMOD/gff-js package
    // at each index is a group of objects that share the same ID
    let gmodGff3Objects: GmodGff3[][] = gff.parseStringSync(lines);

    for (const objList of gmodGff3Objects) {
        for (const obj of objList) {
            console.info(recursiveGmodGff3Parse(obj));
        }
    }

    let annGroups: AnnotationGroup[] = [];
    return annGroups;
}
