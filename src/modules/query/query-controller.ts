import {Chart} from "../../charts/chart";
import {ViewRange} from "../zoom/zoom-controller";

const THRESHOLD = 50;

export interface QuerySignature {
    start: number;
    end: number;
}

export class QueryController<Q extends QuerySignature> {
    charts: Chart<any>[] = [];
    prevQuery?: Q;
    queryCallback?: ((prevQuery: Q, view: ViewRange) => Q);
    renderCallbacks: ((chart: any, query: Q) => void)[] = [];
    polling: boolean = false;
    currentView: ViewRange = {start: 0, end: 0, width: 0};
    lastAlert: number = 0;

    constructor() {

    }

    public add<C extends Chart<any>>(chart: C,
                                     renderCallback: (chart: C, query: Q) => void): void {
        this.charts.push(chart);
        this.renderCallbacks.push(renderCallback);
    }

    public poll(self: QueryController<Q>): void {
        const elapsed = performance.now() - self.lastAlert;
        if (elapsed > THRESHOLD) {
            self.query(self.currentView);
        }
        this.polling = false
    }

    public render(query: Q): void {
        console.log('RENDERING', query);
        this.prevQuery = query;
        for (let i = 0; i < this.charts.length; i++) {
            this.renderCallbacks[i](this.charts[i], query);
        }
    }

    public query(view: ViewRange): void {
        if (this.prevQuery!.start > view.start || this.prevQuery!.end < view.end) {
            let newQuery = this.queryCallback!(this.prevQuery!, view)
            this.render(newQuery)
        }
    }

    public alert(view: ViewRange): void {
        this.currentView = view;
        if (!this.polling) {
            setTimeout(() => this.poll(this), 500)
            this.polling = true;
        }
        this.lastAlert = performance.now();
    }
}
