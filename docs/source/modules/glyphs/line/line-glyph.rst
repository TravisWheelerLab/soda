.. _CommonLineConfig:

.. _HorizontalLineConfig:

.. _LineConfig:

.. _VerticalLineConfig:

.. _horizontalLine

.. _lineGlyph

.. _verticalLine

Line-glyph
==========
*Interface* CommonLineConfig<A, C> extends :ref:`GlyphConfig<GlyphConfig>`
---------------------------------------------------------------------------

An interface that holds the common parameters for rendering line glyphs.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Properties:
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
 | **zoom**: :ref:`ZoomBehavior<ZoomBehavior>` <C, :ref:`Selection<Selection>` <:ref:`SVGElement<SVGElement>`, A, :ref:`HTMLElement<HTMLElement>`, any>>
 | A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by experienced users only.
 |


*Interface* HorizontalLineConfig<A, C> extends :ref:`CommonLineConfig<CommonLineConfig>`
-----------------------------------------------------------------------------------------

An interface that holds the parameters for rendering horizontal line glyphs.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Properties:
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


*Interface* LineConfig<A, C> extends :ref:`CommonLineConfig<CommonLineConfig>`
-------------------------------------------------------------------------------

An interface that holds the parameters for rendering generic line glyphs.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Properties:
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
 | **x1**: (a: A, c: C): number
 | A callback to define the semantic x1 coordinate of the line glyph.
 |
 | **x2**: (a: A, c: C): number
 | A callback to define the semantic x2 coordinate of the line glyph.
 |
 | **y1**: (a: A, c: C): number
 | A callback to define the y1 coordinate of the line glyph.
 |
 | **y2**: (a: A, c: C): number
 | A callback to define the y2 coordinate of the line glyph.
 |
 | **zoom**: :ref:`ZoomBehavior<ZoomBehavior>` <C, :ref:`Selection<Selection>` <:ref:`SVGElement<SVGElement>`, A, :ref:`HTMLElement<HTMLElement>`, any>>
 | A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by experienced users only.
 |


*Interface* VerticalLineConfig<A, C> extends :ref:`CommonLineConfig<CommonLineConfig>`
---------------------------------------------------------------------------------------

An interface that holds the parameters for rendering vertical line glyphs.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Properties:
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
 | **x**: undefined | (a: A, c: C): number
 | A callback to define the semantic x coordinate of the vertical line glyph.
 |
 | **y1**: undefined | (a: A, c: C): number
 | A callback to define the y1 coordinate of the vertical line glyph.
 |
 | **y2**: undefined | (a: A, c: C): number
 | A callback to define the y2 coordinate of the vertical line glyph.
 |
 | **zoom**: :ref:`ZoomBehavior<ZoomBehavior>` <C, :ref:`Selection<Selection>` <:ref:`SVGElement<SVGElement>`, A, :ref:`HTMLElement<HTMLElement>`, any>>
 | A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by experienced users only.
 |


*Function* horizontalLine<A, C>
--------------------------------

:Call signature:
 | **horizontalLine<A, C>(chart, ann, conf): void**

 | This renders a list of Annotation objects in a target chart as horizontal lines.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
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
 | **conf**: :ref:`HorizontalLineConfig<HorizontalLineConfig>`
 | The parameters for configuring the style of the lines. 
 |


*Function* lineGlyph<A, C>
---------------------------

:Call signature:
 | **lineGlyph<A, C>(chart, ann, conf): void**

 | This renders a list of Annotation objects in a target chart as lines.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
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
 | **conf**: :ref:`LineConfig<LineConfig>`
 | The parameters for configuring the style of the lines. 
 |


*Function* verticalLine<A, C>
------------------------------

:Call signature:
 | **verticalLine<A, C>(chart, ann, conf): void**

 | This renders a list of Annotation objects in a target chart as vertical lines.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
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
 | **conf**: :ref:`VerticalLineConfig<VerticalLineConfig>`
 | The parameters for configuring the style of the lines. 
 |