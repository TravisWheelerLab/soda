.. _getAnnotationById

.. _getSelectionById

.. _mapIdToAnnotation

.. _mapIdToSelection

Id-map
======
*Function* getAnnotationById
-----------------------------

:Call signature:
 | **getAnnotationById(id): Annotation**

 | This function produces a reference to Annotation object that is mapped with the provided string id. It will throw an exception if the id is not in the internal map.

:Arguments:
 | **id**: string
 |  
 |


*Function* getSelectionById
----------------------------

:Call signature:
 | **getSelectionById(id): Selection**

 | This function produces a reference to D3 Selection that is mapped with the provided string id. It will throw an exception if the id is not in the internal map.

:Arguments:
 | **id**: string
 |  
 |


*Function* mapIdToAnnotation
-----------------------------

:Call signature:
 | **mapIdToAnnotation(id, ann): void**

 | This function stores a reference to an Annotation object in an internal map that is keyed by string id's. By default, the SODA rendering module will call this function to map each rendered Annotation with its id property.

:Arguments:
 | **id**: string
 | 
 |
 | **ann**: :ref:`Annotation<Annotation>`
 |  
 |


*Function* mapIdToSelection
----------------------------

:Call signature:
 | **mapIdToSelection(id, selection): void**

 | This function stores a reference to a D3 selection to an Annotation glyph in an internal map that is keyed by a unique string id.

:Arguments:
 | **id**: string
 | 
 |
 | **selection**: :ref:`Selection<Selection>`
 |  
 |