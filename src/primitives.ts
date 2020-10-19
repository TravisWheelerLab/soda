import {Chart} from "./charts/chart";
export * from './primitives/rectangle';
export * from './primitives/line';
export * from './primitives/text';
export * from './primitives/chevron-rectangle';

import { ZoomableChart, ZoomBehavior } from "./plugins/zoom";

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
