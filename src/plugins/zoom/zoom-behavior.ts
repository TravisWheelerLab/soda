import {Chart} from "../../charts/chart";

// an interface for objects that define how to re-render
// svg elements when a zoom event takes place
export interface ZoomBehavior<C extends Chart<any>, S> {
    // this should be a unique selector to the svg elements
    // that we want to transform on a zoom event
    selector: string;
    // this method takes a selection, which we obtain via the
    // selector and applies the intended behavior to that selection
    apply(chart: C, selection: S): void;
}
