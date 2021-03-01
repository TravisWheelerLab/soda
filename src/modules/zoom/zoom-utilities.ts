import {ZoomableChart} from "./zoomable-chart";
import {ZoomBehavior} from "./zoom-behavior";
import {Chart} from "../../charts/chart";

/**
 * This utility function adds a ZoomBehavior to a Chart.
 * @param chart The target Chart.
 * @param behavior The ZoomBehavior to be registered to the Chart.
 */
export function registerZoomBehavior(chart: ZoomableChart<any>, behavior: ZoomBehavior<Chart<any>, any>): void {
    if (chart.zoomBehaviors == undefined) {
        chart.zoomBehaviors = [];
    }

    for (const b of chart.zoomBehaviors) {
        if (behavior.selector == b.selector && behavior.id == b.id) {
            return;
        }
    }
    chart.zoomBehaviors.push(behavior);
}
