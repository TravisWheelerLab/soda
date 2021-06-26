import {Chart} from "../../charts/chart";
import * as d3 from "d3";
import {QueryController, QueryParameters} from "../query/query-controller";
import {ViewRange, ZoomController} from "../zoom/zoom-controller";
import {ResizeController} from "../resize/resize-controller";

/**
 * A simple interface that holds the arguments for a TrackRack constructor.
 */
export interface TrackRackConfig<Q extends QueryParameters> {
    /**
     * A string that can be used to uniquely select the target DOM container via d3.select().
     */
    selector: string;
    /**
     * A callback function that can produce a new QuerySignature given the previous query and a ViewRange. This is
     * passed to the internal QueryController.
     */
    queryBuilder: (prevQuery: Q, view: ViewRange) => Q;
    /**
     * A list of query width thresholds at which to switch renderCallbacks. This is passed to the internal
     * QueryController.
     */
    widthThresholds?: number[];
}

/**
 * This class is a convenience class for setting up multi-track visualizations. It maintains a ZoomController,
 * ResizeController, and a QueryController for all added Charts. When a chart is added, it is placed onto the 'rack,'
 * which is a div that consists of two columns. The Left column has an SVG for each Chart, suitable for
 * labeling/information. The right column holds all of the charts.
 */
export class TrackRack<Q extends QueryParameters> {
    /**
     * A string that can be used to uniquely select the target DOM container via d3.select().
     */
    selector: string;
    /**
     * The ZoomController that will be used across all added Charts.
     */
    zoomController: ZoomController;
    /**
     * The ResizeController that will be used across all added Charts.
     */
    resizeController: ResizeController;
    /**
     * The QueryController that will be used across all added Charts.
     */
    queryController: QueryController<Q>;
    /**
     * The number of Charts that live in this TrackRack.
     */
    compCount = 0;
    /**
     * The list of Charts that live in this TrackRack.
     */
    charts: Chart<any>[] = [];
    /**
     * A D3 selection to the HTML div that contains the entire TrackRack.
     */
    divSelection: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>

    constructor(config: TrackRackConfig<Q>) {
        this.selector = config.selector;
        this.divSelection = d3.select(this.selector)
            .append('div')
            .attr('class', 'track-rack')
            .style('width', '100%')
            .style('height', 'auto')

        this.zoomController = new ZoomController();
        this.resizeController = new ResizeController();
        this.queryController = new QueryController({queryBuilder: config.queryBuilder,
                                                           widthThresholds: config.widthThresholds});
        this.queryController.queryBuilder = config.queryBuilder;
        this.zoomController._queryController = this.queryController;
    }

    /**
     * Adds a chart to the TrackRack. This will expect that the Chart has been instantiated without a selector. If
     * the Chart has been instantiated with a selector, you might get some weird behavior.
     * @param chart The chart to be added.
     * @param renderCallbacks The callbacks that are responsible for accepting query parameters and calling render on
     * the added Chart. If fewer callbacks are provided than there are width thresholds in the QueryController, the
     * last callback will be used repeatedly.
     * @param title The text that will be placed adjacent to the added Chart in the left column of the 'rack.'
     */
    public add<C extends Chart<any>>(chart: C,
                                     renderCallbacks: ((chart: C, query: Q) => void)[],
                                     title?: string): void {

        this.charts.push(chart);

        let compDiv = this.divSelection
            .append('div')
            .attr('class', 'track-rack-component')
            .style('width', '100%')
            .style('height', 'auto')
            .style('display', 'flex')
            .style('align-items', 'center')

        let compBarDiv = compDiv
            .append('div')
            .attr('class', 'track-rack-sidebar')
            .attr('id', `track-rack-bar-${this.compCount}`)
            .style('width', '125px')
            .style('height', '24px')
            .style('margin', '0px 5px 0px 5px')
            .style('flex-shrink', '0')
            .style('display', 'flex')
            .style('justify-content', 'center')
            .style('align-items', 'center')
            .append('p')
            .html(title || '')

        let compChartDiv = compDiv
            .append('div')
            .attr('class', 'track-rack-chart')
            .attr('id', `track-rack-chart-${this.compCount}`)
            .style('width', 'calc(100% - 100px)')
            .style('height', 'auto')
            .style('margin', '0px 5px 0px 5px')
            .style('flex-grow', '1')

        compChartDiv.append(() => chart.svgSelection.node());
        chart.selector = `#track-rack-chart-${this.compCount}`;
        chart.setToSvgDimensions();

        this.compCount++;

        //TODO: fix this ts-ignore
        //@ts-ignore
        this.zoomController.addComponent(chart);
        // }
        //@ts-ignore
        this.resizeController.addComponent(chart);
        // }
        this.queryController.add(chart, renderCallbacks);
    }

    /**
     * This uses the provided QueryParameters as arguments in each Chart's render callback.
     * @param query The provided QueryParameters.
     */
    public render(query: Q): void {
        this.queryController.render(query);
    }

    /**
     * This makes sure the ZoomController is appropiately set up for a new query then calls initalRender() on the
     * queryController.
     * @param query The provided QueryParameters.
     */
    public initialRender(query: Q): void {
        this.zoomController.setQueryRange(query.start, query.end);
        this.zoomController.setXScale();
        this.queryController.initialRender(query);
        this.zoomController.zoomToRange(query.start, query.end);
    }
}
