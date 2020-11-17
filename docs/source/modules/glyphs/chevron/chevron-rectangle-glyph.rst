.. _ChevronRectangleConfig:

.. _chevronRectangleGlyph

.. _forwardChevronRectangleGlyph

.. _reverseChevronRectangleGlyph

Chevron-rectangle-glyph
=======================
*Interface* ChevronRectangleConfig<A, C> extends :ref:`ChevronPrimitiveConfig<ChevronPrimitiveConfig>`, :ref:`RectangleConfig<RectangleConfig>`
------------------------------------------------------------------------------------------------------------------------------------------------

An interface that holds the parameters for rendering and configuring a chevron rectangle glyph.

:Type parameters:
 | **A** extends :ref:`OrientedAnnotation<OrientedAnnotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Properties:
 | **backgroundFillColor**: undefined | (a: A, c: C): string
 | A callback to define the color attribute of the rectangle that is used for the background of the chevron glyph.
 |
 | **backgroundFillOpacity**: undefined | (a: A, c: C): number
 | A callback to define the opacity attribute of the rectangle that is used for the background of the chevron glyph.
 |
 | **backgroundH**: undefined | (a: A, c: C): number
 | A callback to define the height attribute of the rectangle that is used for the background of the chevron glyph.
 |
 | **chevronFillColor**: undefined | (a: A, c: C): string
 | A callback to define the fill color of the SVG path that is placed inside of the background rectangle.
 |
 | **chevronFillOpacity**: undefined | (a: A, c: C): number
 | A callback to define the fill opacity of the SVG path that is placed inside of the background rectangle.
 |
 | **chevronH**: undefined | (a: A, c: C): number
 | A callback to define the height of the chevron SVG path that is placed inside of the background rectangle.
 |
 | **chevronSpacing**: undefined | (a: A, c: C): number
 | A callback to define the spacing between chevrons in the SVG pattern that is affixed to the glyph.
 |
 | **chevronStrokeColor**: undefined | (a: A, c: C): string
 | A callback to define the stroke color of the SVG path that is placed inside of the background rectangle.
 |
 | **chevronStrokeOpacity**: undefined | (a: A, c: C): number
 | A callback to define the stroke opacity of the SVG path that is placed inside of the background rectangle.
 |
 | **chevronStrokeWidth**: undefined | (a: A, c: C): number
 | A callback to define the stroke width of the SVG path that is placed inside of the background rectangle.
 |
 | **disableChevronAt**: undefined | number
 | The semantic query width at which the chevron patterns will be disabled. At this point, they will look like regular rectangles or lines.
 |
 | **fillColor**: undefined | (a: A, c: C): string
 | A callback to define the fill color of the rectangle glyph.
 |
 | **h**: undefined | (a: A, c: C): number
 | A callback to define the height of the rectangle glyph.
 |
 | **selector**: string
 |
 | **strokeColor**: undefined | (a: A, c: C): string
 | A callback to define the stroke color of the border around the rectangle glyph.
 |
 | **strokeOpacity**: undefined | (a: A, c: C): number
 | A callback to define the stroke width of the border around the rectangle glyph.
 |
 | **strokeWidth**: undefined | (a: A, c: C): number
 | A callback to define the stroke width of the border around the rectangle glyph.
 |
 | **w**: undefined | (a: A, c: C): number
 | A callback to define the width of the rectangle glyph.
 |
 | **x**: undefined | (a: A, c: C): number
 | A callback to define the semantic x coordinate of the rectangle glyph.
 |
 | **y**: undefined | (a: A, c: C): number
 | A callback to define the y coordinate of the rectangle glyph.
 |
 | **zoom**: :ref:`ZoomBehavior<ZoomBehavior>` <C, :ref:`Selection<Selection>` <:ref:`SVGElement<SVGElement>`, A, :ref:`HTMLElement<HTMLElement>`, any>>
 | A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by experienced users only.
 |


*Function* chevronRectangleGlyph<A, C>
---------------------------------------

:Call signature:
 | **chevronRectangleGlyph<A, C>(chart, ann, conf, orientation): void**


:Type parameters:
 | **A** extends :ref:`OrientedAnnotation<OrientedAnnotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Arguments:
 | **chart**: C
 |
 | **ann**: A []
 |
 | **conf**: :ref:`ChevronRectangleConfig<ChevronRectangleConfig>`
 |
 | **orientation**: :ref:`Orientation<Orientation>`
 |


*Function* forwardChevronRectangleGlyph<A, C>
----------------------------------------------

:Call signature:
 | **forwardChevronRectangleGlyph<A, C>(chart, ann, conf): void**

 | This renders a list of Annotation objects in a target chart as forward facing chevron rectangles.

:Type parameters:
 | **A** extends :ref:`OrientedAnnotation<OrientedAnnotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Arguments:
 | **chart**: C
 | The target Chart.
 |
 | **ann**: A []
 | The list of Annotation objects to be rendered.
 |
 | **conf**: :ref:`ChevronRectangleConfig<ChevronRectangleConfig>`
 | The parameters for configuring the style of the lines. 
 |


*Function* reverseChevronRectangleGlyph<A, C>
----------------------------------------------

:Call signature:
 | **reverseChevronRectangleGlyph<A, C>(chart, ann, conf): void**

 | This renders a list of Annotation objects in a target chart as reverse facing chevron rectangles.

:Type parameters:
 | **A** extends :ref:`OrientedAnnotation<OrientedAnnotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Arguments:
 | **chart**: C
 | The target Chart.
 |
 | **ann**: A []
 | The list of Annotation objects to be rendered.
 |
 | **conf**: :ref:`ChevronRectangleConfig<ChevronRectangleConfig>`
 | The parameters for configuring the style of the lines. 
 |