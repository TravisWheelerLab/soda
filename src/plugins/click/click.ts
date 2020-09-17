import * as d3 from 'd3';
import { ClickConfig } from './click-config';
import { getSelectionById } from '../id-map';
import { Annotation } from "../../annotations/annotation";

// this module provides a way to route an arbitrary number of
// click behaviors to a soda primitive

// these maps contain lists of click functions to
// be called whenever a soda primitive is clicked
const clickBehaviorMap: Map<string, {(s: d3.Selection<any, any, any, any>, a: Annotation): void}[]> = new Map();

function getClickList<A extends Annotation>(ann: A): {(s: d3.Selection<any, any, any, any>, a: A): void}[] {
    let list = clickBehaviorMap.get(ann.id);
    if (list == undefined) {
        list = [];
        clickBehaviorMap.set(ann.id, list);
    }
    return list;
}

export function addClickBehavior<A extends Annotation>(config: ClickConfig<A>): void {
    let clickList = getClickList(config.ann);
    clickList.push(config.click);

    let selection = getSelectionById(config.ann.id);
    // we bind every svg that has a click parameter to the same click function
    selection
        .on('click', (a: Annotation) => click(selection, a));
}

function click<A extends Annotation>(selection: d3.Selection<any, any, any, any>, ann: A): void {
    for (const behavior of getClickList(ann)) {
        behavior(selection, ann);
    }
}
