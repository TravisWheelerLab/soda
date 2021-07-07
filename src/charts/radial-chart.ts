import * as d3 from 'd3';
import {Plugin} from '../modules/plugin';
import {axisRadialOuter} from 'd3-radial-axis';
import {Annotation} from "../annotations/annotation";
import {ArcConfig, arcGlyph} from "../modules/glyphs/arc/arc-glyph";
import {ChartBase} from "./chart-base";
import {Chart} from "./chart";
import {ZoomBehavior} from "../modules/zoom/zoom-behavior";
import {Transform} from "../modules/zoom/transform";

/**
 * A simple interface that defines the parameters for rendering a RadialChart.
 */
export interface RadialChartRenderParams {
    /**
     * The start coordinate of the region that will be rendered.
     */
    queryStart: number;
    /**
     * The end coordinate of the region that will be rendered.
     */
    queryEnd: number;
    /**
     * The Annotations to be rendered on the radial chart.
     */
    ann: Annotation[];
}

let trackCount = 0;
function buildTrackAnnotation(): Annotation {
    return new Annotation({
        id: `radial-track-annotation-${trackCount++}`, w: 0, x: 0, y: 0
    });
}

export class RadialChartArcZoomBehavior<A extends Annotation, C extends Chart<any>> implements ZoomBehavior<C, d3.Selection<SVGElement, A, HTMLElement, any>> {
    selector: string;
    id = 'radial-chart-arc-zoom-behavior';

    constructor(selector: string) {
        this.selector = `path.${selector}`;
    }

    public apply(chart: C, selection: d3.Selection<SVGElement, A, HTMLElement, any>): void {
        let chartTransform = chart.svgSelection.node().__zoom;
        selection
            .attr("transform", chartTransform)
    }

    public applyDuration(chart: C, selection: d3.Selection<SVGElement, A, HTMLElement, any>, duration: number): void {
        let chartTransform = chart.svgSelection.node().__zoom;
        selection
            .transition()
            .attr("transform", chartTransform)
    }
}

/**
 * A simple interface that defines the parameters that initialize a RadialChart
 */
export interface RadialChartConfig {
    /**
     * A string that can be used to uniquely select the target DOM container via d3.select().
     */
    selector?: string;
    /**
     * The height in pixels of the Chart's SVG viewport.
     */
    height?: number;
    /**
     * The height in pixels of the Chart's SVG viewport.
     */
    width?: number;
    /**
     * The number of "vertical" bins that the chart will be divided into.
     */
    binCount?: number;
    /**
     * The radius of the circle that defines the empty space in the center of the chart.
     */
    innerRadius?: number;
    /**
     * The radius of the circle that defines the outer boundary of the chart.
     */
    outerRadius?: number;
    /**
     * The radius of the circle that defines the axis placement.
     */
    axisRadius?: number;
    /**
     * The initial number of ticks on the chart axis.
     */
    tickCount?: number;
    /**
     * The height in pixels with which to pad the top and bottom of the SVG viewport with empty space.
     */
    verticalPad?: number;
}

/**
 * This Chart class is designed for rendering features in a circular context, e.g. bacterial genomes.
 */
export class RadialChart<P extends RadialChartRenderParams> extends ChartBase<P> {
    /**
     * The number of "vertical" bins that the chart will be divided into.
     */
    binCount: number;
    /**
     * The radius of the circle that defines the empty space in the center of the chart.
     */
    innerRadius: number;
    /**
     * The radius of the circle that defines the outer boundary of the chart.
     */
    outerRadius: number;
    /**
     * The radius of the circle that defines the axis placement.
     */
    axisRadius?: number;
    /**
     * A d3 selection of the radial track.
      */
    trackSelection: d3.Selection<any, any, any, any>;
    /**
     * A d3 selection to the radial axis.
     */
    _axisSelection?: d3.Selection<any, any, any, any>;
    /**
     * The initial number of ticks to display on the radial axis. D3 usually refuses to use the actual number
     * supplied, and instead it tries really hard to make it even and "pretty."
     */
    tickCount: number;

