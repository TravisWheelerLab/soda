import * as d3 from 'd3';
import {ChartBase, ChartConfig} from "../charts";
import {ZoomableChart, ZoomBehavior, ZoomController} from "../modules/zoom";
import {ResizableChart} from "../modules/resize";

/**
 * A simple interface that holds the arguments for the TrackChart constructor.
 */
export interface TrackChartConfig extends ChartConfig {
    scaleExtent?: [number, number];
    translateExtent?: (chart: TrackChart<any>) => [[number, number], [number, number]];
}

/**
 * A simple interface that holds the arguments for the TrackChart render() method.
 */
export interface TrackChartRenderParams {
    queryStart: number;
    queryEnd: number;
    maxY?: number;
}

/**
 * The default unbounded zoom scale extent.
 */
const DEFAULT_TRACK_CHART_SCALE_EXTENT: [number, number] = [0, Infinity];
/**
 * The default unbounded zoom scale translate extent.
 * @constructor
 */
const DEFAULT_TRACK_CHART_TRANSLATE_EXTENT: { (c: TrackChart<any>): [[number, number], [number, number]] }  = () => [[-Infinity, -Infinity], [Infinity, Infinity]];

/**
 * This is an extended Chart class that was designed to fit the basic needs of a "track visualization." It is a
 * zoomable, resizable Chart that serves as a fully functional visualizer for simple needs, but also as a strong
 * starting point for another Chart extension for a more nuanced use-case.
 */
export class TrackChart<P extends TrackChartRenderParams> extends ChartBase<P> implements ZoomableChart<P>, ResizableChart<P> {
    /**
     * This keeps track of the number of vertical "bins" present in this TrackChart's current visualization.
     */
    binCount:      number;
    /**
     * This defines which bin (starting from the top) this TrackChart will start rendering in.
     */
    yOffset:       number;
    /**
     * The ZoomController that this chart accepts zoom events from. If the TrackChart has a ZoomController, it will
     * default to using the controller's scale instead of the TrackChart's internal scale.
     */
    zoomController?: ZoomController;
    /**
     * The list of ZoomBehaviors that this chart will pass to the ZoomController during a zoom event. These objects
     * define how all of the different glyphs rendered in this TrackChart will be transformed during a zoom event.
     */
    zoomBehaviors:  ZoomBehavior<TrackChart<P>, any>[] = [];
    /**
     * A list of two numbers that define the extent to which a zoom event is allowed to transform the TrackChart's
     * underlying scale. Simply put, this controls how far in and out a user will be able to zoom. The first number
     * is the maximum zoom-out factor, and the second is the maximum zoom-in factor. For example, setting this to
     * [1, 10] will prevent a user from zooming out past the point at which the chart is initially rendered, and
     * allow them to zoom in by a factor of 10.
     * For more info, see https://github.com/d3/d3-zoom/blob/master/README.md#zoom_scaleExtent
     */
    scaleExtent: [number, number];
    /**
     * This is a callback function that is used to set the translate extent (left/right panning) allowed when a zoom
     * event is applied to the TrackChart. It needs to be a callback, because it needs the absolute width of the TrackChart's
     * SVG viewport, which is allowed to change throughout the TrackChart's lifetime. For example, setting this to:
     * (chart) => [[0, 0], [chart.width, chart.height]] will restrict the panning in the TrackChart to exactly the range
     * that was initially rendered.
     * For more info, see https://github.com/d3/d3-zoom/blob/master/README.md#zoom_translateExtent
     * @param chart This callback will receive a reference to the TrackChart that calls it.
     */
    translateExtent: (chart: TrackChart<any>) => [[number, number], [number, number]];

    constructor(config: TrackChartConfig) {
        super(config);
        this.binCount = 0;
        this.yOffset = 0;

        this.scaleExtent = config.scaleExtent || DEFAULT_TRACK_CHART_SCALE_EXTENT;
        this.translateExtent = config.translateExtent || DEFAULT_TRACK_CHART_TRANSLATE_EXTENT;
        this.configureZoom();
    }

