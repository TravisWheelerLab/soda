import * as d3 from 'd3';
import {Plugin} from '../modules/plugin';
import {axisRadialOuter} from 'd3-radial-axis';

/**
 * A simple interface that defines the parameters for rendering a RadialChart.
 */
export interface RadialChartRenderParams {
    /**
     * The start coordinate of the region that will be rendered.
     */
    queryStart: number;
    /**
     * The end coordinate of the region that will be rendered.
     */
    queryEnd: number;
}

/**
 * A simple interface that defines the parameters that initialize a RadialChart
 */
export interface RadialChartConfig {
    /**
     * A string that can be used to uniquely select the target DOM container via d3.select().
     */
    selector?: string;
    /**
     * The height in pixels of the Chart's SVG viewport.
     */
    height?: number;
    /**
     * The height in pixels of the Chart's SVG viewport.
     */
    width?: number;
    /**
     * The number of "vertical" bins that the chart will be divided into.
     */
    binCount?: number;
    /**
     * The radius of the circle that defines the empty space in the center of the chart.
     */
    innerRadius?: number;
    /**
     * The radius of the circle that defines the outer boundary of the chart.
     */
    outerRadius?: number;
    /**
     * The radius of the circle that defines the axis placement.
     */
    axisRadius?: number;
    /**
     * The initial number of ticks on the chart axis.
     */
    tickCount?: number;
    /**
     * The height in pixels with which to pad the top and bottom of the SVG viewport with empty space.
     */
    verticalPad?: number;
}

/**
 * This Chart class is designed for rendering features in a circular context, e.g. bacterial genomes.
 */
export class RadialChart<P extends RadialChartRenderParams> {
    /**
     * A string that can be used to uniquely select the target DOM container via d3.select().
     */
    selector: string | undefined;
    /**
     * The last used render parameters.
     */
    _renderParams: P | undefined;
    /**
     * The width in pixels of the Chart's SVG viewport.
     */
    width: number;
    /**
     * The height in pixels of the Chart's SVG viewport.
     */
    height: number;
    /**
     * The number of "vertical" bins that the chart will be divided into.
     */
    binCount: number;
    /**
     * The radius of the circle that defines the empty space in the center of the chart.
     */
    innerRadius: number;
    /**
     * The radius of the circle that defines the outer boundary of the chart.
     */
    outerRadius: number;
    /**
     * The radius of the circle that defines the axis placement.
     */
    axisRadius?: number;
    /**
     * The amount of space in pixels to pad the top and bottom of the chart.
     */
    verticalPad: number;
    /**
     * A d3 selection of the Chart's SVG viewport.
     */
    svgSelection: d3.Selection<any, any, any, any>;
    /**
     * A d3 selection of the radial track.
      */
    trackSelection: d3.Selection<any, any, any, any>;
    /**
     * A d3 selection to the radial axis.
     */
    _axisSelection?: d3.Selection<any, any, any, any>;
    /**
     * The initial number of ticks to display on the radial axis. D3 usually refuses to use the actual number
     * supplied, and instead it tries really hard to make it even and "pretty."
     */
    tickCount: number;
    /**
     * A d3 scale that the Chart will use to translate between semantic and SVG viewport coordinates.
     */
    _xScale?: d3.ScaleLinear<number, number>;
    /**
     * A list of plugins attached to the Chart.
     */
    plugins: Plugin[] = [];

    /**
     * The base Chart constructor makes a d3 selection of the provided selector and creates an SVG inside of the
     * resulting DOM container. If explicit height and width arguments are provided, the SVG will be created to
     * match those dimensions. Otherwise, it will set the SVG to the dimensions of the targeted DOM container.
     * @param config
     */
    public constructor(config: RadialChartConfig) {
        if (config.selector !== undefined) {
            this.selector = config.selector;
            this.svgSelection = d3.select(this.selector)
                .append('svg')
                .style('vertical-align', 'top');
        }
        else {
            this.svgSelection = d3.create('svg:svg')
                .style('vertical-align', 'top');
        }
        this.verticalPad = config.verticalPad || 0;
        this.svgSelection
            .attr('width', config.width || '100%')
            .attr('height', config.height || '100%');

        this.width = config.width || this.getSvgWidth();
        this.height = (config.width || this.getSvgHeight()) + this.verticalPad + this.verticalPad * 2;

        this.innerRadius = config.innerRadius || this.width / 3;
        this.outerRadius = config.outerRadius || this.width / 2;
        this.binCount = config.binCount || 1;
        this.tickCount = config.tickCount || 10;

        this.trackSelection = this.svgSelection
            .append("path")
            .attr("transform", `translate(${this.height/2}, ${this.height/2})`)
            .attr("d", d3.arc()
                .innerRadius(this.innerRadius)
                .outerRadius(this.outerRadius)
                .startAngle(3.14)
                .endAngle(6.28 * 2)
            )
            .attr('stroke', '#ee7f7a')
            .attr('fill', '#ee7f7a');

        this.configureZoom()
    }