    /**
     * The base Chart constructor makes a d3 selection of the provided selector and creates an SVG inside of the
     * resulting DOM container. If explicit height and width arguments are provided, the SVG will be created to
     * match those dimensions. Otherwise, it will set the SVG to the dimensions of the targeted DOM container.
     * @param config
     */
    public constructor(config: RadialChartConfig) {
        super(config);
        this.width = config.width || this.getSvgWidth();
        this.height = (config.width || this.getSvgHeight()) + this.verticalPad + this.verticalPad * 2;

        this.innerRadius = config.innerRadius || this.width / 3;
        this.outerRadius = config.outerRadius || this.width / 2;
        this.binCount = config.binCount || 1;
        this.tickCount = config.tickCount || 10;

        let trackAnnotation = buildTrackAnnotation();
        let trackArcConfig: ArcConfig<Annotation, RadialChart<RadialChartRenderParams>> = {
            selector: 'radial-track-annotation',
            radius: () => this.outerRadius,
            startAngle: () => 3.14,
            endAngle: () => 6.28 * 2,
            arcHeight: () => this.outerRadius - this.innerRadius,
            translate: () => `translate(${this.height/2}, ${this.height/2})`,
            fillColor: () => '#ee7f7a',
            strokeColor: () => '#ee7f7a',
        }

        this.trackSelection = arcGlyph(this, [trackAnnotation], trackArcConfig);

        this.configureZoom()
    }

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
                .on('zoom', () => self.zoom(d3.event.transform))
            )
            .on("dblclick.zoom", null);

        // adjust the internal zoom for the initial translate that centers the chart
        this.svgSelection.node().__zoom.x = this.height/2;
        this.svgSelection.node().__zoom.y = this.height/2;
    }

    public configureAxis() {
        // TODO: I'd like to keep this as a property on the chart object,
        //       but to do that in a reasonable way I'll need type declarations
        let axis = axisRadialOuter(this.getXScale(), this.outerRadius);
        axis.ticks(this.tickCount);

        this._axisSelection = this.svgSelection
            .append('g')
            .attr("transform", `translate(${this.height/2}, ${this.height/2})`)
            .call(axis);

        // initialize style parameters
        this._axisSelection.select("path.domain")
            .style('stroke',  '#ee7f7a');

        this._axisSelection.selectAll('text')
            .style('stroke', '#181d24')
            .style('fill', '#181d24')
            .style('font-size', 12)
    }

    protected clearAxis(): void {
        if (this._axisSelection !== undefined) {
            this._axisSelection
                .remove();
        }
    }

    public zoom(transform?: Transform) {
        if (transform == undefined) {
            transform = this.svgSelection.node().__zoom;
            if (transform == undefined) {
                console.warn("no transform defined on", this, ", can't zoom");
                return
            }
        }
        let zb = new RadialChartArcZoomBehavior('ann')
        const selection = this.svgSelection.selectAll<SVGElement, Annotation>(zb.selector);
        zb.apply(this, selection);

        let axisSelection = this.getAxisSelection();

        axisSelection.select("path.domain")
            .style('stroke',  '#ee7f7a');

        this.trackSelection.attr("transform", `translate(${transform.x}, ${transform.y}) scale(${transform.k})`);
        axisSelection.attr("transform", `translate(${transform.x}, ${transform.y}) scale(${transform.k})`);

        // TODO: I'd rather not create a new axis every time
        let axis = axisRadialOuter(this.getXScale(), this.outerRadius);

        // we'll set the ticks by multiplying the tick
        // count by the transform scale factor k rounded
        // this seems to work well enough for now
        let kRounded = Math.round(transform.k)
        axis.ticks(this.tickCount * kRounded);

        axisSelection.call(axis);

        // scale the ticks by the inverse of the scaling factor
        axisSelection.selectAll('text')
            .style('stroke', '#181d24')
            .style('fill', '#181d24')
            .style('font-size', 12)
            .attr('transform', `scale(${1/transform.k})`);

        axisSelection.selectAll('line')
            .attr('transform', `scale(${1/transform.k})`);
    }

    /**
     * Get the semantic coordinate range of what is currently shown in the Chart's viewport.
     */
    public getSemanticViewRange(): {start: number, end: number, width: number} {
        // TODO: this is lifted from the TrackChart, and doesn't make sense in this context
        //       it needs to be rewritten to cleverly figure out which section of the circle
        //       is currently visible within the SVG viewport
        const viewStart = this.getXScale().invert(0);
        const viewEnd = this.getXScale().invert(this.width);
        const viewChrWidth = viewEnd - viewStart;
        return ({start: viewStart, end: viewEnd, width: viewChrWidth});
    }

    public getAxisSelection(): d3.Selection<any, any, any, any> {
        if (this._axisSelection == null) {
            throw("_axisSelection is null or undefined");
        }
        return this._axisSelection;
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
            .range([0, 2 * Math.PI]);
    }

    /**
     * @param params
     */
    protected preRender(params: P): void {
        this.configureAxis();
    }

    /**
     * @param params
     */
    protected inRender(params: P): void {
        let arcConfig: ArcConfig<Annotation, RadialChart<RadialChartRenderParams>> = {
            selector: 'ann',
            radius: () => this.outerRadius,
            startAngle: (a, c) => c.getXScale()(a.x),
            endAngle: (a, c) => c.getXScale()(a.x + a.w),
            arcHeight: () => this.outerRadius - this.innerRadius,
            translate: () => `translate(${this.height/2}, ${this.height/2})`,
            fillColor: () => 'black',
            strokeColor: () => 'black',
            zoom: new RadialChartArcZoomBehavior('ann'),
        }

        arcGlyph(this, params.ann, arcConfig);
    }

    /**
     * @param params
     */
    protected postRender(params: P): void {
        this.zoom();
    }

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

    /**
     * This resets the x scale to agree with the render parameters then calls render(). This method should be called
     * for an initial render, or a render that is intended to reset the view in some way (e.g. whenever a 'submit
     * query' button is pressed in a form).
     * @param params
     */
    public initialRender(params: P): void {
        this.clearAxis();
        this.setXScale(params.queryStart, params.queryEnd);
        this.render(params)
    }
}
