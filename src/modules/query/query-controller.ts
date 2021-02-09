import {Chart} from "../../charts/chart";
import {ViewRange} from "../zoom/zoom-controller";

const TIMEOUT_THRESHOLD = 50;

/**
 * A simple interface that defines the parameters of a query.
 */
export interface QueryParameters {
    /**
     * The start of the query in semantic coordinates.
     */
    start: number;
    /**
     * The end of the query in semantic coordinates.
     */
    end: number;
}

export interface QueryControllerConfig<Q extends QueryParameters> {
    /**
     * A callback function that can produce a new QuerySignature given the previous query and a ViewRange
     */
    queryBuilder: ((prevQuery: Q, view: ViewRange) => Q);
    widthThresholds?: number[];
}

/**
 * This class can be used to automate querying and rendering for groups of Charts. A QueryController should be
 * defined such that it manages charts with common query parameters.
 * @param Q The interface that defines the common query parameters.
 */
export class QueryController<Q extends QueryParameters> {
    /**
     * The Charts that the QueryController is managing.
     */
    charts: Chart<any>[] = [];
    /**
     * The most recent query parameters used for rendering.
     */
    prevQuery: Q | undefined;
    /**
     * A callback function that can produce a new QuerySignature given the previous query and a ViewRange
     */
    queryBuilder: ((prevQuery: Q, view: ViewRange) => Q);
    /**
     * A list of thresholds in the semantic view with that determine which rendering callbacks are used at certain
     * zoom levels. This is intended to be used to help set varying levels of detail in a visualization.
     */
    widthThresholds?: number[];
    /**
     * A list of callback functions that are responsible for rendering charts. The functions should be placed in the
     * same order here that they are in the charts property.
     */
    renderCallbacks: ((chart: any, query: Q) => void)[][] = [];
    /**
     * A boolean flag that indicates whether or not the controller is currently in the process of checking for the
     * end of a stream of alerts.
     */
    polling: boolean = false;
    /**
     * The semantic dimensions of the current view displayed in the charts.
     */
    currentView: ViewRange = {start: 0, end: 0, width: 0};
    /**
     * The time in milliseconds of the last alert. This is used by the polling function to decide when to fire a new
     * query.
     */
    lastAlert: number = 0;

    constructor(config: QueryControllerConfig<Q>) {
        this.queryBuilder = config.queryBuilder;
        this.widthThresholds = config.widthThresholds;
    }

    /**
     * Adds a chart to the QueryController.
     * @param chart The chart to be added.
     * @param renderCallbacks The callback that is responsible for accepting query parameters and calling render on
     * the added Chart.
     */
    public add<C extends Chart<any>>(chart: C,
                                     renderCallbacks: ((chart: C, query: Q) => void)[]): void {
        this.charts.push(chart);
        this.renderCallbacks.push([]);
        for (const [i, callback] of renderCallbacks.entries()) {
            this.renderCallbacks[this.charts.length - 1][i] = callback;
        }
    }



    /**
     *  This function polls the last alert time to check if it has been long enough to run a new query. It is called
     *  by alert() using the JS setTimeout() function.
     * @param self
     */
    protected poll(self: QueryController<Q>): void {
        const elapsed = performance.now() - self.lastAlert;
        if (elapsed > TIMEOUT_THRESHOLD) {
            self.query();
        }
        this.polling = false
    }

    /**
     * Get the index of the current threshold for the view.
     * @protected
     */
    protected getThreshold(): number {
        if (this.widthThresholds == undefined ){
            return 0;
        }
        for (const [i, threshold] of this.widthThresholds.entries()) {
            if (this.currentView.width <= threshold) {
                return i;
            }
        }
        return this.widthThresholds.length;
    }

    /**
     * This uses the provided QueryParameters as arguments in each Chart's render callback.
     * @param query The provided QueryParameters.
     */
    public render(query: Q): void {
        this.prevQuery = query;
        for (let i = 0; i < this.charts.length; i++) {
            this.renderCallbacks[i][this.getThreshold()](this.charts[i], query);
        }
    }

    /**
     * After a stream of alerts has finished, this function is called to check if the view has moved outside of the
     * range of the previous query. If it has, the queryBuilder callback is used to generate a new query, and then
     * render() is called with that query.
     */
    public query(): void {
        if (this.prevQuery!.start > this.currentView.start || this.prevQuery!.end < this.currentView.end) {
            let newQuery = this.queryBuilder!(this.prevQuery!, this.currentView)
            this.render(newQuery)
        }
    }

    /**
     * This would typically be called by a ZoomController every time there is a zoom event. It receives the updated
     * ViewRange information and starts the polling process.
     * @param view
     */
    public alert(view: ViewRange): void {
        this.currentView = view;
        if (!this.polling) {
            setTimeout(() => this.poll(this), 750)
            this.polling = true;
        }
        this.lastAlert = performance.now();
    }
}
