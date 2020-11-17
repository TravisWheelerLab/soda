.. _RectangleConfig:

.. _rectangleGlyph

Rectangle-glyph
===============
*Interface* RectangleConfig<A, C> extends :ref:`GlyphConfig<GlyphConfig>`
--------------------------------------------------------------------------

An interface that holds the parameters for rendering rectangle glyphs.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Properties:
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


*Function* rectangleGlyph<A, C>
--------------------------------

:Call signature:
 | **rectangleGlyph<A, C>(chart, ann, conf): Selection**

 | This renders a list of Annotation objects in a target chart as rectangles.

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
 | **conf**: :ref:`RectangleConfig<RectangleConfig>`
 | The parameters for configuring the style of the lines. 
 |