import * as d3 from "d3";

// Stub interface for the `Transform` class in D3, which
// doesn't appear to be exported from the D3 types package.
export interface Transform {
    // TODO: document
    k: number;
    x: number;
    y: number;
    rescaleX(scale: d3.ScaleLinear<number, number>): d3.ScaleLinear<number, number>;
}
