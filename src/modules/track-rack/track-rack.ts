import {Chart} from "../../charts/chart";
import * as d3 from "d3";

export interface TrackRackConfig {
    selector: string;
}

export class TrackRack {
    selector: string;
    compCount = 0;
    charts: Chart<any>[] = [];
    divSelection: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>

    constructor(config: TrackRackConfig) {
        this.selector = config.selector;
        this.divSelection = d3.select(this.selector)
            .append('div')
            .attr('class', 'track-rack')
            .style('width', '100%')
            .style('height', 'auto')
    }

    public add(chart: Chart<any>): void{
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

    protected query(start: number, end: number): void {

    }

    public render(): void {

    }
}
