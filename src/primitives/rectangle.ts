import * as d3 from 'd3';
import { registerZoomBehavior } from "../primitives";
import { Annotation } from "../annotations";
import { ChartBase } from "../charts";
import { isZoomableChart,  ZoomBehavior, ZoomController } from "../plugins/zoom";

// a module that provides an abstracted interface for drawing rectangles in a chart

export interface RectangleConfig {
    // the class to apply to the svg when it's created
    class: string;
    // a function to extract the outline color from an Annotation
    strokeColor?(d: Annotation): string;
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
        .style('stroke-width', 1)
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

    // set the position parameters
    merge
        .attr('x', (d: Annotation) => chart.getXScale()(d.getX()))
        .attr('y', (d: Annotation) => d.y * chart.binHeight)
        .attr('width', (d: Annotation) => chart.getXScale()(d.getX() + d.getW()) - chart.getXScale()(d.getX()))
        .attr('height', (d: Annotation) => chart.binHeight/2)

    // remove rectangles that are no longer in the chart
    selection.exit()
        .remove();
            
    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the rectangles
        registerZoomBehavior(chart, new DefaultRectZoomBehavior(conf.class));
    }
}