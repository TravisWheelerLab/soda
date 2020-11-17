.. _DEFAULT_VERTEX_SORT

.. _greedyGraphLayout

Greedy-graph-layout
===================
*Function* DEFAULT_VERTEX_SORT
-------------------------------

:Call signature:
 | **DEFAULT_VERTEX_SORT(verts, graph): void**


:Arguments:
 | **verts**: string []
 |
 | **graph**: :ref:`AnnotationGraph<AnnotationGraph>`
 |


*Function* greedyGraphLayout
-----------------------------

:Call signature:
 | **greedyGraphLayout(ann, tolerance, vertSortFunction): number**

 | This function takes a list of Annotation objects and uses a deterministic greedy graph coloring algorithm to assign each of them a y coordinate in terms of horizontal bins that will prevent any horizontal overlap when they are rendered in a Chart.

:Arguments:
 | **ann**: :ref:`Annotation<Annotation>` []
 | 
 |
 | **tolerance**: number
 | 
 |
 | **vertSortFunction**: (verts: string [], graph: AnnotationGraph): void
 |  
 |