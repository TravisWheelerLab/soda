.. _Annotation:

.. _AnnotationConfig:

Annotation
==========
*Class* Annotation
-------------------

Annotation objects are the main data structure used by SODA to store information about alignments. In many cases, this should be sufficient to store the information to represent a single glyph in a visualization. If more information is needed, the Annotation class should be extended.

:Constructor signature:
 | **new Annotation(config): Annotation**

:Arguments:
 | **config**: :ref:`AnnotationConfig<AnnotationConfig>`
 |


:Properties:
 | **h**: number
 | The height of an annotation in the visualization. This is currently not used by the SODA core.
 |
 | **id**: string
 | A unique identifier for an Annotation object. Currently, it is up to users to make sure that this field is uniquely assigned. SODA will not behave as intended if two distinct Annotations have the same id.
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

*Interface* AnnotationConfig
-----------------------------

A simple interface that holds the arguments for an Annotation constructor.

:Properties:
 | **h**: number
 |
 | **id**: string
 |
 | **w**: number
 |
 | **x**: number
 |
 | **y**: number
 |