import * as d3 from "d3";
import {Chart} from "../../../charts/chart";
import {Annotation} from "../../../annotations/annotation";
import {mapIdToSelection} from "../../../plugins/id-map";
import {isZoomableChart} from "../../zoom/zoomable-chart";
import * as defaults from "./rectangle-defaults";
import {RectangleConfig} from "./rectangle-config";
import {registerZoomBehavior} from "../../zoom/zoom-utilities";

export function rectangleGlyph<A extends Annotation, C extends Chart<any>>(chart: C, ann: A[], conf: RectangleConfig<A, C>): d3.Selection<SVGRectElement, A, HTMLElement, any> {
    // the function that takes Annotation data and draws rectangles in the DOM

    // bind the data to rectangles
    const selection = chart.svgSelection
        .selectAll<SVGRectElement, A>(`rect.${conf.selector}`)
        .data(ann, (a: A) => a.id);

    const enter = selection.enter()
        .append('rect');

    const merge = enter.merge(selection);

    const strokeWidth = conf.strokeWidth || (() => 1);
    const strokeOpacity = conf.strokeOpacity || (() => 1);
    const strokeColor = conf.strokeColor || (() => 'black');
    const fillColor = conf.fillColor || (() => 'black');

    // set the constant style parameters
    enter
        .attr('class', conf.selector)
        .style('stroke-width', (a: A) => strokeWidth(a, chart))
        .style('stroke-opacity', (a: A) => strokeOpacity(a, chart))
        .style('stroke', (a: A) => strokeColor(a, chart))
        .style('fill', (a: A) => fillColor(a, chart));

    const x: (a: A, c: C) => number = conf.x || defaults.rectXFn;
    const y: (a: A, c: C) => number = conf.y || defaults.rectYFn;
    const w: (a: A, c: C) => number = conf.w || defaults.rectWFn;
    const h: (a: A, c: C) => number = conf.h || defaults.rectHFn;

    // set the position parameters
    merge
        .attr('x', (a: A) => chart.getXScale()(x(a, chart)))
        .attr('y', (a: A) => y(a, chart))
        .attr('width', (a: A) => chart.getXScale()(x(a, chart) + w(a, chart)) - chart.getXScale()(x(a, chart)))
        .attr('height', (a: A) => h(a, chart));

    // for all of the rectangles remaining, update the id->d3 selection map
    merge
        .each((a, i, nodes) => {
            mapIdToSelection(a.id, d3.select(nodes[i]));
        });

    // remove rectangles that are no longer in the chart
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the rectangles
        registerZoomBehavior(chart, conf.zoom || new defaults.RectZoomBehavior(conf.selector, x, w));
    }

    return merge;
}
