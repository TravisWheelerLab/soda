export {rectHFn} from "../rectangle/rectangle-defaults";
import {OrientedAnnotation} from "../../annotations/oriented-annotation";

export const chevronPathDfn = <A extends OrientedAnnotation>(a: A, h: number) => {
    return (a.orientation == '>' || a.orientation == '+') ? forwardChevronPathFn(a, h) : reverseChevronPathFn(a, h);
};
export const forwardChevronPathFn = <A extends OrientedAnnotation>(a: A, h: number) => `M${h/2},0 L0,${h/2} L${h/2},${h}`;
export const reverseChevronPathFn = <A extends OrientedAnnotation>(a: A, h: number) => `M$0,0 L${h/2},${h/2} L0,${h}`;

export const chevronXFn = <A extends OrientedAnnotation>(a: A) => {
    return (a.orientation == '>' || a.orientation == '+') ? forwardChevronXFn(a) : reverseChevronXFn(a);
}
export const forwardChevronXFn  = <A extends OrientedAnnotation>(a: A) => a.getX();
export const reverseChevronXFn  = <A extends OrientedAnnotation>(a: A) => a.getX() + a.getW();

export const chevronPatternViewBoxFn = <A extends OrientedAnnotation>(a: A, h: number) => `0,0,${h/2},${h}`;
