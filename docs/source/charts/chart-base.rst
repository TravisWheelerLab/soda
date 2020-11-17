.. _ChartBase:

Chart-base
==========
*Class* ChartBase<P> implements :ref:`Chart<Chart>`
----------------------------------------------------

This is an abstract class that provides some default implementations for Charts. It basically just handles creating and keeping track of an SVG viewport in the DOM, creating a d3 scale that is used to translate between semantic coordinates and viewport coordinates, and provides some utility methods to get information about the dimensions of a Chart's container in the DOM.

:Constructor signature:
 | **new ChartBase(config): ChartBase**
 | The base Chart constructor makes a d3 selection of the provided selector and creates an SVG inside of the resulting DOM container. If explicit height and width arguments are provided, the SVG will be created to match those dimensions. Otherwise, it will set the SVG to the dimensions of the targeted DOM container.

:Type parameters:
 | **P** extends :ref:`ChartRenderParams<ChartRenderParams>`
 |


:Arguments:
 | **config**: :ref:`ChartConfig<ChartConfig>`
 |  
 |


:Properties:
 | **_renderParams**: P | undefined
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


:Methods:
 | **alertPlugins()**: void
 | This calls each of this Chart's attached plugin's alert() method.
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
 | Get a reference to the Chart's internal d3 scale used for translating between semantic and viewport coordinates.
 | 
 | **inRender(params)**: void
 | This abstract method should be implemented to use soda's glyph rendering module to actually render the appropriate glyphs using the provided render parameters.
 :Arguments:
  | **params**: P
  |  
  |
 | 
 | **postRender(params)**: void
 | This abstract method should be implemented to perform anything that needs to be done in the chart after a render has taken place. This will generally be things like alerting plugins or calling the zoom trigger.
 :Arguments:
  | **params**: P
  |  
  |
 | 
 | **preRender(params)**: void
 | This abstract method should be implemented to perform anything that needs to be done in the Chart before it actually starts to render something. This will generally be things like updating the query range parameters.
 :Arguments:
  | **params**: P
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
 | Set the internal d3 scale to map from the provided semantic query range to the Chart's current viewport dimensions.
 :Arguments:
  | **queryStart**: number
  | 
  |
  | **queryEnd**: number
  |  
  |
 | 