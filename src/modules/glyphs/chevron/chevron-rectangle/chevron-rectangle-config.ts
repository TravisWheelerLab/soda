import {OrientedAnnotation} from "../../../../annotations/oriented-annotation";
import {Chart} from "../../../../charts/chart";
import {RectangleConfig} from "../../rectangle/rectangle-config";
import {ChevronPrimitiveConfig} from "../chevron-config";

export interface ChevronRectangleConfig<A extends OrientedAnnotation, C extends Chart<any>> extends ChevronPrimitiveConfig<A, C>, RectangleConfig<A, C> {}
