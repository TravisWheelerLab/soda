import * as d3 from 'd3';
import {getSelectionById} from '../id-map/id-map';
import {Annotation} from "../../annotations/annotation";

/**
 * @hidden
 */
const mouseoverBehaviorMap: Map<string, {(s: d3.Selection<any, any, any, any>, a: Annotation): void}[]> = new Map();
/**
 * @hidden
 */
const mouseoutBehaviorMap: Map<string, {(s: d3.Selection<any, any, any, any>, a: Annotation): void}[]> = new Map();

/**
 * @hidden
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
 * @hidden
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
 * Add a hover behavior to a list of glyphs.
 * @param ann
 * @param config
 */
export function hoverBehavior<A extends Annotation>(ann: A[], config: HoverConfig<A>): void {
    for (const a of ann) {
        let mouseoverList = getMouseoverList(a);
        mouseoverList.push(config.mouseover);
        let mouseoutList = getMouseoutList(a);
        mouseoutList.push(config.mouseout);

        let selection = getSelectionById(a.id);
        // we bind every svg that has a hover parameter to the same mouseover
        // and mouseout functions
        selection
            .on('mouseover', (a: Annotation) => mouseover(selection, a))
            .on('mouseout', (a: Annotation) => mouseout(selection, a));
    }
}

/**
 * @hidden
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
 * @hidden
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
