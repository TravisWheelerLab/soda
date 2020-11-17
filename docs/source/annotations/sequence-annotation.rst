.. _SequenceAnnotation:

.. _CharacterDatum:

.. _SequenceAnnotationConfig:

Sequence-annotation
===================
*Class* SequenceAnnotation extends :ref:`Annotation<Annotation>`
-----------------------------------------------------------------

An experimental interface to define an Annotation that is rendered entirely as text. The general idea is that if an Annotation represents a sequence alignment, each character in the query sequence can be rendered at the semantic chromosome position that it was aligned to. This works, but it's far from optimized and will likely cause performance issues.

:Constructor signature:
 | **new SequenceAnnotation(conf): SequenceAnnotation**

:Arguments:
 | **conf**: :ref:`SequenceAnnotationConfig<SequenceAnnotationConfig>`
 |


:Properties:
 | **characters**: :ref:`CharacterDatum<CharacterDatum>` []
 | A list of objects to store the semantic coordinates of each character in the sequence.
 |
 | **h**: number
 | The height of an annotation in the visualization. This is currently not used by the SODA core.
 |
 | **id**: string
 | A unique identifier for an Annotation object. Currently, it is up to users to make sure that this field is uniquely assigned. SODA will not behave as intended if two distinct Annotations have the same id.
 |
 | **sequence**: string
 | The sequence string to be rendered in the visualization.
 |
 | **w**: number
 | The width of the annotation in semantic coordinates.
 |
 | **x**: number
 | The x position of the annotation in semantic coordinates (generally a position on a chromosome in base pairs)
 |
 | **y**: number
 | The y position of the annotation. This rarely has semantic meaning, and is probably used to prevent horizontal overlap or preserve clarity in the visualization.
 |


:Methods:
 | **getW()**: number
 | Getter for the width.
 | 
 | **getX()**: number
 | Getter for the x coordinate.
 | 

*Interface* CharacterDatum
---------------------------

A simple interface to represent a single character and it's relative position in a SequenceAnnotation

:Properties:
 | **char**: string
 | The character.
 |
 | **x**: number
 | The character's semantic position relative to the SequenceAnnotation's semantic position.
 |


*Interface* SequenceAnnotationConfig extends :ref:`AnnotationConfig<AnnotationConfig>`
---------------------------------------------------------------------------------------

A simple interface to define the arguments for the SequenceAnnotation constructor.

:Properties:
 | **h**: number
 |
 | **id**: string
 |
 | **sequence**: string
 |
 | **w**: number
 |
 | **x**: number
 |
 | **y**: number
 |