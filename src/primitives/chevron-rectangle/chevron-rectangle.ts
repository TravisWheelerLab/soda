import * as d3 from "d3";
import {Chart} from "../../charts/chart";
import {OrientedAnnotation} from "../../annotations/oriented-annotation";
import {isZoomableChart} from "../../plugins/zoom/zoomable-chart";
import {rectangle, registerZoomBehavior} from "../../primitives";
import * as defaults from "./chevron-rectangle-defaults";
import {ChevronRectangleConfig} from "./chevron-rectangle-config";

function initSvgDefs(selection: d3.Selection<SVGElement, any, HTMLElement, any>): void {
    let defSelection = selection.select('defs');
    if (defSelection.node() == null) {
        selection.append('defs');
    }
}
export function chevronRectangle<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: ChevronRectangleConfig<A, C>): void {
    initSvgDefs(chart.svgSelection);

    let patternSelection = chart.svgSelection.select('defs')
        .selectAll<SVGPatternElement, A>('pattern')
        .data(ann, (a) => a.id);

    const patternEnter = patternSelection
        .enter()
        .append('pattern');

    const patternMerge = patternEnter.merge(patternSelection);

    const h: (a: A, c: C) => number = conf.h || defaults.rectHFn;
    const fillColor = conf.fillColor || (() => 'black');

    // for every oriented annotation, we create a pattern
    patternEnter
        .attr('class', conf.selector)
        .attr('id', (a) => `chevron-rect-bg-${a.id}`)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('viewBox', (a) => defaults.chevronPatternViewBoxFn(a, h(a, chart)))
        .attr('width', (a) => h(a, chart)/2)
        .attr('height', (a) => h(a, chart))
        .attr('preserveAspectRatio', 'xMinYMid meet');

    // in every pattern, we place a rectangle to get our background color
    patternEnter
        .append('rect')
        .attr('class', 'pattern')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', (a) => h(a, chart)/2)
        .attr('height', (a) => h(a, chart))
        .attr('fill', (a) => fillColor(a, chart));

    // in every pattern, draw the chevrons to indicate the orientation
    patternEnter
        .append('path')
        .attr('d', (a) => defaults.chevronPathDfn(a, h(a, chart)))
        .style('stroke', 'ghostwhite')
        .style('fill-opacity', 0)
        .style('stroke-width', '1');

    // position all of the patterns so that they align with the correct
    // side of the rectangle depending on the alignment orientation
    patternMerge
        .attr('x', (a) => defaults.chevronXFn(a))
        .attr('y', (a) => h(a, chart));

    patternSelection.exit()
        .remove();

    const rectSelection = rectangle(chart, ann, conf);

    rectSelection
        .style('fill', (a ) => {
            if (chart.getSemanticViewRange().width < Infinity) {
                return (`url(#chevron-rect-bg-${a.id})`);
            }
            else {
                return fillColor(a, chart);
            }
        });

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the rectangles
        registerZoomBehavior(chart, conf.zoom || new defaults.PatternZoomBehavior(conf.selector));
        registerZoomBehavior(chart, conf.zoom || new defaults.PatternSwitchZoomBehavior(conf.selector, fillColor));
    }
}
