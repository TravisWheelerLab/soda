import {Chart} from "../../charts/chart";
import * as d3 from "d3";

export interface TrackRackConfig {
    selector: string;
}

export interface QuerySignature {
    start: number;
    end: number;
}

export class TrackRack<Q extends QuerySignature> {
    selector: string;
    compCount = 0;
    charts: Chart<any>[] = [];
    renderCallbacks: ((chart: any, query: Q) => void)[] = [];
    divSelection: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>

    constructor(config: TrackRackConfig) {
        this.selector = config.selector;
        this.divSelection = d3.select(this.selector)
            .append('div')
            .attr('class', 'track-rack')
            .style('width', '100%')
            .style('height', 'auto')
    }

    public add<C extends Chart<any>>(chart: C, renderCallback: (chart: C, query: Q) => void): void {

        this.charts.push(chart);
        this.renderCallbacks.push(renderCallback);

        let compDiv = this.divSelection
            .append('div')
            .attr('class', 'track-rack-component')
            .style('width', '100%')
            .style('height', 'auto')
            .style('padding-top', '5px')
            .style('padding-bottom', '5px')
            .style('border', 'solid')
            .style('border-width', '0.5px')

        let compBarDiv = compDiv
            .append('div')
            .attr('class', 'track-rack-sidebar')
            .attr('id', `track-rack-bar-${this.compCount}`)
            .style('width', '100px')
            .style('float', 'left')
            .style('height', 'auto')
            .append('svg')
            .attr('height', '20px')
            .attr('width' ,'100%')
            .append('text')
            .text(`track ${this.compCount}`)
            .attr('x', 10)
            .attr('y', 10)
            .style('fill', 'black')

        let compChartDiv = compDiv
            .append('div')
            .attr('class', 'track-rack-chart')
            .attr('id', `track-rack-chart-${this.compCount}`)
            .style('margin-left', '100px')
            .style('width', '100%')
            .style('height', 'auto')

        compChartDiv.append(() => chart.svgSelection.node())
        chart.selector = `#track-rack-chart-${this.compCount}`;
        chart.setToContainerDimensions();

        this.compCount++;
    }

    public queryAndRender(query: Q): void {
        for (let [i, chart] of this.charts.entries()) {
            this.renderCallbacks[i](chart, query);
        }
    }
}
