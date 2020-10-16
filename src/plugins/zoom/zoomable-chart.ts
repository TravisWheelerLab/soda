import {Chart} from "../../charts/chart";
import {ZoomBehavior} from "./zoom-behavior";
import {ZoomController} from "./zoom-controller";

export interface ZoomableChart<T> extends Chart<T> {
    zoomController?: ZoomController;
    registerZoomController(controller: ZoomController): void;
    zoomBehaviors?: ZoomBehavior<ZoomableChart<T>, any>[];
    getZoomBehaviors(): ZoomBehavior<ZoomableChart<T>, any>[];
}

export function isZoomableChart<T>(chart: Chart<T>): chart is ZoomableChart<T> {
    return (<ZoomableChart<T>> chart).zoomBehaviors !== undefined;
}
