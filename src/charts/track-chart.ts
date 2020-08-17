import * as d3 from 'd3';
import * as sp from '../primitives';
import * as tt from '../plugins/tooltip';
import { ChartBase, ChartConfig } from "../charts";
import { ZoomableChart, ZoomBehavior, ZoomController } from "../plugins/zoom";
import { ResizableChart } from "../plugins/resize";

// parameters for rendering a track chart
export interface TrackParams {
    queryStart: number;
    queryEnd:   number;
    maxY:       number;
}

export class TrackChart<T extends TrackParams> extends ChartBase<T> implements ZoomableChart<T>, ResizableChart<T> {
    // the height of a bin where Annotations are drawn
    binHeight:     number;
    // the layer we start drawing at
    yOffset:       number; 
    // object that controls how svg elements render as we zoom
    zoomController?: ZoomController;
    // a list of objects that define behaviors for different svg elements
    zoomBehaviors:  ZoomBehavior<any>[] = [];
    // the size of the padding between features and their labels
    textPadSize:        number;
    // d3 scale to map divergence score to a color
    constructor(config: ChartConfig) {
        super(config);
        this.binHeight = 20;
        this.yOffset = 0;
        this.textPadSize = 5;

        const self = this; 
        
        this.svgSelection
            .call(d3.zoom()
                .on('zoom', () => self.callZoomTrigger())
            )
            .on("dblclick.zoom", null);
            
    }
    
    public getXScale(): d3.ScaleLinear<number, number> {
        // if we have a zoom controller, we'll get a rescaled X scale provided by the controller
        if (this.zoomController !== undefined) {
            return this.zoomController.getZoomedXScale();
        }
        // if we don't, then we'll get the original X scale
        else {
            if (this._xScale == null) {
                throw("_xScale is null or undefined");
            }
            return this._xScale;
        }
    }

    public setXScale(queryStart: number, queryEnd: number): void {
        // if we have a zoom controller, we'll set the zoom controller's scale
        if (this.zoomController !== undefined) {
            this.zoomController.setQueryRange(queryStart, queryEnd);
            this.zoomController.setXScale();
        }
        // otherwise, we'll set the charts internal scale
        this._xScale = d3.scaleLinear()
            .domain([queryStart, queryEnd])
            .range([0, this.width]);
    }    

    public getZoomBehaviors(): ZoomBehavior<d3.Selection<d3.BaseType, unknown, HTMLElement, any>>[] {
        if (this.zoomBehaviors == null) {
            throw ("zoomBehaviors are null or undefined");
        }
        return this.zoomBehaviors;
    }

    public resize(): void {
        // TODO: implement this for when there's no zoom controller
        this.setToContainerDimensions();
    }

    public registerZoomController(controller: ZoomController): void {
        this.zoomController = controller;
    }

    protected callZoomTrigger(): void {
        let transform;
        if (d3.event == null) {
            transform = d3.zoomIdentity;
        }
        else {
            transform = d3.event.transform;
        }
        if (this.zoomController !== undefined) {
            this.zoomController.trigger(transform);
        }
        else {
            console.error("no zoom controller");
        }
    }

    render(params: TrackParams): void {
        // set the height of the chart based off of the number of
        // nesting layers are present in the params we were given
        this.setXScale(params.queryStart, params.queryEnd); 
        this.setHeight((params.maxY + this.yOffset) * this.binHeight);
        this.callZoomTrigger();
    }
}
