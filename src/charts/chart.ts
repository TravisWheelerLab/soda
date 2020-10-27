import * as d3 from 'd3'

export interface Chart<T> {
    // the dom element that we will insert the chart svg into
    selector:       string;
    // the vertical size of the chart in pixels
    height: number;
    // the horizontal size of the chart in pixels
    width: number;
    // maps from query range to pixels
    _xScale?:       d3.ScaleLinear<number, number>;
    // the height of a row/bin in the chart
    binHeight:      number;

    // these functions should provide the size in pixels
    // of whatever dom element is containing the chart
    getContainerWidth(): number;
    getContainerHeight(): number;
    // get a reference to whatever scale the chart is using
    getXScale(): d3.ScaleLinear<number, number>;
    // get the semantic dimensions of the view
    getSemanticViewRange(): {start: number, end: number, width: number};

    // The SVG element(s) into which the chart
    // is to be rendered, as a D3 `Selection`.
    // TODO: narrow this typing
    svgSelection: d3.Selection<any, any, any, any>;

    render(params: T): void;
}
