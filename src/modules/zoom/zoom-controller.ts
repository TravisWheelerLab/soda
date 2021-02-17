import * as d3 from 'd3';
import { cloneDeep } from "lodash";
import { Transform } from './transform';
import { ZoomableChart }  from './zoomable-chart'
import {QueryController} from "../query/query-controller";

export interface ViewRange {
    start: number;
    end: number,
    width: number
}

/**
* This class can be used to synchronize and propagate browser zoom events across different Charts.
*/
export class ZoomController {
    /**
     * A D3 Transform object that represents the current zoom level relative to the initial render
     */
    transform: Transform;
    /**
     * A list of Charts that the ZoomController will control.
     */
    components: ZoomableChart<any>[];
    /**
     * The width in pixels that the ZoomController expects all of its components to have.
     */
    _width: number | undefined;
    /**
     * The start of the semantic query range that the ZoomController expects its components to be displaying.
     */
    _queryStart: number | undefined;
    /**
     * The end of the semantic query range that the ZoomController expects its components to be displaying.
     */
    _queryEnd: number | undefined;
    /**
     * The initial D3 scale that the ZoomController will use to translate between semantic coordinates and the
     * component's SVG viewport coordinates. This scale will be rescaled and stored as _zoomedXScale after a
     * zoom event takes place.
     */
    _xScale: d3.ScaleLinear<number, number> | undefined;
    /**
     * The rescaled D3 scale that gets created after a zoom event.
     */
    _zoomedXScale: d3.ScaleLinear<number, number> | undefined;

    _queryController?: QueryController<any>;

    constructor() {
        this.transform = cloneDeep(d3.zoomIdentity);
        this.components = [];
    }

    /**
     * Getter for the assumed width of the components of the ZoomController.
     */
    public getWidth(): number {
        if (this._width == undefined) {
            throw('_width is undefined on ZoomController');
        } 
        return (this._width);
    }

    /**
     * Getter for the assumed start of the semantic query range of the components of the ZoomController.
     */
    public getQueryStart(): number {
        if (this._queryStart == undefined) {
            throw('_queryStart is undefined on ZoomController');
        } 
        return (this._queryStart);
    }

    /**
     * Getter for the assumed end of the semantic query range of the components of the ZoomController.
     */
    public getQueryEnd(): number {
        if (this._queryEnd == undefined) {
            throw('_queryEnd is undefined on ZoomController');
        } 
        return (this._queryEnd);
    }

    /**
     * Get the semantic start, end and width of the query that is currently rendered in the ZoomController's components.
     */
    public getSemanticViewRange(): ViewRange {
        // return information about the range that is currently in the view
        const viewStart = this.getZoomedXScale().invert(0);
        const viewEnd = this.getZoomedXScale().invert(this.getWidth());
        const viewWidth = viewEnd - viewStart;
        return ({start: viewStart, end: viewEnd, width: viewWidth});
    }

    /**
     *  This method will adjust the view of each of the ZoomController's components to match the semantic range
     *  provided in the arguments.
     * @param start The start of the new range.
     * @param end The end of the new range.
     */
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

    /**
     * Getter for the initial D3 scale.
     */
    public getXScale(): d3.ScaleLinear<number, number> {
        if (this._xScale == undefined) {
            throw('_xScale is not defined on ZoomController');
        }
        return (this._xScale);
    }

    /**
     * Getter for the D3 scale that has been rescaled to match the current zoom level.
     */
    public getZoomedXScale(): d3.ScaleLinear<number, number> {
        if (this._zoomedXScale == undefined) {
            throw('_zoomedXScale is not defined on ZoomController');
        }
        return (this._zoomedXScale);
    }

    /**
     * This method updates the internal assumed query range of the ZoomController.
     * @param queryStart
     * @param queryEnd
     */
    public setQueryRange(queryStart: number, queryEnd: number) {
        this._queryStart = queryStart; 
        this._queryEnd = queryEnd; 
    }

    /**
     * This method redefines the ZoomController's internal D3 scale with the internal assumed semantic query and
     * component width. For example, if the controlled components are resized in the browser, this should be called
     * so that the scale behaves as intended when transforming between semantic and viewport coordinates.
     */
    public setXScale(): void {
        this._xScale = d3.scaleLinear()
            .domain([this.getQueryStart(), this.getQueryEnd()])
            .range([0, this.getWidth()]);

        // reset the zoom scaling
        this._zoomedXScale = this.transform.rescaleX(this._xScale);
    }

