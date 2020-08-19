import * as d3 from 'd3';
import { ChartBase } from '../../charts';
import { Plugin } from '../plugin';

export class RuleController implements Plugin {
    // a list of components that the controller is controlling rules for
    components: ChartBase<any>[];
    // the current component that is being hovered by the user
    activeComponent?: ChartBase<any>;

    constructor() {
        this.components = [];
        this.activeComponent = undefined;
    }

    public alert(): void {
        // this is called by registered components any time an event that the controller
        // should know about occurs. the alert system will probably be expanded on and
        // generalized more later on
        this.updateRuleSize();
    }

    public addComponent(component: ChartBase<any>) {
        this.components.push(component);
        component.plugins.push(this);
        // actually create the rule
        verticalRule(component);
        // create the tooltip that will display the chromosome position currently hovered
        ruleTooltip(component);
        component.svgSelection
            .on('mousemove', () => this.chartMouseMove(component))
    }

    public chartMouseMove(chart: ChartBase<any>) {
        // this is called any time the mouse moves on a chart
        // set the active component
        this.activeComponent = chart;
        // then defer to the function that will actually move the rules
        this.moveRule();
    }

    public moveRule(): void {
        let mouseX = d3.event.pageX;
        let mouseY = d3.event.pageY;

        for (const comp of this.components) {
            // move the rules
            d3.select(comp.selector)
                .selectAll('div.vertical-rule')
                .style('left', (mouseX + 5) + 'px');

            // we need to figure out where the svg is actually sitting in the absolute
            // coordinate system so that we can figure out the position of the rule
            // relative to the chromosome coordinate system
            const compSvgDims = comp.getSvgDimensions();
            let tooltipText = Math.round(comp.getXScale().invert(mouseX - compSvgDims.x + 5));
            d3.select(comp.selector)
                .selectAll('div.rule-tooltip')
                .style('opacity', () => {
                    // we'll hide the tooltip for every component except the active one
                    if (this.activeComponent == comp) {
                        return (1);
                    }
                    else {
                        return (0);
                    }
                })
                .style('top', (mouseY - 20) + 'px')
                .style('left', (mouseX + 10) + 'px')
                .html(tooltipText.toString());
        }
    }

    public updateRuleSize(): void {
        // whenever the charts resize themselves, we need to
        // resize the rules too
        for (const comp of this.components) {
            let containerDims = comp.getContainerDimensions();
            let top = containerDims.y;
            d3.select(comp.selector)
                .selectAll('div.vertical-rule')
                .style('height', comp.height + 'px')
                .style('top', top + 'px')
        }
    }
}

export function ruleTooltip(chart: ChartBase<any>) {
    // a utility function to create the div for a rule tooltip
    d3.select(chart.selector)
      .append('div')
        .attr('class', 'rule-tooltip')
        .style('position', 'absolute')
        .style('border-radius', '8px')
        .style('background', 'lightsteelblue')
        .style('opacity', 0);
}

export function verticalRule(chart: ChartBase<any>) {
    // a utility function to create the div for a vertical rule
    let containerDims = chart.getContainerDimensions();
    let top = containerDims.y;
    d3.select(chart.selector)
      .append('div')
        .attr('class', 'vertical-rule')
        .style('height', chart.height + 'px')
        .style('top', top + 'px')
        .style('position', 'absolute')
        .style('border-left', '2px dotted')
        .style('text-align', 'left')
        .style('border-color', 'coral');
}
