import * as d3 from 'd3';
import { registerZoomBehavior } from "../primitives";
import { Annotation } from "../annotations";
import { ChartBase } from "../charts";
import { isZoomableChart,  ZoomBehavior, ZoomController } from "../plugins/zoom";

// a module that provides an abstracted interface for drawing horizontal line svgs in a chart

export interface HorizontalLineConfig {
    // the class to apply to the svg when it's created
    class: string;
    // a function that extracts the x1 coordinate from an Annotation object
    x1FromAnn?(d: Annotation): number;
    // a function that extracts the x2 coordinate from an Annotation object
    x2FromAnn?(d: Annotation): number;
    // a function that extracts the y coordinate from an Annotation object
    yFromAnn?(d: Annotation): number;
    // a function that extracts the line color from an Annotation object
    strokeColor?(d: Annotation): string;
    // controls dashed/dotted line parameters
    strokeDashArray?: string;
    // the user can optionally provide a custom ZoomBehavior for the line
    zoom?: ZoomBehavior<d3.Selection<SVGLineElement, Annotation, HTMLElement, any>>;
}

export class DefaultHorizontalLineZoomBehavior implements ZoomBehavior<d3.Selection<SVGLineElement, Annotation, HTMLElement, any>> {
    // the default ZoomBehavior for a vertical line drawn with this module
    // it just moves and stretches the line horizontally
    selector: string;
    
    constructor(selector: string) {
        this.selector = `line.${selector}`;
    }

    public apply(controller: ZoomController, selection: d3.Selection<SVGLineElement, Annotation, HTMLElement, any>): void {
        selection
            .attr('x1', (d: Annotation) => controller.getZoomedXScale()(d.getX()))
            .attr('x2', (d: Annotation) => controller.getZoomedXScale()(d.getX() + d.getW()));
    }
}

export function horizontalLine(chart: ChartBase<any>, data: Annotation[], conf: HorizontalLineConfig): void {
    // TODO: rewrite this to use the generic line()

    // bind the provided data to new svg lines
    const selection = chart.svgSelection
      .selectAll<SVGLineElement, Annotation>(`line.${conf.class}`)
        .data(data, (d: Annotation) => d.id);

    const enter = selection.enter()
        .append('line');

    const merge = enter.merge(selection);

    // set the constant line parameters from the conf
    enter
        .attr('class', conf.class)
        .style('stroke-width', 1)
        .style("stroke-dasharray", (d: Annotation) => {
            if (conf.strokeDashArray !== undefined) {
                return (conf.strokeDashArray);
            }
            else {
                return "";
            }
        })
        .style('stroke', (d: Annotation) => {
        if (conf.strokeColor !== undefined) {
            return (conf.strokeColor(d)); 
        }
        else {
            return ('black');
        }
    })
    
    let yFromAnn: (d: Annotation) => number;
    if (conf.yFromAnn !== undefined) {
        yFromAnn = conf.yFromAnn;
    } 
    else {
        yFromAnn = (d: Annotation) => d.y * chart.binHeight + 5;
    } 

    // set the position parameters for all lines
    merge
        .attr('x1', (d: Annotation) => chart.getXScale()(d.getX()))
        .attr('x2', (d: Annotation) => chart.getXScale()(d.getX() + d.getW()))
        .attr('y1', (d: Annotation) => yFromAnn(d))
        .attr('y2', (d: Annotation) => yFromAnn(d))

    // remove lines no longer in the visualization
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the lines
        registerZoomBehavior(chart, new DefaultHorizontalLineZoomBehavior(conf.class));
    }
}

