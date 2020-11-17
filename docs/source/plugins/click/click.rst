.. _ClickConfig:

.. _addClickBehavior

.. _click

.. _getClickList

Click
=====
*Interface* ClickConfig<A>
---------------------------

A simple interface to provide a common pattern for defining behavior that should be executed when a SODA glyph is clicked by a user.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |


:Properties:
 | **ann**: A
 | The Annotation to which a click behavior will be bound.
 |
 | **click**: (s: Selection <any, any, any, any>, a: A): void
 | A callback function that will be responsible for executing the click behavior. It will implicitly receive references to both a D3 Selection to the Annotation's representative glyph and the Annotation object itself.
 |


*Function* addClickBehavior<A>
-------------------------------

:Call signature:
 | **addClickBehavior<A>(config): void**

 | A utility function to add a click behavior to a glyph.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |


:Arguments:
 | **config**: :ref:`ClickConfig<ClickConfig>`
 |  
 |


*Function* click<A>
--------------------

:Call signature:
 | **click<A>(selection, ann): void**

 | A generic function that is actually routed to the click event on a SODA glyph. When called, it will retrieve the list of click behaviors associated with that glyph, and run the callback function for each behavior.

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


*Function* getClickList<A>
---------------------------

:Call signature:
 | **getClickList<A>(ann): None**

 | This function returns the list of click behaviors that are associated with an Annotation object.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |


:Arguments:
 | **ann**: A
 |  
 |