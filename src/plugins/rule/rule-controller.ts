import * as d3 from 'd3';
import { ChartBase } from '../../charts';
import { Plugin } from '../plugin';
import { RuleConfig } from './rule-config';

export class RuleController implements Plugin {
    components: ChartBase<any>[];
    activeComponent?: ChartBase<any>;

    constructor() {
        this.components = [];
        this.activeComponent = undefined;
    }

    public alert(): void {
        this.updateRuleSize();
    }

    public addComponent(component: ChartBase<any>, config: RuleConfig) {
        this.components.push(component);
        component.plugins.push(this);
        verticalRule(component);
        ruleTooltip(component, config);
        component.svgSelection
            .on('mousemove', () => this.chartMouseMove(component, config))
    }

    public chartMouseMove(chart: ChartBase<any>, config: RuleConfig) {
        this.activeComponent = chart;
        this.moveRule(config);
    }

    public moveRule(config: RuleConfig): void {
        let mouseX = d3.event.pageX;
        let mouseY = d3.event.pageY;

        for (const comp of this.components) {
            d3.select(comp.selector)
                .selectAll('div.vertical-rule')
                .style('left', (mouseX + 5) + 'px');

            const compSvgDims = comp.getSvgDimensions();
            let tooltipText = Math.round(comp.getXScale().invert(mouseX - compSvgDims.x + 5));
            d3.select(comp.selector)
                .selectAll('div.rule-tooltip')
                .style('opacity', () => {
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

export function ruleTooltip(chart: ChartBase<any>, config: RuleConfig) {
    let containerDims = chart.getContainerDimensions();
    let top = containerDims.y;
    d3.select(chart.selector)
      .append('div')
        .attr('class', 'rule-tooltip')
        .style('position', 'absolute')
        .style('top', top + 'px')
        .style('border-radius', '8px')
        .style('background', 'lightsteelblue')
        .html('test');
}

export function verticalRule(chart: ChartBase<any>) {
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

function moveRule(selector: string, config: RuleConfig): void {
    let mouseX = d3.event.pageX;

    d3.select(selector)
        .selectAll('div.vertical-rule')
        .style('left', (mouseX + 5) + 'px');
}