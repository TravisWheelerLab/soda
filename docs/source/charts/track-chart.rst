.. _TrackChart:

.. _TrackChartConfig:

.. _TrackChartRenderParams:

.. _DEFAULT_TRACK_CHART_TRANSLATE_EXTENT

Track-chart
===========
*Class* TrackChart<P> extends :ref:`ChartBase<ChartBase>` implements :ref:`Chart<Chart>`, :ref:`ResizableChart<ResizableChart>`, :ref:`ZoomableChart<ZoomableChart>`
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

This is an extended Chart class that was designed to fit the basic needs of a "track visualization." It is a zoomable, resizable Chart that serves as a fully functional visualizer for simple needs, but also as a strong starting point for another Chart extension for a more nuanced use-case.

:Constructor signature:
 | **new TrackChart(config): TrackChart**

:Type parameters:
 | **P** extends :ref:`TrackChartRenderParams<TrackChartRenderParams>`
 |


:Arguments:
 | **config**: :ref:`TrackChartConfig<TrackChartConfig>`
 |


:Properties:
 | **_renderParams**: P | undefined
 | The last used render parameters.
 |
 | **_xScale**: :ref:`d3.ScaleLinear<d3.ScaleLinear>` <number, number>
 | A d3 scale that the Chart will use to translate between semantic and SVG viewport coordinates.
 |
 | **binCount**: number
 | This keeps track of the number of vertical "bins" present in this TrackChart's current visualization.
 |
 | **binHeight**: number
 | The height in pixels of a horizontal bin in the visualization. Generally, the y coordinate of an Annotation glyph will be given in terms of which bin it should be rendered in. This defaults to a value of 10.
 |
 | **height**: number
 | The height in pixels of the Chart's SVG viewport.
 |
 | **plugins**: :ref:`Plugin<Plugin>` []
 | A list of plugins attached to the Chart.
 |
 | **scaleExtent**: None
 | A list of two numbers that define the extent to which a zoom event is allowed to transform the TrackChart's underlying scale. Simply put, this controls how far in and out a user will be able to zoom. The first number is the maximum zoom-out factor, and the second is the maximum zoom-in factor. For example, setting this to [1, 10] will prevent a user from zooming out past the point at which the chart is initially rendered, and allow them to zoom in by a factor of 10. For more info, see https://github.com/d3/d3-zoom/blob/master/README.md#zoom_scaleExtent
 |
 | **selector**: string
 | A string that can be used to uniquely select the target DOM container via d3.select().
 |
 | **svgSelection**: :ref:`Selection<Selection>` <any, any, any, any>
 | A d3 selection of the Chart's SVG viewport.
 |
 | **translateExtent**: (chart: TrackChart <any>): None
 | This is a callback function that is used to set the translate extent (left/right panning) allowed when a zoom event is applied to the TrackChart. It needs to be a callback, because it needs the absolute width of the TrackChart's SVG viewport, which is allowed to change throughout the TrackChart's lifetime. For example, setting this to: (chart) => [[0, 0], [chart.width, chart.height]] will restrict the panning in the TrackChart to exactly the range that was initially rendered. For more info, see https://github.com/d3/d3-zoom/blob/master/README.md#zoom_translateExtent
 |
 | **width**: number
 | The width in pixels of the Chart's SVG viewport.
 |
 | **yOffset**: number
 | This defines which bin (starting from the top) this TrackChart will start rendering in.
 |
 | **zoomBehaviors**: :ref:`ZoomBehavior<ZoomBehavior>` <:ref:`TrackChart<TrackChart>` <P>, any> []
 | The list of ZoomBehaviors that this chart will pass to the ZoomController during a zoom event. These objects define how all of the different glyphs rendered in this TrackChart will be transformed during a zoom event.
 |
 | **zoomController**: :ref:`ZoomController<ZoomController>`
 | The ZoomController that this chart accepts zoom events from. If the TrackChart has a ZoomController, it will default to using the controller's scale instead of the TrackChart's internal scale.
 |


