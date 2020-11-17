.. _HoverConfig:

.. _addHoverBehavior

.. _getMouseoutList

.. _getMouseoverList

.. _mouseout

.. _mouseover

Hover
=====
*Interface* HoverConfig<A>
---------------------------

A simple interface to provide a common pattern for defining behavior that should be executed when a SODA glyph is hovered by a user.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |


:Properties:
 | **ann**: A
 | The Annotation to which a hover behavior will be bound.
 |
 | **mouseout**: (s: Selection <any, any, any, any>, a: A): void
 | A callback function that will be responsible for executing the mouseout behavior. It will implicitly receive references to both a D3 Selection to the Annotation's representative glyph and the Annotation object itself.
 |
 | **mouseover**: (s: Selection <any, any, any, any>, a: A): void
 | A callback function that will be responsible for executing the mouseover behavior. It will implicitly receive references to both a D3 Selection to the Annotation's representative glyph and the Annotation object itself.
 |


*Function* addHoverBehavior<A>
-------------------------------

:Call signature:
 | **addHoverBehavior<A>(config): void**

 | A utility function to add a hover behavior to a glyph.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |


:Arguments:
 | **config**: :ref:`HoverConfig<HoverConfig>`
 |  
 |


*Function* getMouseoutList<A>
------------------------------

:Call signature:
 | **getMouseoutList<A>(ann): None**

 | This function returns the list of mouseout behaviors that are associated with an Annotation object.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |


:Arguments:
 | **ann**: A
 |  
 |


*Function* getMouseoverList<A>
-------------------------------

:Call signature:
 | **getMouseoverList<A>(ann): None**

 | This function returns the list of mouseover behaviors that are associated with an Annotation object.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |


:Arguments:
 | **ann**: A
 |  
 |


*Function* mouseout<A>
-----------------------

:Call signature:
 | **mouseout<A>(selection, ann): void**

 | A generic function that is actually routed to the mouseover event on a SODA glyph. When called, it will retrieve the list of mouseout behaviors associated with that glyph, and run the callback function for each behavior.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |


:Arguments:
 | **selection**: :ref:`Selection<Selection>`
 | 
 |
 | **ann**: A
 |  
 |


*Function* mouseover<A>
------------------------

:Call signature:
 | **mouseover<A>(selection, ann): void**

 | A generic function that is actually routed to the mouseover event on a SODA glyph. When called, it will retrieve the list of mouseover behaviors associated with that glyph, and run the callback function for each behavior.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |


:Arguments:
 | **selection**: :ref:`Selection<Selection>`
 | 
 |
 | **ann**: A
 |  
 |