import * as d3 from 'd3';
import {getSelectionById} from '../id-map/id-map';
import {Annotation} from "../../annotations/annotation";

/**
 * @hidden
 */
const clickBehaviorMap: Map<string, {(s: d3.Selection<any, any, any, any>, a: Annotation): void}[]> = new Map();

/**
 * This function returns the list of click behaviors that are associated with an Annotation object.
 * @param ann
 */
function getClickList<A extends Annotation>(ann: A): {(s: d3.Selection<any, any, any, any>, a: A): void}[] {
    let list = clickBehaviorMap.get(ann.id);
    if (list == undefined) {
        list = [];
        clickBehaviorMap.set(ann.id, list);
    }
    return list;
}

/**
 * A simple interface to provide a common pattern for defining behavior that should be executed when a SODA glyph is
 * clicked by a user.
 */
export interface ClickConfig<A extends Annotation> {
    /**
     * A callback function that will be responsible for executing the click behavior. It will implicitly receive
     * references to both a D3 Selection to the Annotation's representative glyph and the Annotation object itself.
     */
    click: { (s: d3.Selection<any, any, any, any>, a: A): void };
}

/**
 * Add a click behavior to a list of glyphs.
 * @param ann
 * @param config
 */
export function clickBehavior<A extends Annotation>(ann: A[], config: ClickConfig<A>): void {
    for (const a of ann) {
        let clickList = getClickList(a);
        clickList.push(config.click);

        let selection = getSelectionById(a.id);
        // we bind every svg that has a click parameter to the same click function
        selection
            .on('click', (a: Annotation) => click(selection, a));
    }
}

/**
 * A generic function that is actually routed to the click event on a SODA glyph. When called, it will retrieve the
 * list of click behaviors associated with that glyph, and run the callback function for each behavior.
 * @param selection
 * @param ann
 */
function click<A extends Annotation>(selection: d3.Selection<any, any, any, any>, ann: A): void {
    for (const behavior of getClickList(ann)) {
        behavior(selection, ann);
    }
}
