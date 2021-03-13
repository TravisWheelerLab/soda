import {Gff3Annotation, Gff3AnnotationConfig, Phase} from "../../../annotations/gff3-annotation";
import {Orientation} from "../../../annotations/oriented-annotation";
import {Gff3Record} from "./gff3-record";

import gff from '@gmod/gff';

let idCnt = 0;

/**
 * This is a private function that takes a GMOD/gff-js object representation of a GFF3 record and recursively parses
 * through it to create a list of SODA Gff3Annotation objects.
 * @param currentObj The GMOD/gff-js object that the function is parsing.
 * @param parent An optional reference to the current objects parent.
 * @param derivedFrom An optional reference to the Annotation from which the current object is derived
 * @returns A flat list of all of the Gff3Annotation objects.
 */
function recursiveGmodGff3Parse(currentObj: Gff3Record,
                                parent: Gff3Annotation | undefined = undefined,
                                derivedFrom: Gff3Annotation | undefined = undefined ): Gff3Annotation[] {
    let conf: Gff3AnnotationConfig = {
        // we want to just make our own IDs, since the GFF3 ID attribute was designed in a way that makes it
        // remarkably useless for grouping data in a way that conforms to SODA principles
        // we'll still keep the GFF3 ID on the attributes property, so it can still be accessed
        id: `GFF3.${idCnt++}`,
        x: currentObj.start,
        w: currentObj.end - currentObj.start + 1,
        y: 0,
        orientation: <Orientation>currentObj.strand,
        seqId: currentObj.seq_id,
        source: currentObj.source,
        type: currentObj.type,
        score: currentObj.score,
        phase: <Phase>currentObj.phase,
        // TODO: make sure this actually casting correctly
        attributes: <Map<string, string[]>>currentObj.attributes,
        gff3Id: (() => {
            // TODO: I need to make an interface that represents the attributes to get away from this ts-ignore
            //@ts-ignore
            let id: string | undefined = currentObj.attributes['ID'][0]
            if (id !== undefined) {
                return id;
            }
            return undefined;
        })()
    }
    let currentAnn = new Gff3Annotation(conf);
    let annotations: Gff3Annotation[] = [currentAnn];

    if (parent !== undefined) {
        parent.addChild(currentAnn);
        currentAnn.parent = parent;
    }

    if (currentObj.child_features.length > 0) {
        let children: Gff3Annotation[] = [];
        for (const child of currentObj.child_features) {
            for (const childObj of child) {
                children = children.concat(recursiveGmodGff3Parse(childObj, parent = currentAnn));
            }
        }
        annotations = annotations.concat(children);
    }
    if (currentObj.derived_features.length > 0) {
        let derivatives: Gff3Annotation[] = [];
        for (const deriv of currentObj.derived_features) {
            for (const derivObj of deriv) {
                derivatives = derivatives.concat(recursiveGmodGff3Parse(derivObj, derivedFrom = currentAnn));
            }
        }
        annotations = annotations.concat(derivatives);
    }

    return annotations;
}

/**
 * This function takes a string of newline delimited GFF3 records and parses them into SODA Gff3Annotation objects.
 * Each group of objects with parent/children relationships is placed in an array, and the list of those
 * group arrays is returned.
 * @param lines The string of newline delimited GFF3 records.
 * @returns A two dimensional array of Gff3Objects. The first dimension indexes by group, and the second dimension
 * indexes within each group.
 */
export function gff3ParseGrouped(lines: string): Gff3Annotation[][] {
    // we pull a two dimensional array of objects from the GMOD/gff-js package
    // at each index is a group of objects that share the same ID
    let gmodGff3Objects: Gff3Record[][] = gff.parseStringSync(lines);
    let annGroups: Gff3Annotation[][] = [];
    for (const objList of gmodGff3Objects) {
        for (const obj of objList) {
            let annGroup = recursiveGmodGff3Parse(obj);
            for (const a of annGroup) {
                // recursiveSetParents(a);
            }
            annGroups.push(annGroup);
        }
    }
    return annGroups;
}

/**
 * This function takes a string of newline delimited GFF3 records and parses them into SODA Gff3Annotation objects.
 * The objects are returned in a flat array with no semantic grouping.
 * @param lines The string of newline delimited GFF3 records.
 * @returns A flat array of Gff3Objects.
 */
export function gff3ParseFlat(lines: string): Gff3Annotation[] {
    // we pull a two dimensional array of objects from the GMOD/gff-js package
    // at each index is a group of objects that share the same ID
    let gmodGff3Objects: Gff3Record[][] = gff.parseStringSync(lines);
    let ann: Gff3Annotation[] = [];
    for (const objList of gmodGff3Objects) {
        for (const obj of objList) {
            let annGroup = recursiveGmodGff3Parse(obj);
            for (const a of annGroup) {
                // recursiveSetParents(a);
            }
            ann = ann.concat(annGroup);
        }
    }
    return ann;
}
