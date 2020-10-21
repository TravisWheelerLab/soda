import {SequenceAnnotation} from "../../annotations/sequence-annotation";
import {Chart} from "../../charts/chart";
import {SequenceConfig} from "./sequence-config";

export function sequence<A extends SequenceAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: SequenceConfig<A, C>) {
    let x: (a: A, c: C) => number = conf.x;
    let w: (a: A, c: C) => number = conf.w;
    let y: (a: A, c: C) => number = conf.y;

    const selection = chart.svgSelection
        .selectAll<SVGGElement, A>(`g.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    const enter = selection.enter()
        .append('g')
        .attr('transform', (a) => `translate(${chart.getXScale()(x(a, chart))},${y(a, chart)})`);

    const merge = enter.merge(selection);

    enter
        .selectAll('rect')
        .data((a) => a.characters)
        .enter()
            .append('text')
            // .attr('fill', 'black')
            .text((c) => c.char)
            .attr('y', 0)
            // .attr('y', (c) => c.y * chart.binHeight)
            .attr('x', (c) => chart.getXScale()(c.x))
            .style('text-anchor', 'middle')
            // .attr('height', chart.binHeight)
            // .attr('width', chart.getXScale()(1));

    // set the position parameters
    merge
        .attr('x', (a: A) => chart.getXScale()(x(a, chart)))
        .attr('y', (a: A) => y(a, chart));

    // remove text that is no longer in the chart
    selection.exit()
        .remove();

}
