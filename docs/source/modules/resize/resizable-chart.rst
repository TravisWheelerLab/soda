.. _ResizableChart:

Resizable-chart
===============
*Interface* ResizableChart<T> extends :ref:`Chart<Chart>`
----------------------------------------------------------

A simple interface that defines what a Chart needs to implement in order to be registered to a ResizeController.

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
 | **render(params)**: void
 | This method should be responsible for rendering glyphs inside of the Chart.
 :Arguments:
  | **params**: T
  |  
  |
 | 
 | **resize()**: void
 | This method should be responsible for resizing the Chart whenever necessary.
 | 