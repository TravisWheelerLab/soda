import * as d3 from 'd3';
import { registerZoomBehavior } from "../primitives";
import { Annotation } from "../annotations";
import { ChartBase } from "../charts";
import { mapIdToSelection } from "../plugins/id-map";
import { isZoomableChart,  ZoomBehavior, ZoomController } from "../plugins/zoom";

// a module that provides an abstracted interface for drawing rectangles in a chart

export interface RectangleConfig {
    // the class to apply to the svg when it's created
    class: string;
    // functions to extract drawing coordinates from an Annotation
    yFromAnn?(d: Annotation): number;
    xFromAnn?(d: Annotation): number;
    wFromAnn?(d: Annotation): number;
    hFromAnn?(d: Annotation): number;
    strokeWidth?: number;
    // a function to extract the outline color from an Annotation
    strokeColor?(d: Annotation): string;
    strokeOpacity?: number;
    // a function to extract the fill color from an Annotation
    fillColor?(d: Annotation): string;
    // the user can optionally provide a custom ZoomBehavior for the line
    zoom?: ZoomBehavior<d3.Selection<SVGRectElement, Annotation, HTMLElement, any>>;
}

export class DefaultRectZoomBehavior implements ZoomBehavior<d3.Selection<SVGRectElement, Annotation, HTMLElement, any>> {
    // the default zoom behavior for a rectangle
    // it basically just allows stretching/panning in the horizontal direction
    selector: string;

    constructor(selector: string) {
        this.selector = `rect.${selector}`;
    }

    public apply(controller: ZoomController, selection: d3.Selection<SVGRectElement, Annotation, HTMLElement, any>): void {
        selection
            .attr('x', (d: Annotation) => controller.getZoomedXScale()(d.getX()))
            .attr('width', (d: Annotation) => ( controller.getXScale()(d.getX() + d.getW()) - controller.getXScale()(d.getX()) ) * controller.transform.k);
    }
}

export function rectangle(chart: ChartBase<any>, data: Annotation[], conf: RectangleConfig): void {
    // the function that takes Annotation data and draws rectangles in the dom

    // bind the data to rectangles
    const selection = chart.svgSelection
        .selectAll<SVGRectElement, Annotation>(`rect.${conf.class}`)
        .data(data, (d: Annotation) => d.id);

    const enter = selection.enter()
        .append('rect');
    const merge = enter.merge(selection);

    // set the constant parameters
    enter
        .attr('class', conf.class)
        .style('stroke-width', () => {
            if (conf.strokeWidth !== undefined) {
                return conf.strokeWidth;
            }
            else {
                return 1;
            }
        })
        .style('stroke-opacity', () => {
            if (conf.strokeOpacity!== undefined) {
                return conf.strokeOpacity;
            }
            else {
                return 1;
            }
        })
        .style('stroke', (d: Annotation) => {
            if (conf.strokeColor !== undefined) {
                return (conf.strokeColor(d));
            } else {
                return ('black');
            }
        })
        .style('fill', (d: Annotation) => {
            if (conf.fillColor !== undefined) {
                return (conf.fillColor(d));
            }
            else {
                return ('black');
            }
        });

    let xFromAnn: (d: Annotation) => number;
    if (conf.xFromAnn !== undefined) {
        xFromAnn = conf.xFromAnn;
    }
    else {
        xFromAnn = (d: Annotation) => chart.getXScale()(d.x) + 2;
    }

    let yFromAnn: (d: Annotation) => number;
    if (conf.yFromAnn !== undefined) {
        yFromAnn = conf.yFromAnn;
    }
    else {
        yFromAnn = (d: Annotation) => d.y * chart.binHeight + 2;
    }

    let wFromAnn: (d: Annotation) => number;
    if (conf.wFromAnn !== undefined) {
        wFromAnn = conf.wFromAnn;
    }
    else {
        wFromAnn = (d: Annotation) => chart.getXScale()(d.getX() + d.getW()) - chart.getXScale()(d.getX() - 4)
    }

    let hFromAnn: (d: Annotation) => number;
    if (conf.hFromAnn !== undefined) {
        hFromAnn = conf.hFromAnn;
    }
    else {
        hFromAnn = (d: Annotation) => chart.binHeight - 4;
    }

    // set the position parameters
    merge
        .attr('x', (d: Annotation) => xFromAnn(d))
        .attr('y', (d: Annotation) => yFromAnn(d))
        .attr('width', (d: Annotation) => wFromAnn(d))
        .attr('height', (d: Annotation) => hFromAnn(d));

    // for all of the rectangles remaining, update the id->d3 selection map
    merge
        .each((d, i, nodes) => {
            mapIdToSelection(d.id, d3.select(nodes[i]));
        });

    // remove rectangles that are no longer in the chart
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the rectangles
        registerZoomBehavior(chart, new DefaultRectZoomBehavior(conf.class));
    }
}
