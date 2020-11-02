import {OrientedAnnotation} from "../../../../annotations/oriented-annotation";
import {Chart} from "../../../../charts/chart";
import {HorizontalLineConfig} from "../../line/line-config";
import {ChevronPrimitiveConfig} from "../chevron-config";

export interface ChevronLineConfig<A extends OrientedAnnotation, C extends Chart<any>> extends ChevronPrimitiveConfig<A, C>, HorizontalLineConfig<A, C> {
    h?: (a: A, c: C) => number;
}
