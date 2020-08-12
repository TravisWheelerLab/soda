import { Selection } from 'd3'

export interface Chart<T> {
    // the vertical size of the chart in pixels
    height: number;
    // the horizontal size of the chart in pixels
    width: number;

    // these functions should provide the size in pixels
    // of whatever dom element is containing the chart
    getContainerWidth(): number;
    getContainerHeight(): number;

    // The SVG element(s) into which the chart
    // is to be rendered, as a D3 `Selection`.
    // TODO: narrow this typing
    svgSelection: Selection<any, any, any, any>;

    render(params: T): void;
}
