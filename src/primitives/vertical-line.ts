import * as d3 from 'd3';
import { registerZoomBehavior } from "../primitives";
import { Annotation } from "../annotations";
import { ChartBase } from "../charts";
import { isZoomableChart,  ZoomBehavior, ZoomController } from "../plugins/zoom";

// a module that provides an abstracted interface for drawing vertical line svgs in a chart

export interface VerticalLineConfig {
    // the class to apply to the svg when it's created
    class: string;
    // a function that extracts the x coordinate from an Annotation object
    xFromAnn?(d: Annotation): number;
    // a function that extracts the y1 coordinate from an Annotation object
    y1FromAnn?(d: Annotation): number;
    // a function that extracts the y2 coordinate from an Annotation object
    y2FromAnn?(d: Annotation): number;
    // a function that extracts the line color from an Annotation object
    strokeColor?(d: Annotation): string;
    // controls dashed/dotted line parameters
    strokeDashArray?: string;
    // the user can optionally provide a custom ZoomBehavior for the line
    zoom?: ZoomBehavior<d3.Selection<SVGLineElement, Annotation, HTMLElement, any>>;
}

export class DefaultVerticalLineZoomBehavior implements ZoomBehavior<d3.Selection<SVGLineElement, Annotation, HTMLElement, any>> {
    // the default ZoomBehavior for a vertical line drawn with this module
    // it just moves the line horizontally
    selector: string;
    xFromAnn: (d: Annotation) => number;

    constructor(selector: string, xFromAnn: (d: Annotation) => number) {
        this.selector = `line.${selector}`;
        this.xFromAnn = xFromAnn;
    }

    public apply(controller: ZoomController, selection: d3.Selection<SVGLineElement, Annotation, HTMLElement, any>): void {
        selection
            .attr('x1', (d: Annotation) => controller.getZoomedXScale()(this.xFromAnn(d)))
            .attr('x2', (d: Annotation) => controller.getZoomedXScale()(this.xFromAnn(d)));
    }
}

export function verticalLine(chart: ChartBase<any>, data: Annotation[], conf: VerticalLineConfig): void {
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
    });

    let xFromAnn: (d: Annotation) => number;
    if (conf.xFromAnn !== undefined) {
        xFromAnn = conf.xFromAnn;
    } 
    else {
        xFromAnn = (d: Annotation) => (d.getX() + d.getW() / 2); 
    }

    // set the position parameters for all lines
    merge
        .attr('x1', (d: Annotation) => chart.getXScale()(xFromAnn(d)))
        .attr('x2', (d: Annotation) => chart.getXScale()(xFromAnn(d)))
        .attr('y1', (d: Annotation) => d.y * chart.binHeight)
        .attr('y2', (d: Annotation) => d.y * chart.binHeight + 10);

    // remove lines no longer in the visualization
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the lines
        registerZoomBehavior(chart, new DefaultVerticalLineZoomBehavior(conf.class, xFromAnn));
    }
}
