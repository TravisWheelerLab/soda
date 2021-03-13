import * as d3 from 'd3';
import {ZoomBehavior, ZoomController} from '../modules/zoom';
import {ChartConfig} from "./chart";
import {QueryParameters} from "../modules/query/query-controller";
import {TrackChart, TrackChartRenderParams} from "./track-chart";

export function axisRenderCallback (axis: AxisChart, query: QueryParameters) {
    axis.render({queryStart: query.start, queryEnd: query.end});
}

/**
 * A simple interface that holds the arguments for the AxisChart render function.
 */
export interface AxisRenderParams extends TrackChartRenderParams {}

/**
 * The AxisChart is a simple chart that displays a horizontal axis with semantic coordinates.
 */
export class AxisChart extends TrackChart<AxisRenderParams> {
    /**
     * The d3 Axis object that will be rendered by the AxisChart. It will be defined after render() is called.
     */
    _axis: d3.Axis<number | { valueOf(): number }> | undefined;
    /**
     * A d3 selection to the DOM elements that the axis will be rendered as. It will be defined after render() is
     * called.
     */
    _axisSelection: d3.Selection<any, any, any, any> | undefined;

    constructor(config: ChartConfig) {
        super(config);
    }

    /**
     * The getter function for the d3 Axis object. This should be used when accessing the axis.
     */
    public getAxis(): d3.Axis<number | {valueOf(): number}> {
        if (this._axis == null) {
            throw ("_axis is null or undefined");
        }
        return (this._axis);
    }

    /**
     * This removes all of the SVG elements that the AxisChart has rendered.
     */
    protected clearAxis(): void {
       this.svgSelection
          .selectAll('g')
            .remove();
    }

    /**
     * The getter for the d3 scale that is used for the axis.
     */
    public getXScale(): d3.ScaleLinear<number, number> {
        // if we have a zoom controller, we'll get a rescaled X scale provided by the controller
        if (this.zoomController !== undefined) {
            // TODO: find a better way to do this
            //       this catches the error that occurs when we render the axis before
            //       the zoom controller has a defined scale
            try {
                return this.zoomController.getZoomedXScale();
            }
            catch {
                if (this._xScale == null) {
                    throw("_xScale is null or undefined");
                }
                return this._xScale;
            }
        }
        // if we don't, then we'll get the original X scale
        else {
            if (this._xScale == null) {
                throw("_xScale is null or undefined");
            }
            return this._xScale;
        }
    }

    /**
     * The getter for the d3 selection of all of the SVG elements rendered by the AxisChart.
     */
    public getAxisSelection(): d3.Selection<any, any, any, any> {
        if (this._axisSelection == null) {
            throw ("_axisSelection is null or undefined");
        }
        return (this._axisSelection);
    }

    /**
     * Register a ZoomController to the AxisChart. This will not currently register the AxisChart with a
     * ZoomController. Instead, when a Chart is added to a ZoomController, the ZoomController will call this method
     * using itself as an argument.
     * @param controller
     */
    public registerZoomController(controller: ZoomController): void {
        this.zoomController = controller;
    }

    /**
     * This returns the AxisCharts ZoomBehaviors. Currently, this returns an empty list by default, since AxisCharts
     * do not actually use ZoomBehaviors. Instead, this calls internal functions that will appropriately re-render
     * the AxisChart for the new zoom level. This is somewhat of a bandaid fix, and I expect it to change at some point.
     */
    public getZoomBehaviors(): ZoomBehavior<AxisChart, any>[]{
        // TODO: restructure this to have a zoom trigger method
        // i'm just calling these here for now
        this.getAxis().scale(this.getXScale());
        this.getAxisSelection().call(this.getAxis());
        // we have no custom zoom behaviors here, so we just return an empty list
        return [];
    }

    /**
     * There is currently no preRender routine for the AxisChart, so this does nothing.
     */
    protected preRender() {}

    /**
     * This creates the d3 Axis object and uses it to render the SVG elements.
     */
    protected inRender() {
        this._axis = d3.axisBottom(this.getXScale());
        this._axisSelection = this.svgSelection
            .attr('class', 'x-axis')
            .call(this.getAxis());
    }

    /**
     * There is currently no postRender routine for the AxisChart, so this does nothing.
     */
    protected postRender() {}
}
