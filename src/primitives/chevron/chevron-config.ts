import {Annotation} from "../../annotations/annotation";
import {Chart} from "../../charts/chart";
import {PrimitiveConfig} from "../primitive-config";

export enum Orientation {
    Forward = "+",
    Reverse = "-",
}

export interface ChevronPrimitiveConfig<A extends Annotation, C extends Chart<any>> extends PrimitiveConfig<A, C> {
    disableChevronAt?: number;
    // the background parameters define the rectangle used as a background in the pattern
    backgroundH?: (a: A, c: C) => number;
    backgroundFillColor?: (a: A, c: C) => string;
    backgroundFillOpacity?: (a: A, c: C) => number;
    // the chevron parameters define the actual chevron shape used in the pattern
    chevronH?: (a: A, c: C) => number;
    chevronSpacing?: (a: A, c: C) => number;
    chevronFillColor?: (a: A, c: C) => string;
    chevronFillOpacity?: (a: A, c: C) => number;
    chevronStrokeColor?: (a: A, c: C) => string;
    chevronStrokeWidth?: (a: A, c: C) => number;
    chevronStrokeOpacity?: (a: A, c: C) => number;
}
