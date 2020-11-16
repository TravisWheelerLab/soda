import { Chart } from "../../charts/chart";

/**
 * A simple interface that defines what a Chart needs to implement in order to be registered to a ResizeController.
 */
export interface ResizableChart<T> extends Chart<T> {
    /**
     * This method should be responsible for resizing the Chart whenever necessary.
     */
    resize(): void;
}
