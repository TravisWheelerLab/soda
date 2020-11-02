import * as d3 from 'd3';
import {TooltipConfig} from "./tooltip-config";
import {Chart} from '../../charts';
import {Annotation} from '../../annotations';
import {HoverConfig, addHoverBehavior} from "../hover";
import * as defaults from "./tooltip-defaults";

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

export function tooltip<A extends Annotation, C extends Chart<any>>(chart: C, config: TooltipConfig<A, C>) {
    // the function that actually binds the mouse events to the svg elements
    initTooltipDiv();

    const hoverConf: HoverConfig<A> = {
        ann: config.ann,
        mouseover: (s, a: A) => { defaultTooltipMouseover(a, chart, config)},
        mouseout: () => { defaultTooltipMouseout() },
    };
    addHoverBehavior(hoverConf);
}

// export function defaultTooltipMouseover<A extends Annotation>(a: A, text: (a: A) => string): void {
export function defaultTooltipMouseover<A extends Annotation, C extends Chart<any>>(a: A, c: C, config: TooltipConfig<A, C>): void {
    // this uses the provided function parameter to extract text
    // from the bound Annotation data and draw it in the tooltip
    const opacity = config.opacity || defaults.tooltipOpacity;
    const backgroundColor = config.backgroundColor || defaults.tooltipBackgroundColor;
    const textColor = config.textColor || defaults.tooltipTextColor;
    const borderRadius = config.borderRadius|| defaults.tooltipBorderRadius;
    const padding = config.padding || defaults.tooltipPadding;

    tooltipSelection
        .style('background-color', backgroundColor(a, c))
        .style('border-radius', borderRadius(a, c) + "px")
        .style('padding', padding(a, c) + "px")
        .transition()
        .duration(200)
        .style('opacity', opacity(a, c));

    tooltipSelection.html(config.text(a, c))
        .style('color', textColor(a, c))
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
