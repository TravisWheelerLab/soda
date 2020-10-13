import { ResizableChart } from "./resizable-chart";

// an object to synchronize and propagate browser resize events across different charts
export class ResizeController {
    // if we are using a zoom controller in the visualization, we are going to need to
    // interact with it during a resize event
    components: ResizableChart<any>[];

    constructor() {
        this.components = [];
    }

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

    public resize() {
        for (const comp of this.components) {
            comp.resize();
        }
    }

    public addComponent<T>(component: ResizableChart<T>) {
       this.components.push(component);
    }

    public addComponents(components: ResizableChart<any>[]): void {
        for (const comp of components) {
            this.addComponent(comp);
        }
    }
}
