.. _TooltipConfig:

.. _defaultTooltipMouseout

.. _defaultTooltipMouseover

.. _initTooltipDiv

.. _tooltip

Tooltip
=======
*Interface* TooltipConfig<A, C>
--------------------------------

An interface that holds the parameters for configuring a glyph tooltip.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Properties:
 | **ann**: A
 | The Annotation object whose representative glyph we are binding the tooltip to.
 |
 | **backgroundColor**: undefined | (a: A, c: C): string
 | A callback function to set the background color of the tooltip.
 |
 | **borderRadius**: undefined | (a: A, c: C): number
 | A callback function to set the border radius of the tooltip.
 |
 | **opacity**: undefined | (a: A, c: C): number
 | A callback function to set the opacity of the tooltip.
 |
 | **padding**: undefined | (a: A, c: C): number
 | A callback function to set the css padding on of the tooltip.
 |
 | **text**: (a: A, c: C): string
 | A callback function to set the tooltip text.
 |
 | **textColor**: undefined | (a: A, c: C): string
 | A callback function to set the tooltip text color.
 |


*Function* defaultTooltipMouseout<A>
-------------------------------------

:Call signature:
 | **defaultTooltipMouseout<A>(): void**

 | The default tooltip mouseout callback function. It just moves the tooltip div out of the way, shrinks it, and makes it invisible.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |


*Function* defaultTooltipMouseover<A, C>
-----------------------------------------

:Call signature:
 | **defaultTooltipMouseover<A, C>(a, c, config): void**

 | The default tooltip mouseover callback function. It moves the tooltip div to the appropriate spot and then uses the config to style the tooltip.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Arguments:
 | **a**: A
 | The Annotation object whose representative glyph has been hovered.
 |
 | **c**: C
 | The Chart in which the glyph has been rendered.
 |
 | **config**: :ref:`TooltipConfig<TooltipConfig>`
 | The config to be applied to the tooltip. 
 |


*Function* initTooltipDiv
--------------------------

:Call signature:
 | **initTooltipDiv(): void**


*Function* tooltip<A, C>
-------------------------

:Call signature:
 | **tooltip<A, C>(chart, config): void**

 | A utility function to actually apply a TooltipConfig to a glyph. It uses the hover plugin to add a hover behavior for the tooltip functionality.

:Type parameters:
 | **A** extends :ref:`Annotation<Annotation>`
 |
 | **C** extends :ref:`Chart<Chart>` <any>
 |


:Arguments:
 | **chart**: C
 | The Chart that the glyph is rendered in.
 |
 | **config**: :ref:`TooltipConfig<TooltipConfig>`
 | The Annotation whose representative glyph we are binding the tooltip to. 
 |