import * as d3 from 'd3';
import { TooltipConfig } from "./tooltip-config";
import { ChartBase } from '../../charts';
import { Annotation } from '../../annotations';
// this module provides a generic process by which we can bind a text tooltip
// to any svg elements that have Annotation data bound to them

// TODO: is this a good way to handle this initialization?
// we set this flag after we have injected a tooltip div into the dom
let tooltipDivInitialized: boolean = false;
// after we have injected the tooltip div, we maintain a reference to its d3 selection
let tooltipSelection: d3.Selection<any, any, any, any>;

function initTooltipDiv(): void {
    // inject the div we'll use as the tooltip into the dom
    if (!tooltipDivInitialized) {
        tooltipSelection = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('background-color', 'lightsteelblue')
            .style('border-radius', '8px')
            .style('position', 'absolute')
            .style('opacity', 0);

        tooltipDivInitialized = true;
        return;
    }
}

export function tooltip<A extends Annotation>(chart: ChartBase<any>, config: TooltipConfig<A>) {
    // the function that actually binds the mouse events to the svg elements
    initTooltipDiv();

    // get a selection to the svg elements defined by the provided selector
    // we make this selection within the provided chart to prevent accidental
    // tooltips added to other charts
    let selection = chart.svgSelection
        .selectAll<d3.BaseType, A>(config.selector);

    // bind the mouseover event
    selection.on('mouseover', (d: A) => {
        if (config.mouseover == undefined) {
            // use the default tooltip function
            defaultTooltipMouseover(d, config.textFromAnn)
        }
        else {
            // we optionally allow the user to provide an arbitrary tooltip function
            config.mouseover(d)
        }
    });

    // bind the mouseout event
    selection.on('mouseout', (d: A) => {
        if (config.mouseout == undefined) {
            // use the default tooltip function
            defaultTooltipMouseout()
        }
        else {
            // we optionally allow the user to provide an arbitrary tooltip function
            config.mouseout(d)
        }
    });
}

export function defaultTooltipMouseover<A extends Annotation>(d: A, textFromAnn: (d: A) => string): void {
    // this uses the provided function parameter to extract text
    // from the bound Annotation data and draw it in the tooltip
    tooltipSelection.transition()
        .duration(200)
        .style('opacity', .9);

    tooltipSelection.html(textFromAnn(d))
        .style("left", (d3.event.pageX ) + "px")
        .style("top", (d3.event.pageY + 20) + "px");
}

export function defaultTooltipMouseout<A extends Annotation>(): void {
    // this just makes the tooltip disappear
    tooltipSelection.transition()
        .duration(500)
        .style('opacity', 0);
}
