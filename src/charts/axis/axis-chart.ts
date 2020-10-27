import * as d3 from 'd3';
import { AxisRenderParams } from "./axis-render-params";
import { ChartBase } from '../chart-base'
import { ChartConfig } from '../chart-config'
import { ZoomController, ZoomableChart, ZoomBehavior } from '../../plugins/zoom';
import { ResizableChart } from '../../plugins/resize';

// a generic chart to display a dynamic horizontal axis
export class AxisChart extends ChartBase<AxisRenderParams> implements ZoomableChart<AxisRenderParams>, ResizableChart<AxisRenderParams> {
    // TODO: fix this typing
    axis: any;
    _axisSelection?: d3.Selection<any, any, any, any>;
    // these objects define how to re-render the different parts of a chart
    // in this case, we won't actually need any ZoomBehaviors
    zoomBehaviors?: ZoomBehavior<AxisChart, any>[];
    zoomController?: ZoomController;
    _queryStart?: number;
    _queryEnd?: number;

    constructor(config: ChartConfig) {
        super(config);
    }

    public getQueryStart(): number {
        if (this._queryStart == null) {
            throw ("_queryStart is null or undefined");
        }
        return (this._queryStart);
    }

    public getQueryEnd(): number {
        if (this._queryEnd == null) {
            throw ("_queryEnd is null or undefined");
        }
        return (this._queryEnd);
    }   

    public resize(): void {
        this.clearAxis();
        this.setToContainerDimensions();
        this.setXScale();
        this.inRender();
    }

    protected clearAxis(): void {
        // remove all of the svg objects present in the chart
        d3.select(this.selector)
          .selectAll('g')
            .remove();
    }

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
    
    public getAxisSelection(): d3.Selection<any, any, any, any> {
        if (this._axisSelection == null) {
            throw ("_axisSelection is null or undefined");
        }
        return (this._axisSelection);
    }

    public registerZoomController(controller: ZoomController): void {
        this.zoomController = controller;
    }

    public getZoomBehaviors(): ZoomBehavior<AxisChart, any>[]{
        // TODO: restructure this to have a zoom trigger method
        // i'm just calling these here for now
        this.axis.scale(this.getXScale()); 
        this.getAxisSelection().call(this.axis);
        // we have no custom zoom behaviors here, so we just return an empty list
        return [];
    }

    public setXScale() {
        // set the internal x scale based off of internal properties
        this._xScale = d3.scaleLinear()
            .domain([this.getQueryStart(), this.getQueryEnd()])
            .range([0, this.width]);
    }

    protected preRender(params: AxisRenderParams) {
        this._queryStart = params.queryStart;
        this._queryEnd = params.queryEnd;
        // set the d3 scale to the query range
        this.setXScale();
    }

    protected inRender() {
        // TODO: maybe we want to support vertical axes as well?
        // render the axis based off of the x scale
        // if there is a ZoomController registered, it will use the controllers' x scale
        this.axis = d3.axisBottom(this.getXScale());
        this._axisSelection = this.svgSelection
            .attr('class', 'x-axis')
            .call(this.axis);
    }

    protected postRender() {
        // this doesn't currently need to do anything post render
    }
}
