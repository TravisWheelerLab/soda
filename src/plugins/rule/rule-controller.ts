import * as d3 from 'd3';
import { ChartBase } from '../../charts';
import { Plugin } from '../plugin';

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

    public addComponent(component: ChartBase<any>) {
        this.components.push(component);
        component.plugins.push(this);
        verticalRule(component);
        component.svgSelection
            .on('mousemove', () => this.chartMouseMove(component));
    }

    public chartMouseMove(chart: ChartBase<any>) {
        this.activeComponent = chart;
        this.moveRule();
    }

    public moveRule(): void {
        let mouseX = d3.event.pageX;

        for (const comp of this.components) {
            d3.select(comp.selector)
                .selectAll('div.vertical-rule')
                .style('left', (mouseX + 5) + 'px');
        }
    }

    public updateRuleSize(): void {
        for (const comp of this.components) {
            d3.select(comp.selector)
                .selectAll('div.vertical-rule')
                .style('height', comp.height + 'px')
                .style('top', top + 'px')
        }
    }
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

function moveRule(selector: string): void {
    let mouseX = d3.event.pageX;

    d3.select(selector)
        .selectAll('div.vertical-rule')
        .style('left', (mouseX + 5) + 'px');
}