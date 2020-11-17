.. _ChevronPrimitiveConfig:

Chevron-config
==============
*Interface* ChevronPrimitiveConfig<A, C> extends :ref:`GlyphConfig<GlyphConfig>`
---------------------------------------------------------------------------------

An interface that defines the common parameters for rendering chevron glyphs.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
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
 | **selector**: string
 |