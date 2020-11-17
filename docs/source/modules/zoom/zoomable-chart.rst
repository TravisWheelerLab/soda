.. _ZoomableChart:

.. _isZoomableChart

Zoomable-chart
==============
*Interface* ZoomableChart<T> extends :ref:`Chart<Chart>`
---------------------------------------------------------

A interface to define what properties and methods need to be implemented on a Chart that is intended to be able to be managed by a ZoomController.

:Type parameters:
 | **T**, generic
 |


:Properties:
 | **_xScale**: :ref:`d3.ScaleLinear<d3.ScaleLinear>` <number, number>
 | A d3 scale that the Chart will use to translate between semantic and SVG viewport coordinates.
 |
 | **binHeight**: number
 | The height in pixels of a horizontal bin in the visualization. Generally, the y coordinate of an Annotation glyph will be given in terms of which bin it should be rendered in. This defaults to a value of 10.
 |
 | **height**: number
 | The height in pixels of the Chart's SVG viewport.
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
 | **zoomBehaviors**: :ref:`ZoomBehavior<ZoomBehavior>` <:ref:`ZoomableChart<ZoomableChart>` <T>, any> []
 | A list of ZoomBehaviors that will define how the Chart's glyphs are re-rendered after a zoom event.
 |
 | **zoomController**: :ref:`ZoomController<ZoomController>`
 | A reference to the Chart's ZoomController.
 |


:Methods:
 | **getContainerHeight()**: number
 | This method should return the height of the Chart's DOM container.
 | 
 | **getContainerWidth()**: number
 | This method should return the width of the Chart's DOM container.
 | 
 | **getSemanticViewRange()**: None
 | This method should return the semantic dimensions of what is currently displayed in the Chart's SVG viewport.
 | 
 | **getXScale()**: :ref:`ScaleLinear<ScaleLinear>`
 | This method should return a reference to whatever d3 scale the chart is using for coordinate translation. This may be a scale internal to the Chart, or it may be a ZoomController's scale.
 | 
 | **getZoomBehaviors()**: :ref:`ZoomBehavior<ZoomBehavior>` []
 | A method to provide access to the Chart's ZoomBehaviors.
 | 
 | **registerZoomController(controller)**: void
 | A method to register a ZoomController to the Chart.
 :Arguments:
  | **controller**: :ref:`ZoomController<ZoomController>`
  |  
  |
 | 
 | **render(params)**: void
 | This method should be responsible for rendering glyphs inside of the Chart.
 :Arguments:
  | **params**: T
  |  
  |
 | 

*Function* isZoomableChart<T>
------------------------------

:Call signature:
 | **isZoomableChart<T>(chart): chart**

 | A custom type guard to check if an arbitrary chart is a ZoomableChart. This is currently not a very strict guard, and it should be used with caution.

:Type parameters:
 | **T**, generic
 |


:Arguments:
 | **chart**: :ref:`Chart<Chart>`
 | The Chart to type check. 
 |