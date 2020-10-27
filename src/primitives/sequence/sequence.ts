import {CharacterDatum, SequenceAnnotation} from "../../annotations/sequence-annotation";
import {Chart} from "../../charts/chart";
import {SequenceConfig} from "./sequence-config";
import * as defaults from "./sequence-defaults";
import {isZoomableChart} from "../../plugins/zoom/zoomable-chart";
import {registerZoomBehavior} from "../../primitives";

export function sequence<A extends SequenceAnnotation, D extends CharacterDatum, C extends Chart<any>>(chart: C, ann: A[], conf: SequenceConfig<A, C>) {
    let x: (a: A, c: C) => number = conf.x || defaults.sequenceXFn;
    // let w: (a: A, c: C) => number = conf.w;
    let y: (a: A, c: C) => number = conf.y || defaults.sequenceYFn ;

    const selection = chart.svgSelection
        .selectAll<SVGGElement, A>(`g.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    const enter = selection.enter()
        .append('g')
        .attr('class', conf.selector)
        // .attr('transform', (a) => `translate(${chart.getXScale()(x(a, chart))},${y(a, chart)})`);
        .attr('transform', (a) => `translate(0,${y(a, chart)})`);

    const merge = enter.merge(selection);

    enter
        .selectAll('rect')
        .data((a) => a.characters)
        .enter()
            .append('text')
            .attr('class', conf.selector)
            .text((c) => c.char)
            .attr('y', 0)
            .attr('x', (d) => chart.getXScale()(d.x))
            .style('text-anchor', 'middle');

    // set the position parameters
    merge
        .attr('x', (a: A) => chart.getXScale()(x(a, chart)))
        .attr('y', (a: A) => y(a, chart));

    // remove text that is no longer in the chart
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the text
        // registerZoomBehavior(chart, new defaults.SequenceZoomBehavior(conf.selector, x, y));
        registerZoomBehavior(chart, new defaults.SequenceCharacterZoomBehavior(conf.selector));
    }
}
