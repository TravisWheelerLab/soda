import * as d3 from 'd3';
import {ChartBase} from './chart-base'
import {ZoomableChart, ZoomBehavior, ZoomController} from '../modules/zoom';
import {ResizableChart} from '../modules/resize';
import {ChartConfig} from "./chart";

/**
 * A simple interface that holds the arguments for the AxisChart render function.
 */
export interface AxisRenderParams {
    /**
     * The start of the query in semantic coordinates.
     */
    queryStart: number,
    /**
     * The start of the query in semantic coordinates.
     */
    queryEnd: number,
}

/**
 * The AxisChart is a simple chart that displays a horizontal axis with semantic coordinates.
 */
export class AxisChart extends ChartBase<AxisRenderParams> implements ZoomableChart<AxisRenderParams>, ResizableChart<AxisRenderParams> {
    /**
     * The d3 Axis object that will be rendered by the AxisChart. It will be defined after render() is called.
     */
    _axis: d3.Axis<number | { valueOf(): number }> | undefined;
    /**
     * A d3 selection to the DOM elements that the axis will be rendered as. It will be defined after render() is
     * called.
     */
    _axisSelection: d3.Selection<any, any, any, any> | undefined;
    /**
     * The list of ZoomBehaviors for the Chart. There won't actually be any ZoomBehaviors for an AxisChart, as it
     * uses the default d3 zooming functionality.
     */
    zoomBehaviors: ZoomBehavior<AxisChart, any>[] | undefined;
    /**
     * The ZoomController that this chart accepts zoom events from.
     */
    zoomController?: ZoomController;
    /**
     * The start of the currently displayed query in semantic coordinates.
     */
    _queryStart: number | undefined;
    /**
     * The end of the currently displayed query in semantic coordinates.
     */
    _queryEnd: number | undefined;

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
     * The getter for _queryStart.
     */
    public getQueryStart(): number {
        if (this._queryStart == null) {
            throw ("_queryStart is null or undefined");
        }
        return (this._queryStart);
    }

    /**
     * The getter for _queryEnd.
     */
    public getQueryEnd(): number {
        if (this._queryEnd == null) {
            throw ("_queryEnd is null or undefined");
        }
        return (this._queryEnd);
    }

    /**
     * This resizes the Axis to fit the size of its container. This will be called by a ResizeController if
     * one is assigned to the AxisChart.
     */
    public resize(): void {
        this.clearAxis();
        this.setToSvgDimensions();
        this.setXScale();
        this.inRender();
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
     * This uses the AxisChart's current queryStart and queryEnd to set the d3 scale used for the axis.
     */
    public setXScale() {
        // set the internal x scale based off of internal properties
        this._xScale = d3.scaleLinear()
            .domain([this.getQueryStart(), this.getQueryEnd()])
            .range([0, this.width]);
    }

    /**
     * This updates the query range with the given parameters, and then uses setXScale() to set the internal d3 scale.
     * @param params
     */
    protected preRender(params: AxisRenderParams) {
        this._queryStart = params.queryStart;
        this._queryEnd = params.queryEnd;
        // set the d3 scale to the query range
        this.setXScale();
    }

    /**
     * This creates the d3 Axis object and uses it to render the SVG elements.
     */
    protected inRender() {
        // TODO: maybe we want to support vertical axes as well?
        // render the axis based off of the x scale
        // if there is a ZoomController registered, it will use the controllers' x scale
        this._axis = d3.axisBottom(this.getXScale());
        this._axisSelection = this.svgSelection
            .attr('class', 'x-axis')
            .call(this.getAxis());
    }

    /**
     * There is currently no postRender routine for the AxisChart, so this does nothing.
     */
    protected postRender() {
        // this doesn't currently need to do anything post render
    }
}
