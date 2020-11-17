.. _AnnotationGraph:

.. _annotationsOverlap

Annotation-graph
================
*Class* AnnotationGraph
------------------------

This class represents Annotations as a graph, in which there is an edge between two Annotations if they horizontally overlap in semantic coordinate space.

:Constructor signature:
 | **new AnnotationGraph(ann, tolerance): AnnotationGraph**

:Arguments:
 | **ann**: :ref:`Annotation<Annotation>` []
 |
 | **tolerance**: number
 |


:Properties:
 | **degrees**: :ref:`Map<Map>` <string, number>
 | This maps from Annotation id A to the number of edges it shares with other Annotations.
 |
 | **edges**: :ref:`Map<Map>` <string, string []>
 | This maps from Annotation id A to a list of Annotation id's that annotation id A shares an edge with.
 |
 | **idMap**: :ref:`Map<Map>` <string, :ref:`Annotation<Annotation>`>
 | This maps from Annotation id's to Annotation objects
 |


:Methods:
 | **getAnnotationFromId(id)**: :ref:`Annotation<Annotation>`
 :Arguments:
  | **id**: string
  |
 | 
 | **getEdges(n)**: string []
 :Arguments:
  | **n**: string
  |
 | 
 | **getVertices()**: string []
 | 

*Function* annotationsOverlap
------------------------------

:Call signature:
 | **annotationsOverlap(a, b, tolerance): boolean**


:Arguments:
 | **a**: :ref:`Annotation<Annotation>`
 |
 | **b**: :ref:`Annotation<Annotation>`
 |
 | **tolerance**: number
 |