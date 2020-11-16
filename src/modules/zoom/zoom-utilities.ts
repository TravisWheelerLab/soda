import {ZoomableChart} from "./zoomable-chart";
import {ZoomBehavior} from "./zoom-behavior";
import {Chart} from "../../charts/chart";

/**
 * This utility function adds a ZoomBehavior to a Chart.
 * @param chart The target Chart.
 * @param behavior The ZoomBehavior to be registered to the Chart.
 */
export function registerZoomBehavior(chart: ZoomableChart<any>, behavior: ZoomBehavior<Chart<any>, any>): void {
    // if we don't have any zoom behaviors, we'll need to initialize this
    // TODO: think of a safer way to handle this
    if (chart.zoomBehaviors == undefined) {
        chart.zoomBehaviors = [];
    }

    // TODO: resolve the issue of non-unique selectors
    for (const b of chart.zoomBehaviors) {
        // if (behavior.selector == b.selector) {
        //     // if this chart already has a zoomBehavior
        //     // registered to this selector, we'll just return
        //     return;
        // }
    }
    chart.zoomBehaviors.push(behavior);
}
