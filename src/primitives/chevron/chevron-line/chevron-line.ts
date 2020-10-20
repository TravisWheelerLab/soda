import * as d3 from "d3";
import {Chart} from "../../charts/chart";
import {OrientedAnnotation} from "../../annotations/oriented-annotation";
import {isZoomableChart} from "../../plugins/zoom/zoomable-chart";
import {horizontalLine, rectangle, RectangleConfig, registerZoomBehavior} from "../../primitives";
import * as defaults from "../chevron-rectangle/chevron-rectangle-defaults";
import {ChevronLineConfig} from "./chevron-line-config";

function initSvgDefs(selection: d3.Selection<SVGElement, any, HTMLElement, any>): void {
    let defSelection = selection.select('defs');
    if (defSelection.node() == null) {
        selection.append('defs');
    }
}
export function chevronLine<A extends OrientedAnnotation, C extends Chart<any>>(chart: C, ann: A[], conf: ChevronLineConfig<A, C>): void {
    initSvgDefs(chart.svgSelection);

    let patternSelection = chart.svgSelection.select('defs')
        .selectAll<SVGPatternElement, A>('pattern')
        .data(ann, (a) => a.id);

    const patternEnter = patternSelection
        .enter()
        .append('pattern');

    const patternMerge = patternEnter.merge(patternSelection);

    const h: (a: A, c: C) => number = conf.h || defaults.rectHFn;
    const strokeColor = conf.strokeColor || (() => 'black');

    // for every oriented annotation, we create a pattern
    patternEnter
        .attr('class', conf.selector)
        .attr('id', (a) => `chevron-rect-bg-${a.id}`)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('viewBox', (a) => defaults.chevronPatternViewBoxFn(a, h(a, chart)))
        .attr('width', (a) => h(a, chart)/2)
        .attr('height', (a) => h(a, chart))
        .attr('preserveAspectRatio', 'xMinYMid meet');

    // in every pattern, draw the chevrons to indicate the orientation
    patternEnter
        .append('path')
        .attr('d', (a) => defaults.chevronPathDfn(a, h(a, chart)))
        .style('stroke', (a) => strokeColor(a, chart))
        .style('fill-opacity', 0)
        .style('stroke-width', '1');

    // position all of the patterns so that they align with the correct
    // side of the rectangle depending on the alignment orientation
    patternMerge
        .attr('x', (a) => defaults.chevronXFn(a))
        .attr('y', (a) => h(a, chart));

    patternSelection.exit()
        .remove();

    horizontalLine(chart, ann, conf);
    const y = conf.y || (() => 0);

    const rectConf: RectangleConfig<A, C> = {
        selector: conf.selector,
        strokeOpacity: () => 0,
        y: (a, c) => y(a, c) - h(a, c)/2,
        h: h
    };

    const rectSelection = rectangle(chart, ann, rectConf);
    rectSelection
        .style('fill', (a ) => `url(#chevron-rect-bg-${a.id})`);

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the rectangles
        registerZoomBehavior(chart, conf.zoom || new defaults.PatternZoomBehavior(conf.selector));
        // registerZoomBehavior(chart, conf.zoom || new defaults.PatternSwitchZoomBehavior(conf.selector, fillColor));
    }
}
