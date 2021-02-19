import * as d3 from 'd3';
import {Chart, ChartConfig, ChartRenderParams} from './chart';
import {Plugin} from '../plugins/plugin';

/**
 * This is an abstract class that provides some default implementations for Charts. It basically just handles creating
 * and keeping track of an SVG viewport in the DOM, creating a d3 scale that is used to translate between semantic
 * coordinates and viewport coordinates, and provides some utility methods to get information about the dimensions
 * of a Chart's container in the DOM.
 */
export abstract class ChartBase<P extends ChartRenderParams> implements Chart<P> {
    /**
     * A string that can be used to uniquely select the target DOM container via d3.select().
     */
    selector:       string | undefined;
    /**
     * The last used render parameters.
     */
    _renderParams:  P | undefined;
    /**
     * The width in pixels of the Chart's SVG viewport.
     */
    width:          number;
    /**
     * The height in pixels of the Chart's SVG viewport.
     */
    height:         number;
    /**
     * A d3 selection of the Chart's SVG viewport.
     */
    svgSelection:   d3.Selection<any, any, any, any>;
    /**
     * A d3 scale that the Chart will use to translate between semantic and SVG viewport coordinates.
     */
    _xScale?:       d3.ScaleLinear<number, number>;
    /**
     * The height in pixels of a horizontal bin in the visualization. Generally, the y coordinate of an Annotation
     * glyph will be given in terms of which bin it should be rendered in. This defaults to a value of 10.
     */
    binHeight:      number;
    /**
     * A list of plugins attached to the Chart.
     */
    plugins:        Plugin[] = [];

    /**
     * The base Chart constructor makes a d3 selection of the provided selector and creates an SVG inside of the
     * resulting DOM container. If explicit height and width arguments are provided, the SVG will be created to
     * match those dimensions. Otherwise, it will set the SVG to the dimensions of the targeted DOM container.
     * @param config
     */
    protected constructor(config: ChartConfig) {
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

        this.binHeight = config.binHeight || 10;

        this.svgSelection
            .attr('width', config.width || '100%')
            .attr('height', config.height || this.binHeight);

        this.width = config.width || this.getSvgWidth();
        this.height = config.width || this.getSvgHeight();
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

        const viewStart = this.getXScale().invert(0);
        const viewEnd = this.getXScale().invert(this.width);
        const viewChrWidth = viewEnd - viewStart;
        return ({start: viewStart, end: viewEnd, width: viewChrWidth});
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
            .range([0, this.width]);
    }

    /**
     * This uses d3 to select the Chart's DOM container and returns a DOMRect that describes that containers dimensions.
     */
    public getContainerDimensions(): DOMRect {
        let containerDimensions: DOMRect;
        if (this.selector !== undefined ) {
            const containerSelection = d3.select<HTMLElement, any>(this.selector).node();
            console.log(this, containerSelection);
            if (containerSelection == null) {
                throw (`Selector: ${this.selector} returned null selection`);
            } else {
                containerDimensions = containerSelection
                    .getBoundingClientRect();
                console.log(containerDimensions);
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
            throw(`SVG selection is undefined on , ${this}`);
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
     * This abstract method should be implemented to perform anything that needs to be done in the Chart before it
     * actually starts to render something. This will generally be things like updating the query range parameters.
     * @param params
     */
    protected abstract preRender(params: P): void

    /**
     * This abstract method should be implemented to use soda's glyph rendering module to actually render the
     * appropriate glyphs using the provided render parameters.
     * @param params
     */
    protected abstract inRender(params: P): void

    /**
     * This abstract method should be implemented to perform anything that needs to be done in the chart after a
     * render has taken place. This will generally be things like alerting plugins or calling the zoom trigger.
     * @param params
     */
    protected abstract postRender(params: P): void

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
}
