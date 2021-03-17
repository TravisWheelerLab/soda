import * as d3 from 'd3'

/**
 * An interface to describe the bare minimum properties and methods that a SODA Chart should have.
 */
export interface Chart<T> {
    /**
     * A string that can be used to uniquely select the target DOM container via d3.select().
     */
    selector:       string | undefined;
    /**
     * The height in pixels of the Chart's SVG viewport.
     */
    height: number;
    /**
     * The amount of space in pixels to pad the top and bottom of the chart.
     */
    verticalPad:         number;
    /**
     * The width in pixels of the Chart's SVG viewport.
     */
    width: number;
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
     * This method should set the Chart's internal dimensions to match the SVG viewport dimensions.
     */
    setToSvgDimensions(): void;
    /**
     * This method should return the width of the Chart's DOM container.
     */
    getContainerWidth(): number;
    /**
     * This method should return the height of the Chart's DOM container.
     */
    getContainerHeight(): number;
    /**
     * This method should set the size of the SVG viewport to match the Chart's DOM container.
     */
    setToContainerDimensions(): void;
    /**
     * This method should return a reference to whatever d3 scale the chart is using for coordinate translation.
     * This may be a scale internal to the Chart, or it may be a ZoomController's scale.
     */
    getXScale(): d3.ScaleLinear<number, number>;
    /**
     * This method should return the semantic dimensions of what is currently displayed in the Chart's SVG viewport.
     */
    getSemanticViewRange(): {start: number, end: number, width: number};

    /**
     * A d3 selection of the Chart's SVG viewport.
     */
    svgSelection: d3.Selection<any, any, any, any>;

    /**
     * This method should be responsible for rendering glyphs inside of the Chart.
     * @param params
     */
    render(params: T): void;
}

/**
 * A simple interface that defines the common parameters that should be used to configure any Chart.
 */
export interface ChartConfig {
    selector?: string;
    binHeight?: number;
    height?: number;
    width?: number;
    verticalPad?: number;
}

/**
 * A simple interface that defines the common parameters that should be used to render glyphs in any chart.
 */
export interface ChartRenderParams {
    /**
     * The start coordinate of the region that will be rendered.
     */
    queryStart: number;
    /**
     * The end coordinate of the region that will be rendered.
     */
    queryEnd: number;
}
