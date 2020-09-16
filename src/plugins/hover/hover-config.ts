import * as d3 from "d3";
import { Annotation } from "../../annotations/annotation";

export interface HoverConfig<A extends Annotation> {
    ann: A;
    mouseover: {(s: d3.Selection<any, any, any, any>, a: A): void};
    mouseout: {(s: d3.Selection<any, any, any, any>, a: A): void};
}
