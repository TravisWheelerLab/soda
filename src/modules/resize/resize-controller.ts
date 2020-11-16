import { ResizableChart } from "./resizable-chart";

/**
 * This class can be used to synchronize and propagate browser resize events across different Charts.
 */
export class ResizeController {
    /**
     * A list of Charts that the ResizeController will control.
     */
    components: ResizableChart<any>[];

    constructor() {
        this.components = [];
    }

    /**
     * This method will check if any of the component's container's dimensions have changed, and then it will call
     * resize() if they have.
     */
    public trigger() {
        for (const comp of this.components) {
            if (comp.getContainerWidth() !== comp.width) {
                // we'll only do anything if any of the
                // containers have actually changed dimensions
                this.resize();
                return;
            }
        }
    }

    /**
     * This is the method that will actually call resize() on all of the controller's registered components.
     */
    public resize() {
        for (const comp of this.components) {
            comp.resize();
        }
    }

    /**
     * This registers a Chart to the controller.
     * @param component
     */
    public addComponent<T>(component: ResizableChart<T>) {
       this.components.push(component);
    }

    /**
     * This registers a list of Charts to the controller.
     * @param components
     */
    public addComponents(components: ResizableChart<any>[]): void {
        for (const comp of components) {
            this.addComponent(comp);
        }
    }
}