    public configureZoom(): void {
        const self = this;
        this.svgSelection
            .call(d3.zoom()
                .filter(() => {
                    if (d3.event.type === 'wheel') {
                        // don't allow zooming without pressing ctrl
                        return d3.event.ctrlKey;
                    }
                    return true;
                })
                .on('zoom', () => self.zoom(d3.event))
            )
            .on("dblclick.zoom", null);

        // adjust the internal zoom for the initial translate that centers the chart
        this.svgSelection.node().__zoom.x = this.height/2;
        this.svgSelection.node().__zoom.y = this.height/2;
    }

    public configureAxis() {
        // TODO: I'd like to keep this as a property on the chart object,
        //       but to do that in a reasonable way I'll need type declarations
        let axis = axisRadialOuter(this.getXScale(), this.outerRadius);
        axis.ticks(this.tickCount);

        this._axisSelection = this.svgSelection
            .append('g')
            .attr("transform", `translate(${this.height/2}, ${this.height/2})`)
            .call(axis);

        // initialize style parameters
        this._axisSelection.select("path.domain")
            .style('stroke',  '#ee7f7a');

        this._axisSelection.selectAll('text')
            .style('stroke', '#181d24')
            .style('fill', '#181d24')
            .style('font-size', 12)
    }

    public zoom(event: any) {
        if (event !== null) {
            let transform = event.transform;

            let axisSelection = this.getAxisSelection();

            axisSelection.select("path.domain")
                .style('stroke',  '#ee7f7a');

            this.trackSelection.attr("transform", transform);
            axisSelection.attr("transform", transform);

            // TODO: I'd rather not create a new axis every time
            let axis = axisRadialOuter(this.getXScale(), this.outerRadius);

            // we'll set the ticks by multiplying the tick
            // count by the transform scale factor k rounded
            // this seems to work well enough for now
            let kRounded = Math.round(transform.k)
            axis.ticks(this.tickCount * kRounded);

            axisSelection.call(axis);

            // scale the ticks by the inverse of the scaling factor
            axisSelection.selectAll('text')
                .style('stroke', '#181d24')
                .style('fill', '#181d24')
                .style('font-size', 12)
                .attr('transform', `scale(${1/transform.k})`);

            axisSelection.selectAll('line')
                .attr('transform', `scale(${1/transform.k})`);
        }
    }

    /**
     * Get the string selector to the container that the Chart lives in.
     */
    public getSelector(): string {
        if (this.selector == undefined) {
            throw (`Selector on ${this} is null or undefined. Is this Chart detached?`)
        }
        return this.selector;
    }

    /**
     * Get the semantic coordinate range of what is currently shown in the Chart's viewport.
     */
    public getSemanticViewRange(): {start: number, end: number, width: number} {
        // TODO: this is lifted from the TrackChart, and doesn't make sense in this context
        //       it needs to be rewritten to cleverly figure out which section of the circle
        //       is currently visible within the SVG viewport
        const viewStart = this.getXScale().invert(0);
        const viewEnd = this.getXScale().invert(this.width);
        const viewChrWidth = viewEnd - viewStart;
        return ({start: viewStart, end: viewEnd, width: viewChrWidth});
    }

    public getAxisSelection(): d3.Selection<any, any, any, any> {
        if (this._axisSelection == null) {
            throw("_axisSelection is null or undefined");
        }
        return this._axisSelection;
    }

    /**
     * Get a reference to the Chart's internal d3 scale used for translating between semantic and viewport coordinates.
     */
    public getXScale(): d3.ScaleLinear<number, number> {
        if (this._xScale == null) {
            throw("_xScale is null or undefined");
        }
        return this._xScale;
    }

