import * as d3 from 'd3';
import { Chart } from './chart';
import { ChartConfig } from './chart-config';
import { Plugin } from '../plugins/plugin';

export abstract class ChartBase<T> implements Chart<T> {
    // width of our svg viewport
    width:          number;
    // height of our svg viewport
    height:         number;
    // the dom element that we will insert the chart svg into
    selector:       string;
    // d3 selection of the chart svg
    svgSelection:   d3.Selection<any, any, any, any>;
    // maps from query range to pixels
    _xScale?:       d3.ScaleLinear<number, number>;
    // the height of a row/bin in the chart
    binHeight:      number;
    // a list of plugins attached to the chart
    plugins:        Plugin[] = [];

    protected constructor(config: ChartConfig) {
        this.selector = config.selector;
        this.svgSelection = d3.select(this.selector)
            .append('svg')
            .style('vertical-align', 'top');

        if (config.width !== undefined) {
            this.width = config.width;
        }
        else {
            this.width = this.getContainerWidth();
        }

        if (config.height !== undefined) {
            this.height = config.height;
        }
        else {
            this.height = this.getContainerHeight();
        }

        if (config.binHeight !== undefined) {
            this.binHeight = config.binHeight;
        }
        else {
            // TODO: is a default of 10 here reasonable?
            this.binHeight = 10;
        }

        this.svgSelection
            .attr('width', this.width)
            .attr('height', this.height);
    }

    public getSemanticViewRange(): {start: number, end: number, width: number} {
        // get the semantic range of what we're currently showing in the chart
        // in genomic annotations, this will probably almost always be in terms
        // of base pairs
        const viewStart = this.getXScale().invert(0);
        const viewEnd = this.getXScale().invert(this.width);
        const viewChrWidth = viewEnd - viewStart;
        return ({start: viewStart, end: viewEnd, width: viewChrWidth});
    }

    public getXScale(): d3.ScaleLinear<number, number> {
        if (this._xScale == null) {
            throw("_xScale is null or undefined");
        }
        return this._xScale;
    }

    public setXScale(queryStart: number, queryEnd: number): void {
        this._xScale = d3.scaleLinear()
            .domain([queryEnd, queryStart])
            .range([0, this.width]);
    }

    public getContainerDimensions(): DOMRect {
        // use d3 to find the dimensions of the chart's container
        const containerSelection = d3.select<HTMLElement, any>(this.selector).node();
        let containerDimensions;
        if (containerSelection == null) {
            throw (`Selector: ${this.selector} returned null selection`);
        }
        else {
            containerDimensions = containerSelection
                .getBoundingClientRect();
        }
        return (containerDimensions);
    }
    public getSvgDimensions(): DOMRect {
        let svg = this.svgSelection.node();
        if (svg == null) {
            throw(`SVG selection is undefined on , ${this}`);
        }
        return (svg.getBoundingClientRect());
    }

    public getContainerWidth(): number {
        return (this.getContainerDimensions().width);
    }

    public getContainerHeight(): number {
        return (this.getContainerDimensions().height);
    }

    public setToContainerDimensions(): void {
        this.width = this.getContainerWidth();
        this.height = this.getContainerHeight();

        this.svgSelection
            .attr('width', this.width)
            .attr('height', this.height);
    }

    public setHeight(height: number): void {
        this.height = height;

        // TODO: is this really always going to be a div?
        d3.select<HTMLDivElement, any>(this.selector)
            .style('height', this.height + 'px');

        this.svgSelection
            .attr('height', this.height);
    }

    protected alertPlugins(): void {
        for (const plugin of this.plugins) {
            plugin.alert();
        }
    }

    abstract render(params: T): void;
}
