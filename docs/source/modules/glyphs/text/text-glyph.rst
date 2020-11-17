.. _TextConfig:

.. _getTextSize

.. _textGlyph

Text-glyph
==========
*Interface* TextConfig<A, C> extends :ref:`GlyphConfig<GlyphConfig>`
---------------------------------------------------------------------

:Type parameters:
 | **A** extends :ref:`TextAnnotation<TextAnnotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Properties:
 | **selector**: string
 |
 | **text**: (a: A, c: C): None
 | A callback to extract a list of text to display from the represented Annotation object. It is a list of text because TextGlyphs can display varying length text depending on how much room is available in the target Chart's SVG viewport.
 |
 | **textPad**: undefined | number
 | The number of pixels to pad the text width.
 |
 | **x**: undefined | (a: A, c: C): number
 | A callback to define the semantic x coordinate of the text glyph.
 |
 | **y**: undefined | (a: A, c: C): number
 | A callback to define the y coordinate of the text glyph.
 |
 | **zoom**: :ref:`ZoomBehavior<ZoomBehavior>` <C, :ref:`Selection<Selection>` <:ref:`SVGTextElement<SVGTextElement>`, A, :ref:`HTMLElement<HTMLElement>`, any>>
 | A custom defined zoom behavior for all of the glyphs rendered with this config. This is intended to be used by experienced users only.
 |


*Function* getTextSize
-----------------------

:Call signature:
 | **getTextSize(text): number**


:Arguments:
 | **text**: string
 |


*Function* textGlyph<A, C>
---------------------------

:Call signature:
 | **textGlyph<A, C>(chart, ann, conf): void**

 | This renders a list of Annotation objects in a target chart as text glyphs. These are most likely to be used as labels that will be affixed next to another glyph.

:Type parameters:
 | **A** extends :ref:`TextAnnotation<TextAnnotation>`
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
 | **conf**: :ref:`TextConfig<TextConfig>`
 | The parameters for configuring the style of the lines. 
 |