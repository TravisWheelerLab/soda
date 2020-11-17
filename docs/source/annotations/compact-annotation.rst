.. _CompactAnnotation:

.. _isCompactAnn

Compact-annotation
==================
*Interface* CompactAnnotation extends :ref:`Annotation<Annotation>`
--------------------------------------------------------------------

An interface to define an Annotation that can be dynamically compacted and un-compacted in a visualization.

:Properties:
 | **compactW**: number
 | The adjusted semantic width to use in rendering when the Annotation is compacted.
 |
 | **compactX**: number
 | The adjusted semantic x-coordinate to use in rendering when the Annotation is compacted.
 |
 | **compacted**: boolean
 | The flag that indicates whether the Annotation is currently compacted.
 |
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

*Function* isCompactAnn
------------------------

:Call signature:
 | **isCompactAnn(a): a**

 | A custom type guard function to check whether an arbitrary Annotation object is compactable. This may not currently be entirely robust, but it should be fine to use with reasonable caution.

:Arguments:
 | **a**: :ref:`Annotation<Annotation>`
 | The Annotation object to type check. 
 |