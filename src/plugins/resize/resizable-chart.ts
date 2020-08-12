import {Chart} from "../../charts/chart";

export interface ResizableChart<T> extends Chart<T> {
    // all we require for a resizable chart is that it provides
    // some sort of method that can be called when a resize occurs
    resize(): void;
}
