import * as d3 from 'd3';
import { getSelectionById } from '../id-map';
import { Annotation } from "../../annotations/annotation";

const mouseoverBehaviorMap: Map<string, {(s: d3.Selection<any, any, any, any>, d: Annotation): void}[]> = new Map();
const mouseoutBehaviorMap: Map<string, {(s: d3.Selection<any, any, any, any>, d: Annotation): void}[]> = new Map();

function getMouseoverList(id: string): {(s: d3.Selection<any, any, any, any>, d: Annotation): void}[] {
    let list = mouseoverBehaviorMap.get(id);
    if (list == undefined) {
        list = [];
        mouseoverBehaviorMap.set(id, list);
    }
    return list;
}

function getMouseoutList(id: string): {(s: d3.Selection<any, any, any, any>, d: Annotation): void}[] {
    let list = mouseoverBehaviorMap.get(id);
    if (list == undefined) {
        list = [];
        mouseoverBehaviorMap.set(id, list);
    }
    return list;
}

export function addHoverBehavior(ann: Annotation,
                                 mouseover: {(s: d3.Selection<any, any, any, any>, d: Annotation): void},
                                 mouseout: {(s: d3.Selection<any, any, any, any>, d: Annotation): void}): void {
    let mouseoverList = getMouseoverList(ann.id);
    mouseoverList.push(mouseover);
    let mouseoutList = getMouseoutList(ann.id);
    mouseoutList.push(mouseout);

    let selection = getSelectionById(ann.id);
    selection
        .on('mouseover', (d: Annotation) => mouseover(selection, d))
        .on('mouseout', (d: Annotation) => mouseout(selection, d));
}

function mouseover(selection: d3.Selection<any, any, any, any>, ann: Annotation): void {
    for (const behavior of mouseoverBehaviorMap.get(ann.id)!) {
        if (behavior == undefined) {
            throw(`No hover behavior defined for id: ${ann.id}`);
        }
        behavior(selection, ann);
    }
}

function mouseout(selection: d3.Selection<any, any, any, any>, ann: Annotation): void {
    for (const behavior of mouseoutBehaviorMap.get(ann.id)!) {
        if (behavior == undefined) {
            throw(`No hover behavior defined for id: ${ann.id}`);
        }
        behavior(selection, ann);
    }
}


// merge
//     .on('mouseover', (d) => {
//         d3.selectAll<SVGRectElement, Annotation>('rect')
//             .filter((d2: Annotation) => d2.id == d.id)
//             .style('stroke-opacity', 0.5);
//     })
//     .on('mouseout', (d) => {
//         d3.selectAll<SVGRectElement, Annotation>('rect')
//             .filter((d2: Annotation) => d2.id == d.id)
//             .style('stroke-opacity', 0);
//     });
