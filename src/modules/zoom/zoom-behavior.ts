import * as d3 from "d3";
import {Chart} from "../../charts/chart";

// an interface for objects that define how to re-render
// svg elements when a zoom event takes place
/**
 * An interface that serves to provide a common pattern for defining unique re-rendering behavior for distinct
 * groups of glyphs rendered with SODA.
 *
 * @typeParam C A ZoomBehavior should be typed with the Chart extension that it will be applied in. This provides the
 * re-rendering function with any properties of that target Chart extension that may be necessary to appropriately
 * re-render the glyphs.
 * @typeParam S A ZoomBehavior should be typed with the type of D3 selection that it is intended to be applied to.
 * This may help illuminate errors that could occur when the ZoomBehavior is inadvertently applied to a D3 selection
 * to the wrong glyphs/DOM elements.
 */
export interface ZoomBehavior<C extends Chart<any>, S extends d3.Selection<any, any, any, any>> {
    /**
     * The selector string is used as an argument to d3.selectAll(), and it should be unique such that selectAll()
     * returns a D3 selection only to the ZoomBehavior's intended target glyphs.
     */
    selector: string;
    /**
     * Typically, a ZoomBehavior will make a D3 selection using the ZoomBehaviors selector property as an argument,
     * then call apply() with the target Chart and the selection as arguments. This function should be responsible
     * for making any necessary changes to the attributes and style of the DOM elements in that selection.
     * @param chart The Chart in which the target glyphs have been rendered.
     * @param selection A D3 selection to the target glyphs.
     */
    apply(chart: C, selection: S): void;
}
