.. _TextAnnotation:

Text-annotation
===============
*Interface* TextAnnotation extends :ref:`Annotation<Annotation>`
-----------------------------------------------------------------

An interface to represent an Annotation that will be represented as text. Generally, this will be a label that is rendered near another Annotation. TextAnnotations are capable of trying to be "smart" about displaying their underlying data. They can be provided with a list of strings of various levels of detail/length, and they will display the most detailed/longest text that will fit inside of the space available in the target Chart. When paired with the default TextAnnotation ZoomBehavior, this behavior can be dynamically applied as the Chart is zoomed or changes dimensions.

:Properties:
 | **drawThresholds**: number []
 | A list of thresholds, measured in the semantic width of the current view in a Chart, at which the different levels of text detail will be displayed. When TextAnnotations are passed to the TextGlyph() function, these values are precomputed before an initial render takes place. These should not be set directly.
 |
 | **h**: number
 | The height of an annotation in the visualization. This is currently not used by the SODA core.
 |
 | **id**: string
 | A unique identifier for an Annotation object. Currently, it is up to users to make sure that this field is uniquely assigned. SODA will not behave as intended if two distinct Annotations have the same id.
 |
 | **text**: string []
 | A list of text at different levels of detail/length. These should sorted in order of increasing detail.
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