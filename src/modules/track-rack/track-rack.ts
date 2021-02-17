import {Chart} from "../../charts/chart";
import * as d3 from "d3";
import {QueryController, QueryParameters} from "../query/query-controller";
import {ViewRange, ZoomController} from "../zoom/zoom-controller";
import {ResizeController} from "../resize/resize-controller";
import {isZoomableChart} from "../zoom/zoomable-chart";

export interface TrackRackConfig<Q extends QueryParameters> {
    selector: string;
    queryBuilder: (prevQuery: Q, view: ViewRange) => Q;
    widthThresholds?: number[];
}

export class TrackRack<Q extends QueryParameters> {
    selector: string;
    zoomController: ZoomController;
    resizeController: ResizeController;
    queryController: QueryController<Q>;
    compCount = 0;
    charts: Chart<any>[] = [];
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

    public add<C extends Chart<any>>(chart: C,
                                     renderCallbacks: ((chart: C, query: Q) => void)[],
                                     title?: string): void {

        this.charts.push(chart);

        let compDiv = this.divSelection
            .append('div')
            .attr('class', 'track-rack-component')
            .style('width', '100%')
            .style('height', 'auto')

        let compBarDiv = compDiv
            .append('div')
            .attr('class', 'track-rack-sidebar')
            .attr('id', `track-rack-bar-${this.compCount}`)
            .style('width', '100px')
            .style('float', 'left')
            .style('height', 'auto')
            .append('svg')
            .attr('height', '20px')
            .attr('width' ,'100%')
            .append('text')
            .text(title || ``)
            .attr('x', 10)
            .attr('y', 15)
            .style('fill', 'black')

        let compChartDiv = compDiv
            .append('div')
            .attr('class', 'track-rack-chart')
            .attr('id', `track-rack-chart-${this.compCount}`)
            .style('margin-left', '100px')
            .style('width', 'calc(100% - 100px)')
            .style('height', 'auto')

        compChartDiv.append(() => chart.svgSelection.node())
        chart.selector = `#track-rack-chart-${this.compCount}`;
        chart.setToContainerDimensions();

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

    public render(query: Q): void {
        this.queryController.render(query);
    }

    public initialRender(query: Q): void {
        this.zoomController.setQueryRange(query.start, query.end);
        this.zoomController.setXScale();
        this.queryController.initialRender(query);
        this.zoomController.zoomToRange(query.start, query.end);
    }
}
