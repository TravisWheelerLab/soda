import * as d3 from 'd3';
import { cloneDeep } from "lodash";
import { Transform } from './transform';
import { ZoomableChart }  from './zoomable-chart'

export class ZoomController {
    // a d3 Transform object to represent the current zoom level
    transform: Transform;
    // a list of zoomable components that we are controlling
    components: ZoomableChart<any>[];

    // the actual width of the components we are controlling
    // I think we should always assume that one zoom controller
    // always handles components of equal dimensions
    _width?:      number;
    _queryStart?: number;
    _queryEnd?:   number;

    // maps from query range to pixels
    _xScale?:        d3.ScaleLinear<number, number>;
    // rescaled variant for current zoom level
    _zoomedXScale?:  d3.ScaleLinear<number, number>;

    constructor() {
        this.transform = cloneDeep(d3.zoomIdentity);
        this.components = [];
    }

    public getWidth(): number {
        if (this._width == undefined) {
            throw('_width is undefined on ZoomController');
        } 
        return (this._width);
    }

    public getQueryStart(): number {
        if (this._queryStart == undefined) {
            throw('_queryStart is undefined on ZoomController');
        } 
        return (this._queryStart);
    }

    public getQueryEnd(): number {
        if (this._queryEnd == undefined) {
            throw('_queryEnd is undefined on ZoomController');
        } 
        return (this._queryEnd);
    }

    public getSemanticViewRange(): {start: number, end: number, width: number} {
        // return information about the range that is currently in the view
        const viewStart = this.getZoomedXScale().invert(0);
        const viewEnd = this.getZoomedXScale().invert(this.getWidth());
        const viewWidth = viewEnd - viewStart;
        return ({start: viewStart, end: viewEnd, width: viewWidth});
    }

    public zoomToRange(start: number, end: number): void {
        // zooms and pans to center on the range start:end
        // first, we'll figure out what range our view currently has
        const viewChr = this.getSemanticViewRange();

        // now find the width of the region we want to jump to
        const jumpChrWidth = (end - start);
        // and figure out how much to scale our transform k value
        const kScale = (viewChr.width / jumpChrWidth);
        
        // apply the scale to k and update the scales
        this.transform.k = this.transform.k * kScale;
        this.updateZoomedScale();

        // now that our scales are updated, we can figure out exactly 
        // how far away in pixels our new range is
        const jumpPxStart = this.getZoomedXScale()(start);

        // now apply that pixel difference to our transform x value
        // and update the scales again
        this.transform.x -= jumpPxStart;
        this.updateZoomedScale();

        // finally we can propagate the fully calculated transform
        // across all of our components
        this.updateCompTransforms();
        this.zoomedRender();
    }

    public getXScale(): d3.ScaleLinear<number, number> {
        if (this._xScale == undefined) {
            throw('_xScale is not defined on ZoomController');
        }
        return (this._xScale);
    }

    public getZoomedXScale(): d3.ScaleLinear<number, number> {
        if (this._zoomedXScale == undefined) {
            throw('_zoomedXScale is not defined on ZoomController');
        }
        return (this._zoomedXScale);
    }

    public setQueryRange(queryStart: number, queryEnd: number) {
        this._queryStart = queryStart; 
        this._queryEnd = queryEnd; 
    }

    public setXScale(): void {
        //  reset the scales to the object's query range
        this._xScale = d3.scaleLinear()
            .domain([this.getQueryStart(), this.getQueryEnd()])
            .range([0, this.getWidth()]);

        // reset the zoom scaling
        this._zoomedXScale = this.transform.rescaleX(this._xScale);
    }

    public setToComponentWidth(): void {
        // TODO: this is almost certainly not how I want to do this,
        //       but it will work for now
        //       It's possible that in the future we will have components
        //       with different sizes
        if (this.components[0] !== null){
            this._width = this.components[0].getContainerWidth();
        }
    }

    public checkForWidthChange(): boolean {
        // check if any of the components have a different width than their container
        for (const comp of this.components) {
            if (comp.width !== this.getWidth()) {
                return true;
            }
        }
        return false;
    }

    protected checkComponentWidthEquality(): boolean {
        let equal = true;
        const firstWidth = this.components[0].width;
        for (const comp of this.components.slice(1)) {
            if (firstWidth !== comp.width) {
                console.error(`Width mismatch on component ${comp} in ZoomController`);
                equal = false;
            }
        }
        return (equal);
    }

    public handleResize() {
        // this should be called to deal with components changing in dimensions
        // first get the view range from before the resize
        const view = this.getSemanticViewRange();
        // resize the controller to match the new browser size
        this.setToComponentWidth();
        // reset the controller's x scale to match the new browser size
        this.setXScale();
        // now zoom everything so that we visualize the original
        // semantic view range within the new browser size
        this.zoomToRange(view.start, view.end);
    }

    protected checkForTransformDifference(transform: Transform): boolean {
        return this.transform.k !== transform.k || this.transform.x !== transform.x || this.transform.y !== transform.y;

    }

    public trigger(callerTransform: Transform): void {
        if (this.checkForWidthChange()) {
            this.handleResize();
            this.checkComponentWidthEquality();
        }
        if (this.checkForTransformDifference(callerTransform)) {
            // set the zoom controllers internal transform to that of the caller
            this.transform = cloneDeep(callerTransform);
            // rescale our scales
            this.updateZoomedScale();
            // sync the internal transforms across all components
            this.updateCompTransforms();
            // finally, render everything in its zoomed form
            this.zoomedRender();
        }
    }

    public updateZoomedScale(): void {
        this._zoomedXScale = this.transform.rescaleX(this.getXScale());
    }

    public updateCompTransforms(): void {
        for (const comp of this.components) {
            // grab the internal transform object on the component
            const compInternalTransform = comp.svgSelection.node().__zoom;
            // configure it to be equal to the internal transform from the caller component
            // * it's possible for the internal transform to be undefined, in which case
            // * we just don't have to worry about it
            if (compInternalTransform !== undefined) {
                compInternalTransform.k = this.transform.k;
                compInternalTransform.x = this.transform.x;
                compInternalTransform.y = this.transform.y;
            }
        }
    }
    
    public zoomedRender(): void {
        // for every component the controller is paying attention to,
        // grab the zoom behaviors, make a selection, and apply the behavior
        for (const comp of this.components) {
            for (const behavior of comp.getZoomBehaviors()) {
                // ** we want to make this selection out here, so that we could possibly
                // ** apply a secondary selector to distinguish between charts
                const selection = d3.selectAll(behavior.selector);
                behavior.apply(this, selection);
            }
        }
    }
    
    public addComponent(component: ZoomableChart<any>): void {
        // if the width wasn't set in the config, grab the width of a component
        if (this._width == undefined) {
            this._width = component.width;
        }
        else if (this.getWidth() !== component.width) {
            console.error(`Warning: width of component ${component} does not match width of zoom controller`);
        }
        this.components.push(component);
        component.registerZoomController(this);
        // TODO: is this insane? it seems that by default, d3 will give each element a reference
        //       to d3.zoomIdentity when they are initially rendered. When using d3 normally, applying
        //       a transform to some object would then swap this reference out with a new Transform.
        //       In our case though, we're directly messing with the internal Transform, so we need to
        //       explicitly make a new Transform immediately.
        component.svgSelection.node().__zoom = cloneDeep(component.svgSelection.node().__zoom);
    }
}
