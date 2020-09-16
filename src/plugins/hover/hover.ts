import * as d3 from 'd3';
import { HoverConfig } from './hover-config';
import { getSelectionById } from '../id-map';
import { Annotation } from "../../annotations/annotation";

// this module provides a way to route an arbitrary number of
// hover behaviors to a soda primitive

// these maps contain lists of mouseover and mouseout functions
// to be called whenever a soda primitive is hovered
const mouseoverBehaviorMap: Map<string, {(s: d3.Selection<any, any, any, any>, a: Annotation): void}[]> = new Map();
const mouseoutBehaviorMap: Map<string, {(s: d3.Selection<any, any, any, any>, a: Annotation): void}[]> = new Map();

function getMouseoverList<A extends Annotation>(ann: A): {(s: d3.Selection<any, any, any, any>, a: A): void}[] {
    let list = mouseoverBehaviorMap.get(ann.id);
    if (list == undefined) {
        list = [];
        mouseoverBehaviorMap.set(ann.id, list);
    }
    return list;
}

function getMouseoutList<A extends Annotation>(ann: A): {(s: d3.Selection<any, any, any, any>, a: A): void}[] {
    let list = mouseoutBehaviorMap.get(ann.id);
    if (list == undefined) {
        list = [];
        mouseoutBehaviorMap.set(ann.id, list);
    }
    return list;
}

export function addHoverBehavior<A extends Annotation>(config: HoverConfig<A>): void {
    let mouseoverList = getMouseoverList(config.ann);
    mouseoverList.push(config.mouseover);
    let mouseoutList = getMouseoutList(config.ann);
    mouseoutList.push(config.mouseout);

    let selection = getSelectionById(config.ann.id);
    // we bind every svg that has a hover parameter to the same mouseover
    // and mouseout functions
    selection
        .on('mouseover', (a: Annotation) => mouseover(selection, a))
        .on('mouseout', (a: Annotation) => mouseout(selection, a));
}

function mouseover<A extends Annotation>(selection: d3.Selection<any, any, any, any>, ann: A): void {
    for (const behavior of getMouseoverList(ann)) {
        behavior(selection, ann);
    }
}

function mouseout<A extends Annotation>(selection: d3.Selection<any, any, any, any>, ann: A): void {
    for (const behavior of getMouseoutList(ann)) {
        behavior(selection, ann);
    }
}
