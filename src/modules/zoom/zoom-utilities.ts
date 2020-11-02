import {ZoomableChart} from "./zoomable-chart";
import {ZoomBehavior} from "./zoom-behavior";
import {Chart} from "../../charts/chart";

export function registerZoomBehavior(chart: ZoomableChart<any>, behavior: ZoomBehavior<Chart<any>, any>): void {
    // if we don't have any zoom behaviors, we'll need to initialize this
    // TODO: think of a safer way to handle this
    if (chart.zoomBehaviors == undefined) {
        chart.zoomBehaviors = [];
    }

    for (const b of chart.zoomBehaviors) {
        // if (behavior.selector == b.selector) {
        //     // if this chart already has a zoomBehavior
        //     // registered to this selector, we'll just return
        //     return;
        // }
    }
    chart.zoomBehaviors.push(behavior);
}
