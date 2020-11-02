import {Annotation} from "../../annotations/annotation";
import {Chart} from "../../charts/chart";

export interface PrimitiveConfig<A extends Annotation, C extends Chart<any>> {
    selector: string;
}
