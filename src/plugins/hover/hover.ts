import * as d3 from 'd3';
import { getSelectionById } from '../id-map';
import { Annotation } from "../../annotations/annotation";

// this module provides a way to route an arbitrary number of
// hover behaviors to a soda primitive

// these maps contain lists of mouseover and mouseout functions
// to be called whenever a soda primitive is hovered
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
    // we bind every svg that has a hover parameter to the same mouseover
    // and mouseout functions
    selection
        .on('mouseover', (a: Annotation) => mouseover(selection, a))
        .on('mouseout', (a: Annotation) => mouseout(selection, a));
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