    /**
     * Set the internal d3 scale to map from the provided semantic query range to the Chart's current
     * viewport dimensions.
     * @param queryStart
     * @param queryEnd
     */
    public setXScale(queryStart: number, queryEnd: number): void {
        this._xScale = d3.scaleLinear()
            .domain([queryEnd, queryStart])
            .range([0, 2 * Math.PI]);
    }

    /**
     * This uses d3 to select the Chart's DOM container and returns a DOMRect that describes that containers dimensions.
     */
    public getContainerDimensions(): DOMRect {
        let containerDimensions: DOMRect;
        if (this.selector !== undefined ) {
            const containerSelection = d3.select<HTMLElement, any>(this.selector).node();
            if (containerSelection == null) {
                throw (`Selector: ${this.selector} returned null selection`);
            } else {
                containerDimensions = containerSelection
                    .getBoundingClientRect();
            }
        }
        else {
            //TODO: this may be a bad way to handle this
            containerDimensions = {
                bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0, toJSON(): any {}
            }
        }
        return containerDimensions
    }

    /**
     * This returns a DOMRect that describes the SVG viewport's dimensions.
     */
    public getSvgDimensions(): DOMRect {
        let svg = this.svgSelection.node();
        if (svg == null) {
            console.warn(`SVG selection is undefined on`, this);
            throw('SVG undefined');
        }
        return (svg.getBoundingClientRect());
    }

    /**
     * This returns the width of the SVG viewport in pixels.
     */
    public getSvgWidth(): number {
        return (this.getSvgDimensions().width);
    }

    /**
     * This returns the width of the SVG viewport in pixels.
     */
    public getSvgHeight(): number {
        return (this.getSvgDimensions().height);
    }

    /**
     * This figures out the Chart's SVG viewport dimensions, and sets the Chart's internal dimensions to match.
     */
    public setToSvgDimensions(): void {
        const dims = this.getSvgDimensions();
        this.width = dims.width;
        this.height = dims.height;
    }

    /**
     * This returns the Chart's DOM container's width in pixels.
     */
    public getContainerWidth(): number {
        return (this.getContainerDimensions().width);
    }

    /**
     * This returns the Chart's DOM container's height in pixels.
     */
    public getContainerHeight(): number {
        return (this.getContainerDimensions().height);
    }

    /**
     * This figures out the Chart's DOM container's dimensions, and sets the Chart's viewport SVG to fill those
     * dimensions.
     */
    public setToContainerDimensions(): void {
        const dims = this.getContainerDimensions();
        this.width = dims.width;
        this.height = dims.height;

        this.svgSelection
            .attr('width', this.width)
            .attr('height', this.height);
    }

    /**
     * This set's the Chart's height to an explicit pixel value.
     * @param height
     */
    public setHeight(height: number): void {
        this.height = height;

        // TODO: is this really always going to be a div?
        d3.select<HTMLDivElement, any>(this.getSelector())
            .style('height', this.height + 'px');

        this.svgSelection
            .attr('height', this.height);
    }

    /**
     * This calls each of this Chart's attached plugin's alert() method.
     */
    protected alertPlugins(): void {
        for (const plugin of this.plugins) {
            plugin.alert();
        }
    }

    /**
     * Getter for the Chart's previously used render parameters.
     */
    public getRenderParams(): P {
        if (this._renderParams == undefined) {
            throw(`Render params not defined on ${this}`);
        }
        return (this._renderParams);
    }

    /**
     * @param params
     */
    protected preRender(params: P): void {
        this.configureAxis();
    }

    /**
     * @param params
     */
    protected inRender(params: P): void {}

    /**
     * @param params
     */
    protected postRender(params: P): void {}

    /**
     * This method just stores the render parameters on the Chart and calls preRender(), inRender(), and postRender().
     * This is set up this way since preRender() and postRender() will often have common implementations, but
     * inRender() generally will not.
     * @param params
     */
    public render(params: P): void {
        this._renderParams = params;
        this.preRender(params);
        this.inRender(params);
        this.postRender(params);
    }

    /**
     * This resets the x scale to agree with the render parameters then calls render(). This method should be called
     * for an initial render, or a render that is intended to reset the view in some way (e.g. whenever a 'submit
     * query' button is pressed in a form).
     * @param params
     */
    public initialRender(params: P): void {
        this.setXScale(params.queryStart, params.queryEnd);
        this.render(params)
    }
}