    /**
     * This method sets the internal assumed width of the ZoomController to the width of its first component.
     */
    public setToComponentWidth(): void {
        // TODO: this is almost certainly not how I want to do this,
        //       but it will work for now
        //       It's possible that in the future we will have components
        //       with different sizes
        if (this.components[0] !== null){
            this._width = this.components[0].getContainerWidth();
        }
    }

    /**
     * This utility method checks if any of the ZoomController's components have a width that differs from the
     * ZoomController's internal assumed width. After the first component with a different width is found, the
     * method returns true.
     */
    public checkForWidthChange(): boolean {
        // check if any of the components have a different width than their container
        for (const comp of this.components) {
            if (comp.width !== this.getWidth()) {
                return true;
            }
        }
        return false;
    }

    /**
     * This utility method checks if any of the ZoomController's components have widths that differ from each other.
     */
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

    /**
     * This method should be called whenever we know that the ZoomController's components' widths have changed. It
     * updates the ZoomController's assumed component with to match the component width, adjusts the D3 scales
     * appropriately, and then re-renders the charts to display the semantic query range of the components before
     * the resize occurred.
     */
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

    /**
     * This utility function compares an arbitrary D3 Transform object to the ZoomController's internal Transform
     * object and checks if they represent different zoom transforms.
     * @param transform
     */
    protected checkForTransformDifference(transform: Transform): boolean {
        return this.transform.k !== transform.k || this.transform.x !== transform.x || this.transform.y !== transform.y;

    }

    /**
     * This method is called by a ZoomableChart whenever it receives a browser zoom event. It first checks to see if
     * any of the components have changed size and responds by appropriately updating the ZoomController to
     * accommodate any changes. Next, it checks if the component supplied a D3 Transform argument that actually
     * represents a different zoom level. If the Transform is actually different, it will update the D3 scales and
     * re-render all of the components.
     * @param callerTransform
     */
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

            if (this._queryController !== undefined) {
                this._queryController.alert(this.getSemanticViewRange());
            }
        }
    }

    /**
     * This method rescales the internal D3 Scale with the internal D3 Transform object and stores it on the
     * _zoomedXScale property.
     */
    public updateZoomedScale(): void {
        this._zoomedXScale = this.transform.rescaleX(this.getXScale());
    }

    /**
     * D3 stores Transform objects on DOM elements that have received zoom events. Whenever an element receives a
     * zoom event, the Transform object that bubbles up is computed relative to that pre-existing internal
     * Transform. As such, these internal Transforms need to be set manually whenever a zoom event is propagated
     * onto a component that did not originally receive that event. This method will set each of the
     * ZoomController's components' internal Transforms to match the ZoomController's internal Transform.
     */
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

    /**
     * This method will get a list of ZoomBehaviors from each of its components, and then, for each ZoomBehavior, it
     * will make a D3 Selection to the target glyphs and call the ZoomBehavior's apply() callback with that selection
     * and the component as arguments.
     */
    public zoomedRender(): void {
        // for every component the controller is paying attention to,
        // grab the zoom behaviors, make a selection, and apply the behavior
        for (const comp of this.components) {
            for (const behavior of comp.getZoomBehaviors()) {
                // ** we want to make this selection out here, so that we could possibly
                // ** apply a secondary selector to distinguish between charts
                const selection = d3.selectAll(behavior.selector);
                behavior.apply(comp, selection);
            }
        }
    }

    /**
     * This does the same thing as zoomedRender, but it uses the applyDuration() function on each ZoomBehavior,
     * which makes the ZoomBehavior application seem animated.
     */
    public zoomedRenderDuration(duration: number): void {
        // for every component the controller is paying attention to,
        // grab the zoom behaviors, make a selection, and apply the behavior
        for (const comp of this.components) {
            for (const behavior of comp.getZoomBehaviors()) {
                // ** we want to make this selection out here, so that we could possibly
                // ** apply a secondary selector to distinguish between charts
                const selection = d3.selectAll(behavior.selector);
                behavior.applyDuration(comp, selection, duration);
            }
        }
    }


    /**
     * This method registers a component with the ZoomController. It will also register itself on the added component.
     * @param component The component to be added.
     */
    public addComponent<T>(component: ZoomableChart<T>): void {
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

    /**
     * This method registers a list of components with the ZoomController.
     * @param components
     */
    public addComponents(components: ZoomableChart<any>[]): void {
        for (const comp of components) {
            this.addComponent(comp);
        }
    }
}
