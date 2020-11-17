.. _SequenceConfig:

.. _sequenceGlyph

Sequence-glyph
==============
*Interface* SequenceConfig<A, C> extends :ref:`GlyphConfig<GlyphConfig>`
-------------------------------------------------------------------------

An interface that holds the parameters for rendering sequence glyphs.

:Type parameters:
 | **A** extends :ref:`SequenceAnnotation<SequenceAnnotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Properties:
 | **selector**: string
 |
 | **w**: (a: A, c: C): number
 | A callback to define the semantic width coordinate of the sequence glyph.
 |
 | **x**: (a: A, c: C): number
 | A callback to define the semantic x coordinate of the sequence glyph.
 |
 | **y**: (a: A, c: C): number
 | A callback to define the y coordinate of the sequence glyph.
 |


*Function* sequenceGlyph<A, D, C>
----------------------------------

:Call signature:
 | **sequenceGlyph<A, D, C>(chart, ann, conf): void**

 | An experimental function that renders a list of Annotation objects in a target chart as sequence glyphs. In a sequence glyph, each integer semantic coordinate that the Annotation covers is rendered as a character. This works, but it is very hard on performance.

:Type parameters:
 | **A** extends :ref:`SequenceAnnotation<SequenceAnnotation>`
 |
 | **D** extends :ref:`CharacterDatum<CharacterDatum>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Arguments:
 | **chart**: C
 | 
 |
 | **ann**: A []
 | 
 |
 | **conf**: :ref:`SequenceConfig<SequenceConfig>`
 |  
 |