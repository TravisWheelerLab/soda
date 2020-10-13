import * as d3 from 'd3';
import { ChartBase, ChartConfig } from "../../charts";
import { ZoomableChart, ZoomBehavior, ZoomController } from "../../plugins/zoom";
import { ResizableChart } from "../../plugins/resize";
import { TrackChartConfig } from "./track-chart-config";
import { TrackChartRenderParams } from "./track-chart-render-params";

export class TrackChart<T extends TrackChartRenderParams> extends ChartBase<T> implements ZoomableChart<T>, ResizableChart<T> {
    // the number of bins we have
    binCount:      number;
    // the layer we start drawing at
    yOffset:       number;

    // object that controls how svg elements render as we zoom
    zoomController?: ZoomController;
    // a list of objects that define behaviors for different svg elements
    zoomBehaviors:  ZoomBehavior<any>[] = [];
    scaleExtent: [number, number];
    translateExtent: (chart: TrackChart<any>) => [[number, number], [number, number]];

    constructor(config: TrackChartConfig) {
        super(config);
        this.binCount = 0;
        this.yOffset = 0;

        this.scaleExtent = config.scaleExtent || [0, Infinity];
        if (config.translateExtent) {
            // translate extent in d3 works by defining a bounds within the svg coordinate system
            // this means that any intended translate extent will need to be redefined when a chart
            // changes size, so the translateExtent field is a function that takes a reference to a chart
            this.translateExtent = config.translateExtent
        }
        else {
            this.translateExtent = () => [[-Infinity, -Infinity], [Infinity, Infinity]];
        }
        this.configureZoom();
    }

    public configureZoom(): void {
        // this sets up the chart so that it can be zoomed
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
                // set the scale and translate extents of the chart
                // see: https://github.com/d3/d3-zoom/blob/master/README.md#zoom_scaleExtent
                .scaleExtent(this.scaleExtent)
                .translateExtent(this.translateExtent(this))
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
        this.setToContainerDimensions();

        if (this.zoomController !== undefined) {
            // if we have a zoom controller, we'll let it handle the re-rendering
            this.configureZoom();
            this.callZoomTrigger();
        }
        else {
            // if we don't have a zoom controller, we'll update and re-render
            const params = this.getRenderParams();
            this.setXScale(params.queryStart, params.queryEnd);
            this.inRender(params);
        }

        this.alertPlugins();
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

    protected preRender(params: T): void {
        this.binCount = params.maxY || 1;
        this.setXScale(params.queryStart, params.queryEnd);
        this.setHeight((this.binCount + this.yOffset) * this.binHeight);
    }

    protected inRender(params: T): void {
        // this method is the one responsible for actually drawing things
        // as such, it probably doesn't make sense for it to have a common implementation
    }

    protected postRender(params: T): void {
        this.callZoomTrigger();
        this.alertPlugins();
    }
}
