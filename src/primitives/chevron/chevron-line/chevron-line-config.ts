import {OrientedAnnotation} from "../../../annotations/oriented-annotation";
import {Chart} from "../../../charts/chart";
import {HorizontalLineConfig} from "../../line/line-config";

export interface ChevronLineConfig<A extends OrientedAnnotation, C extends Chart<any>> extends HorizontalLineConfig<A, C> {
    h?: (a: A, c: C) => number;
}
