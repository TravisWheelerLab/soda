import {OrientedAnnotation} from "../../annotations/oriented-annotation";
import {Chart} from "../../charts/chart";
import {RectangleConfig} from "../rectangle/rectangle-config";

export interface ChevronRectangleConfig<A extends OrientedAnnotation, C extends Chart<any>> extends RectangleConfig<A, C> {}