:Methods:
 | **alertPlugins()**: void
 | This calls each of this Chart's attached plugin's alert() method.
 | 
 | **callZoomTrigger()**: void
 | This is the handler method that will be called when the SVG viewport receives a browser zoom event. If there is no ZoomController defined, it will do nothing.
 | 
 | **configureZoom()**: void
 | This configures the SVG viewport to appropriately handle browser zoom events. It is called in the constructor, and in the TrackChart's resize() method. Currently, most of what this does is prevent zooming with the scroll wheel unless the ctrl key is pressed, and re-applies the scale and translate extents. Eventually, this should end up being parameterized to be a bit more user-configurable.
 | 
 | **getContainerDimensions()**: :ref:`DOMRect<DOMRect>`
 | This uses d3 to select the Chart's DOM container and returns a DOMRect that describes that containers dimensions.
 | 
 | **getContainerHeight()**: number
 | This returns the Chart's DOM container's height in pixels.
 | 
 | **getContainerWidth()**: number
 | This returns the Chart's DOM container's width in pixels.
 | 
 | **getRenderParams()**: P
 | Getter for the Chart's previously used render parameters.
 | 
 | **getSemanticViewRange()**: None
 | Get the semantic coordinate range of what is currently shown in the Chart's viewport.
 | 
 | **getSvgDimensions()**: :ref:`DOMRect<DOMRect>`
 | This returns a DOMRect that describes the SVG viewport's dimensions.
 | 
 | **getXScale()**: :ref:`ScaleLinear<ScaleLinear>`
 | Getter for the TrackChart's d3 scale that maps between semantic coordinates and viewport coordinates. If there is ZoomController assigned to the TrackChart, it will return the ZoomController's scale instead.
 | 
 | **getZoomBehaviors()**: :ref:`ZoomBehavior<ZoomBehavior>` []
 | This is called by a ZoomController during a zoom event to receive the list of ZoomBehaviors that the ZoomController will then use to re-render the glyphs in the TrackChart appropriately given the new zoom level.
 | 
 | **inRender(params)**: void
 | This method is called by render() after preRender() is called. This is where a customized TrackChart should make calls to the glyph rendering module with arguments in the RenderParams. The implementation here actually doesn't do anything, since there is no real common implementation.
 :Arguments:
  | **params**: P
  |  
  |
 | 
 | **postRender(params)**: void
 | This is called by render() after inRender() is called. Here, it is responsible for just calling the TrackChart's zoom trigger.
 :Arguments:
  | **params**: P
  |  
  |
 | 
 | **preRender(params)**: void
 | This sets the binCount, x scale, and height of the TrackChart to appropriately handle the render.
 :Arguments:
  | **params**: P
  |  
  |
 | 
 | **registerZoomController(controller)**: void
 | Register a ZoomController to the TrackChart. This will not currently register the TrackChart with a ZoomController. Instead, when a Chart is added to a ZoomController, the ZoomController will call this method using itself as an argument.
 :Arguments:
  | **controller**: :ref:`ZoomController<ZoomController>`
  |  
  |
 | 
 | **render(params)**: void
 | This method just stores the render parameters on the Chart and calls preRender(), inRender(), and postRender(). This is set up this way since preRender() and postRender() will often have common implementations, but inRender() generally will not.
 :Arguments:
  | **params**: P
  |  
  |
 | 
 | **resize()**: void
 | This resizes the TrackChart to fit the size of its container. This will be called by a ResizeController if one is assigned to the TrackChart. The default behavior is for the TrackChart to fill its container, reconfigure the zoom settings to match the new size, and then re-render the glyphs to appropriately fit in the new dimensions.
 | 
 | **setHeight(height)**: void
 | This set's the Chart's height to an explicit pixel value.
 :Arguments:
  | **height**: number
  |  
  |
 | 
 | **setToContainerDimensions()**: void
 | This figures out the Chart's DOM container's dimensions, and sets the Chart's viewport SVG to fill those dimensions.
 | 
 | **setXScale(queryStart, queryEnd)**: void
 | This takes the provided query arguments and sets the d3 scale to map between the provided semantic range and the TrackChart's actual SVG viewport coordinate space. If there is a ZoomController assigned to the TrackChart, it will set the ZoomController's scale instead.
 :Arguments:
  | **queryStart**: number
  | 
  |
  | **queryEnd**: number
  |  
  |
 | 

*Interface* TrackChartConfig extends :ref:`ChartConfig<ChartConfig>`
---------------------------------------------------------------------

A simple interface that holds the arguments for the TrackChart constructor.

:Properties:
 | **binHeight**: undefined | number
 |
 | **height**: undefined | number
 |
 | **scaleExtent**: None
 |
 | **selector**: string
 |
 | **translateExtent**: undefined | (chart: TrackChart <any>): None
 |
 | **width**: undefined | number
 |


*Interface* TrackChartRenderParams
-----------------------------------

A simple interface that holds the arguments for the TrackChart render() method.

:Properties:
 | **maxY**: undefined | number
 |
 | **queryEnd**: number
 |
 | **queryStart**: number
 |


*Function* DEFAULT_TRACK_CHART_TRANSLATE_EXTENT
------------------------------------------------

The default unbounded zoom scale translate extent.

:Call signature:
 | **DEFAULT_TRACK_CHART_TRANSLATE_EXTENT(): None**

 | The default unbounded zoom scale translate extent.