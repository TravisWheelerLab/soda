.. _ChevronLineConfig:

.. _chevronLineGlyph

.. _forwardChevronLine

.. _reverseChevronLine

Chevron-line-glyph
==================
*Interface* ChevronLineConfig<A, C> extends :ref:`ChevronPrimitiveConfig<ChevronPrimitiveConfig>`, :ref:`HorizontalLineConfig<HorizontalLineConfig>`
-----------------------------------------------------------------------------------------------------------------------------------------------------

An interface that holds the parameters for rendering and configuring a chevron line glyph.

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
 | **h**: undefined | (a: A, c: C): number
 |
 | **selector**: string
 |
 | **strokeColor**: undefined | (a: A, c: C): string
 | A callback to define the stroke color of the line glyph.
 |
 | **strokeDashArray**: undefined | (a: A, c: C): string
 | A callback to define the stroke dash array of the line glyph. Supplying this will allow lines to be dotted/dashed.
 |
 | **strokeOpacity**: undefined | (a: A, c: C): number
 | A callback to define the stroke opacity of the line glyph.
 |
 | **strokeWidth**: undefined | (a: A, c: C): number
 | A callback to define the stroke width of the line glyph.
 |
 | **x1**: undefined | (a: A, c: C): number
 | A callback to define the semantic x1 coordinate of the horizontal line glyph.
 |
 | **x2**: undefined | (a: A, c: C): number
 | A callback to define the semantic x2 coordinate of the horizontal line glyph.
 |
 | **y**: undefined | (a: A, c: C): number
 | A callback to define the y coordinate of the horizontal line glyph.
 |
 | **zoom**: :ref:`ZoomBehavior<ZoomBehavior>` <C, :ref:`Selection<Selection>` <:ref:`SVGElement<SVGElement>`, A, :ref:`HTMLElement<HTMLElement>`, any>>
 | A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by experienced users only.
 |


*Function* chevronLineGlyph<A, C>
----------------------------------

:Call signature:
 | **chevronLineGlyph<A, C>(chart, ann, conf, orientation): void**


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
 | **conf**: :ref:`ChevronLineConfig<ChevronLineConfig>`
 |
 | **orientation**: :ref:`Orientation<Orientation>`
 |


*Function* forwardChevronLine<A, C>
------------------------------------

:Call signature:
 | **forwardChevronLine<A, C>(chart, ann, conf): void**

 | This renders a list of Annotation objects in a target chart as forward facing chevron lines.

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
 | **conf**: :ref:`ChevronLineConfig<ChevronLineConfig>`
 | The parameters for configuring the style of the lines. 
 |


*Function* reverseChevronLine<A, C>
------------------------------------

:Call signature:
 | **reverseChevronLine<A, C>(chart, ann, conf): void**

 | This renders a list of Annotation objects in a target chart as reverse facing chevron lines.

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
 | **conf**: :ref:`ChevronLineConfig<ChevronLineConfig>`
 | The parameters for configuring the style of the lines. 
 |