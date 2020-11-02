import {PrimitiveConfig} from "../primitive-config";
import {SequenceAnnotation} from "../../../annotations/sequence-annotation";
import {Chart} from "../../../charts/chart";

export interface SequenceConfig<A extends SequenceAnnotation, C extends Chart<any>> extends PrimitiveConfig<A, C> {
    x: (a: A, c: C) => number;
    w: (a: A, c: C) => number;
    y: (a: A, c: C) => number;
}
