import { ZoomController } from '../zoom/zoom-controller';
import { ResizableChart } from "./resizable-chart";

// an object to synchronize and propogate browser resize events across different charts
export class ResizeController {
    // if we are using a zoom controller in the visualization, we are going to need to
    // interact with it during a resize event
    zoomController?: ZoomController;
    components: ResizableChart<any>[];
    
    constructor() {
        this.components = [];
    }
    
    setZoomController(controller: ZoomController): void {
        this.zoomController = controller;
    } 
    
    public zoomControllerResize(): void {
        // make adjustments to the zoom controller to achieve
        // consistent rendering on resize
        if (this.zoomController !== undefined) {
            // first get the view range from before the resize
            const view = this.zoomController.getSemanticViewRange();
            // resize the controller to match the new browser size
            this.zoomController.setToComponentWidth();
            // reset the controller's x scale to match the new browser size
            this.zoomController.setXScale();
            // now zoom everything so that we visualize the original
            // semantic view range within the new browser size
            this.zoomController.zoomToRange(view.start, view.end);
        }
    }

    public onBrowserResize() {
        for (const comp of this.components) {
            comp.resize();
        }
        this.zoomControllerResize();
    }

    public addComponent<T>(component: ResizableChart<T>) {
        this.components.push(component);
    } 
}
