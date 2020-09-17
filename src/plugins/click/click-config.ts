import * as d3 from "d3";
import { Annotation } from "../../annotations/annotation";

export interface ClickConfig<A extends Annotation> {
    ann: A;
    click: {(s: d3.Selection<any, any, any, any>, a: A): void};
}
