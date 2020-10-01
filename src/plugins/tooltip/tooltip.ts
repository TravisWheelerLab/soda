import * as d3 from 'd3';
import { TooltipConfig } from "./tooltip-config";
import { ChartBase } from '../../charts';
import { Annotation } from '../../annotations';
import { HoverConfig, addHoverBehavior } from "../hover";

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
            .attr('class', 'soda-tooltip')
            .style('background-color', 'lightsteelblue')
            .style('border-radius', '8px')
            .style('padding', '4px')
            .style('position', 'absolute')
            .style('opacity', 0);

        tooltipDivInitialized = true;
        return;
    }
}

export function tooltip<A extends Annotation>(chart: ChartBase<any>, config: TooltipConfig<A>) {
    // the function that actually binds the mouse events to the svg elements
    initTooltipDiv();

    const hoverConf: HoverConfig<A> = {
        ann: config.ann,
        mouseover: (s, a: A) => { defaultTooltipMouseover(a, config.textFromAnn)},
        mouseout: (s, a: A) => { defaultTooltipMouseout() },
    };
    addHoverBehavior(hoverConf);
}

export function defaultTooltipMouseover<A extends Annotation>(a: A, textFromAnn: (a: A) => string): void {
    // this uses the provided function parameter to extract text
    // from the bound Annotation data and draw it in the tooltip
    tooltipSelection.transition()
        .duration(200)
        .style('opacity', .9);

    tooltipSelection.html(textFromAnn(a))
        .style("left", (d3.event.pageX ) + "px")
        .style("top", (d3.event.pageY + 20) + "px");
}

export function defaultTooltipMouseout<A extends Annotation>(): void {
    // this just makes the tooltip disappear
    tooltipSelection.transition()
        .duration(500)
        .style('opacity', 0);

    tooltipSelection
        .html('')
        .style("left", "0px")
        .style("top", "0px")

}
