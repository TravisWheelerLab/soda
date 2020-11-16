import {Chart} from "../../charts/chart";
import {ZoomBehavior} from "./zoom-behavior";
import {ZoomController} from "./zoom-controller";

/**
 * A interface to define what properties and methods need to be implemented on a Chart that is intended to be able
 * to be managed by a ZoomController.
 */
export interface ZoomableChart<T> extends Chart<T> {
    /**
     * A reference to the Chart's ZoomController.
     */
    zoomController?: ZoomController;
    /**
     * A list of ZoomBehaviors that will define how the Chart's glyphs are re-rendered after a zoom event.
     */
    zoomBehaviors?: ZoomBehavior<ZoomableChart<T>, any>[];
    /**
     * A method to register a ZoomController to the Chart.
     * @param controller
     */
    registerZoomController(controller: ZoomController): void;

    /**
     * A method to provide access to the Chart's ZoomBehaviors.
     */
    getZoomBehaviors(): ZoomBehavior<ZoomableChart<T>, any>[];
}

/**
 * A custom type guard to check if an arbitrary chart is a ZoomableChart. This is currently not a very strict guard,
 * and it should be used with caution.
 * @param chart The Chart to type check.
 */
export function isZoomableChart<T>(chart: Chart<T>): chart is ZoomableChart<T> {
    return (<ZoomableChart<T>> chart).zoomBehaviors !== undefined;
}
