.. _AxisChart:

.. _AxisRenderParams:

Axis-chart
==========
*Class* AxisChart extends :ref:`ChartBase<ChartBase>` implements :ref:`Chart<Chart>`, :ref:`ResizableChart<ResizableChart>`, :ref:`ZoomableChart<ZoomableChart>`
-----------------------------------------------------------------------------------------------------------------------------------------------------------------

The AxisChart is a simple chart that displays a horizontal axis with semantic coordinates.

:Constructor signature:
 | **new AxisChart(config): AxisChart**

:Arguments:
 | **config**: :ref:`ChartConfig<ChartConfig>`
 |


:Properties:
 | **_axis**: Axis | undefined
 | The d3 Axis object that will be rendered by the AxisChart. It will be defined after render() is called.
 |
 | **_axisSelection**: Selection | undefined
 | A d3 selection to the DOM elements that the axis will be rendered as. It will be defined after render() is called.
 |
 | **_queryEnd**: number | undefined
 | The end of the currently displayed query in semantic coordinates.
 |
 | **_queryStart**: number | undefined
 | The start of the currently displayed query in semantic coordinates.
 |
 | **_renderParams**: AxisRenderParams | undefined
 | The last used render parameters.
 |
 | **_xScale**: :ref:`d3.ScaleLinear<d3.ScaleLinear>` <number, number>
 | A d3 scale that the Chart will use to translate between semantic and SVG viewport coordinates.
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
 | **selector**: string
 | A string that can be used to uniquely select the target DOM container via d3.select().
 |
 | **svgSelection**: :ref:`Selection<Selection>` <any, any, any, any>
 | A d3 selection of the Chart's SVG viewport.
 |
 | **width**: number
 | The width in pixels of the Chart's SVG viewport.
 |
 | **zoomBehaviors**: ZoomBehavior [] | undefined
 | The list of ZoomBehaviors for the Chart. There won't actually be any ZoomBehaviors for an AxisChart, as it uses the default d3 zooming functionality.
 |
 | **zoomController**: :ref:`ZoomController<ZoomController>`
 | The ZoomController that this chart accepts zoom events from.
 |


:Methods:
 | **alertPlugins()**: void
 | This calls each of this Chart's attached plugin's alert() method.
 | 
 | **clearAxis()**: void
 | This removes all of the SVG elements that the AxisChart has rendered.
 | 
 | **getAxis()**: :ref:`Axis<Axis>`
 | The getter function for the d3 Axis object. This should be used when accessing the axis.
 | 
 | **getAxisSelection()**: :ref:`Selection<Selection>`
 | The getter for the d3 selection of all of the SVG elements rendered by the AxisChart.
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
 | **getQueryEnd()**: number
 | The getter for _queryEnd.
 | 
 | **getQueryStart()**: number
 | The getter for _queryStart.
 | 
 | **getRenderParams()**: :ref:`AxisRenderParams<AxisRenderParams>`
 | Getter for the Chart's previously used render parameters.
 | 
 | **getSemanticViewRange()**: None
 | Get the semantic coordinate range of what is currently shown in the Chart's viewport.
 | 
 | **getSvgDimensions()**: :ref:`DOMRect<DOMRect>`
 | This returns a DOMRect that describes the SVG viewport's dimensions.
 | 
 | **getXScale()**: :ref:`ScaleLinear<ScaleLinear>`
 | The getter for the d3 scale that is used for the axis.
 | 
 | **getZoomBehaviors()**: :ref:`ZoomBehavior<ZoomBehavior>` []
 | This returns the AxisCharts ZoomBehaviors. Currently, this returns an empty list by default, since AxisCharts do not actually use ZoomBehaviors. Instead, this calls internal functions that will appropriately re-render the AxisChart for the new zoom level. This is somewhat of a bandaid fix, and I expect it to change at some point.
 | 
 | **inRender()**: void
 | This creates the d3 Axis object and uses it to render the SVG elements.
 | 
 | **postRender()**: void
 | There is currently no postRender routine for the AxisChart, so this does nothing.
 | 
 | **preRender(params)**: void
 | This updates the query range with the given parameters, and then uses setXScale() to set the internal d3 scale.
 :Arguments:
  | **params**: :ref:`AxisRenderParams<AxisRenderParams>`
  |  
  |
 | 
 | **registerZoomController(controller)**: void
 | Register a ZoomController to the AxisChart. This will not currently register the AxisChart with a ZoomController. Instead, when a Chart is added to a ZoomController, the ZoomController will call this method using itself as an argument.
 :Arguments:
  | **controller**: :ref:`ZoomController<ZoomController>`
  |  
  |
 | 
 | **render(params)**: void
 | This method just stores the render parameters on the Chart and calls preRender(), inRender(), and postRender(). This is set up this way since preRender() and postRender() will often have common implementations, but inRender() generally will not.
 :Arguments:
  | **params**: :ref:`AxisRenderParams<AxisRenderParams>`
  |  
  |
 | 
 | **resize()**: void
 | This resizes the Axis to fit the size of its container. This will be called by a ResizeController if one is assigned to the AxisChart.
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
 | **setXScale()**: void
 | This uses the AxisChart's current queryStart and queryEnd to set the d3 scale used for the axis.
 | 

*Interface* AxisRenderParams
-----------------------------

A simple interface that holds the arguments for the AxisChart render function.

:Properties:
 | **queryEnd**: number
 | The start of the query in semantic coordinates.
 |
 | **queryStart**: number
 | The start of the query in semantic coordinates.
 |