    /**
     * This configures the SVG viewport to appropriately handle browser zoom events. It is called in the
     * constructor, and in the TrackChart's resize() method. Currently, most of what this does is prevent zooming with
     * the scroll wheel unless the ctrl key is pressed, and re-applies the scale and translate extents. Eventually,
     * this should end up being parameterized to be a bit more user-configurable.
     */
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
                // set the scale and translate extents of the chart
                // see: https://github.com/d3/d3-zoom/blob/master/README.md#zoom_scaleExtent
                .scaleExtent(this.scaleExtent)
                .translateExtent(this.translateExtent(this))
                .on('zoom', () => self.callZoomTrigger())
            )
            .on("dblclick.zoom", null);
    }

    /**
     * Getter for the TrackChart's d3 scale that maps between semantic coordinates and viewport coordinates. If there is
     * ZoomController assigned to the TrackChart, it will return the ZoomController's scale instead.
     */
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

    /**
     * This takes the provided query arguments and sets the d3 scale to map between the provided semantic range and
     * the TrackChart's actual SVG viewport coordinate space. If there is a ZoomController assigned to the TrackChart, it will
     * set the ZoomController's scale instead.
     * @param queryStart
     * @param queryEnd
     */
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

    /**
     * This is called by a ZoomController during a zoom event to receive the list of ZoomBehaviors that the
     * ZoomController will then use to re-render the glyphs in the TrackChart appropriately given the new zoom level.
     */
    public getZoomBehaviors(): ZoomBehavior<TrackChart<P>, d3.Selection<d3.BaseType, unknown, HTMLElement, any>>[] {
        if (this.zoomBehaviors == null) {
            throw ("zoomBehaviors are null or undefined");
        }
        return this.zoomBehaviors;
    }

    /**
     * This resizes the TrackChart to fit the size of its container. This will be called by a ResizeController if
     * one is assigned to the TrackChart. The default behavior is for the TrackChart to fill its container,
     * reconfigure the zoom settings to match the new size, and then re-render the glyphs to appropriately fit in
     * the new dimensions.
     */
    public resize(): void {
        this.setToSvgDimensions();

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

    /**
     * Register a ZoomController to the TrackChart. This will not currently register the TrackChart with a
     * ZoomController. Instead, when a Chart is added to a ZoomController, the ZoomController will call this method
     * using itself as an argument.
     * @param controller
     */
    public registerZoomController(controller: ZoomController): void {
        this.zoomController = controller;
    }

    /**
     * A getter for the ZoomController.
     */
    public getZoomController(): ZoomController {
        if (this.zoomController == null) {
            throw("zoomController is null or undefined");
        }
        return this.zoomController;
    }

    /**
     * This is the handler method that will be called when the SVG viewport receives a browser zoom event. If
     * there is no ZoomController defined, it will do nothing.
     */
    protected callZoomTrigger(): void {
        let transform;
        if (d3.event == null) {
            transform = this.svgSelection.node().__zoom;
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

    /**
     * This sets the binCount and height of the TrackChart to accommodate the render.
     * @param params
     */
    protected preRender(params: P): void {
        this.binCount = params.maxY || 1;
        this.setHeight((this.binCount + this.yOffset) * this.binHeight + 2 * this.verticalPad);
    }

    /**
     * This method is called by render() after preRender() is called. This is where a customized TrackChart should
     * make calls to the glyph rendering module with arguments in the RenderParams. The implementation here actually
     * doesn't do anything, since there is no real common implementation.
     * @param params
     */
    protected inRender(params: P): void {
        // this method is the one responsible for actually drawing things
        // as such, it probably doesn't make sense for it to have a common implementation
    }

    /**
     * This is called by render() after inRender() is called. Here, it is responsible for just calling the
     * TrackChart's zoom trigger.
     * @param params
     */
    protected postRender(params: P): void {
        this.callZoomTrigger();
        this.alertPlugins();
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
