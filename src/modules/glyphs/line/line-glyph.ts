import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {Annotation} from "../../../annotations/annotation";
import {mapIdToSelection} from "../../../plugins/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";
import * as defaults from "./line-defaults";
import {LineConfig, VerticalLineConfig, HorizontalLineConfig} from "./line-config";

// a module that provides an abstracted interface for drawing generic lines in a chart

// a module that provides an abstracted interface for drawing generic lines in a chart

export function verticalLine<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: VerticalLineConfig<A, C>): void {
    const lineConfig: LineConfig<A, C> = {
        selector: conf.selector,
        strokeColor: conf.strokeColor,
        strokeDashArray: conf.strokeDashArray,
        strokeOpacity: conf.strokeOpacity,
        strokeWidth: conf.strokeWidth,
        x1: conf.x || defaults.verticalLineXFn,
        x2: conf.x || defaults.verticalLineXFn,
        y1: conf.y1 || defaults.verticalLineY1Fn,
        y2: conf.y2 || defaults.verticalLineY2Fn,
        zoom: conf.zoom,
    };
    lineGlyph(chart, ann, lineConfig);
}

export function horizontalLine<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: HorizontalLineConfig<A, C>): void {
    const lineConfig: LineConfig<A, C> = {
        selector: conf.selector,
        strokeColor: conf.strokeColor,
        strokeDashArray: conf.strokeDashArray,
        strokeOpacity: conf.strokeOpacity,
        strokeWidth: conf.strokeWidth,
        x1: conf.x1 || defaults.horizontalLineX1Fn,
        x2: conf.x2 || defaults.horizontalLineX2Fn,
        y1: conf.y || defaults.horizontalLineYFn,
        y2: conf.y || defaults.horizontalLineYFn,
        zoom: conf.zoom,
    };
    lineGlyph(chart, ann, lineConfig);
}


export function lineGlyph<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: LineConfig<A, C>): void {
    // bind the provided data to new svg lines
    const selection = chart.svgSelection
      .selectAll<SVGLineElement, A>(`line.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    const enter = selection.enter()
        .append('line');

    const merge = enter.merge(selection);

    const strokeWidth = conf.strokeWidth || (() => 1);
    const strokeOpacity = conf.strokeOpacity || (() => 1);
    const strokeColor = conf.strokeColor || (() => 'black');
    const strokeDashArray = conf.strokeDashArray || (() => "");

    // set the constant style parameters
    enter
        .attr('class', conf.selector)
        .style('stroke-width', (a: A) => strokeWidth(a, chart))
        .style('stroke-opacity', (a: A) => strokeOpacity(a, chart))
        .style('stroke-dasharray', (a: A) => strokeDashArray(a, chart))
        .style('stroke', (a: A) => strokeColor(a, chart));

    // set the position parameters
    merge
        .attr('x1', (a: A) => chart.getXScale()(conf.x1(a, chart)))
        .attr('x2', (a: A) => chart.getXScale()(conf.x2(a, chart)))
        .attr('y1', (a: A) => conf.y1(a, chart))
        .attr('y2', (a: A) => conf.y2(a, chart));

    // for all of the lines remaining, update the id->d3 selection map
    merge
        .each((a, i, nodes) => {
            mapIdToSelection(a.id, d3.select(nodes[i]));
        });

    // remove lines no longer in the visualization
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the lines
        registerZoomBehavior(chart, conf.zoom || new defaults.LineZoomBehavior(conf.selector, conf.x1, conf.x2));
    }
}
