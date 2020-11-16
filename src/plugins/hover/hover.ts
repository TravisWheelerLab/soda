import * as d3 from 'd3';
import {getSelectionById} from '../id-map';
import {Annotation} from "../../annotations/annotation";

// this module provides a way to route an arbitrary number of
// hover behaviors to a soda primitive

// these maps contain lists of mouseover and mouseout functions
// to be called whenever a soda primitive is hovered
const mouseoverBehaviorMap: Map<string, {(s: d3.Selection<any, any, any, any>, a: Annotation): void}[]> = new Map();
const mouseoutBehaviorMap: Map<string, {(s: d3.Selection<any, any, any, any>, a: Annotation): void}[]> = new Map();

/**
 * This function returns the list of mouseover behaviors that are associated with an Annotation object.
 * @param ann
 */
function getMouseoverList<A extends Annotation>(ann: A): {(s: d3.Selection<any, any, any, any>, a: A): void}[] {
    let list = mouseoverBehaviorMap.get(ann.id);
    if (list == undefined) {
        list = [];
        mouseoverBehaviorMap.set(ann.id, list);
    }
    return list;
}

/**
 * This function returns the list of mouseout behaviors that are associated with an Annotation object.
 * @param ann
 */
function getMouseoutList<A extends Annotation>(ann: A): {(s: d3.Selection<any, any, any, any>, a: A): void}[] {
    let list = mouseoutBehaviorMap.get(ann.id);
    if (list == undefined) {
        list = [];
        mouseoutBehaviorMap.set(ann.id, list);
    }
    return list;
}

/**
 * A simple interface to provide a common pattern for defining behavior that should be executed when a SODA glyph is
 * hovered by a user.
 */

export interface HoverConfig<A extends Annotation> {
    /**
     * The Annotation to which a hover behavior will be bound.
     */
    ann: A;
    /**
     * A callback function that will be responsible for executing the mouseover behavior. It will implicitly receive
     * references to both a D3 Selection to the Annotation's representative glyph and the Annotation object itself.
     */
    mouseover: { (s: d3.Selection<any, any, any, any>, a: A): void };
    /**
     * A callback function that will be responsible for executing the mouseout behavior. It will implicitly receive
     * references to both a D3 Selection to the Annotation's representative glyph and the Annotation object itself.
     */
    mouseout: { (s: d3.Selection<any, any, any, any>, a: A): void };
}


/**
 * A utility function to add a hover behavior to a glyph.
 * @param config
 */
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

/**
 * A generic function that is actually routed to the mouseover event on a SODA glyph. When called, it will retrieve the
 * list of mouseover behaviors associated with that glyph, and run the callback function for each behavior.
 * @param selection
 * @param ann
 */

function mouseover<A extends Annotation>(selection: d3.Selection<any, any, any, any>, ann: A): void {
    for (const behavior of getMouseoverList(ann)) {
        behavior(selection, ann);
    }
}

/**
 * A generic function that is actually routed to the mouseover event on a SODA glyph. When called, it will retrieve the
 * list of mouseout behaviors associated with that glyph, and run the callback function for each behavior.
 * @param selection
 * @param ann
 */
function mouseout<A extends Annotation>(selection: d3.Selection<any, any, any, any>, ann: A): void {
    for (const behavior of getMouseoutList(ann)) {
        behavior(selection, ann);
    }
}
