import * as d3 from 'd3';
import { registerZoomBehavior } from "../primitives";
import { Annotation } from "../annotations";
import { ChartBase } from "../charts";
import { isZoomableChart,  ZoomBehavior, ZoomController } from "../plugins/zoom";

// a module that provides an abstracted interface for drawing generic lines in a chart

export interface LineConfig {
    // the class to apply to the svg when it's created
    class: string;
    // a function that extracts the x1 coordinate from an Annotation object
    x1FromAnn(d: Annotation): number;
    // a function that extracts the x2 coordinate from an Annotation object
    x2FromAnn(d: Annotation): number;
    // a function that extracts the y1 coordinate from an Annotation object
    y1FromAnn(d: Annotation): number;
    // a function that extracts the y2 coordinate from an Annotation object
    y2FromAnn(d: Annotation): number;
    // a function that extracts the line color from an Annotation object
    strokeColor?(d: Annotation): string;
    // controls dashed/dotted line parameters
    strokeDashArray?: string;
    // the user can optionally provide a custom ZoomBehavior for the line
    zoom?: ZoomBehavior<d3.Selection<SVGLineElement, Annotation, HTMLElement, any>>;
}

export class DefaultLineZoomBehavior implements ZoomBehavior<d3.Selection<SVGLineElement, Annotation, HTMLElement, any>> {
    // the default ZoomBehavior for a vertical line drawn with this module
    // it moves and stretches the line horizontally
    selector: string;
    x1FromAnn: (d: Annotation) => number;
    x2FromAnn: (d: Annotation) => number;

    constructor(selector: string, x1FromAnn: (d: Annotation) => number, x2FromAnn: (d: Annotation) => number) {
        this.selector = `line.${selector}`;
        this.x1FromAnn = x1FromAnn;
        this.x2FromAnn = x2FromAnn;
    }

    public apply(controller: ZoomController, selection: d3.Selection<SVGLineElement, Annotation, HTMLElement, any>): void {
        selection
            .attr('x1', (d: Annotation) => controller.getZoomedXScale()(this.x1FromAnn(d)))
            .attr('x2', (d: Annotation) => controller.getZoomedXScale()(this.x2FromAnn(d)));
    }
}

export function line(chart: ChartBase<any>, data: Annotation[], conf: LineConfig): void {
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

    // set the position parameters for all lines
    merge
        .attr('x1', (d: Annotation) => chart.getXScale()(conf.x1FromAnn(d)))
        .attr('x2', (d: Annotation) => chart.getXScale()(conf.x2FromAnn(d)))
        .attr('y1', (d: Annotation) => conf.y1FromAnn(d))
        .attr('y2', (d: Annotation) => conf.y2FromAnn(d))

    // remove lines no longer in the visualization
    selection.exit()
        .remove();

    if (isZoomableChart(chart)) {
        // if the chart is zoomable, register the ZoomBehavior for the lines
        registerZoomBehavior(chart, new DefaultLineZoomBehavior(conf.class, conf.x1FromAnn, conf.x2FromAnn));
    }
}
