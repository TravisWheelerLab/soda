.. _OrientedAnnotation:

Oriented-annotation
===================
*Interface* OrientedAnnotation extends :ref:`Annotation<Annotation>`
---------------------------------------------------------------------

An interface to define an Annotation that has a semantic orientation. This is most likely going to indicate whether the Annotation is on the forward or reverse strand in a chromosome.

:Properties:
 | **h**: number
 | The height of an annotation in the visualization. This is currently not used by the SODA core.
 |
 | **id**: string
 | A unique identifier for an Annotation object. Currently, it is up to users to make sure that this field is uniquely assigned. SODA will not behave as intended if two distinct Annotations have the same id.
 |
 | **orientation**: string
 |  A string to represent the orientation.
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