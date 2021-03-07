import * as d3 from 'd3';
import {Chart} from "../../../charts/chart";
import {PlotAnnotation} from "../../../annotations/plot-annotation";
import {GlyphConfig} from "../glyph-config";
import {Annotation} from "../../../annotations/annotation";

export function getPlotGSelection<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: GlyphConfig): [d3.Selection<SVGGElement, A, any, any>, d3.Selection<SVGGElement, A, any, any>] {
    const outerSelection = chart.svgSelection
        .selectAll<SVGGElement, A>(`g.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    const outerEnter = outerSelection.enter()
        .append('g')
        .attr('class', conf.selector)

    const outerMerge = outerEnter.merge(outerSelection)

    // remove plots no longer in the visualization
    outerSelection.exit()
        .remove();

    return([outerEnter, outerMerge]);
}
