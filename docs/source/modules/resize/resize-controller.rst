.. _ResizeController:

Resize-controller
=================
*Class* ResizeController
-------------------------

This class can be used to synchronize and propagate browser resize events across different Charts.

:Constructor signature:
 | **new ResizeController(): ResizeController**

:Properties:
 | **components**: :ref:`ResizableChart<ResizableChart>` <any> []
 | A list of Charts that the ResizeController will control.
 |


:Methods:
 | **addComponent<T>(component)**: void
 | This registers a Chart to the controller.
 :Type parameters:
 | **T**, generic
 |


 :Arguments:
  | **component**: :ref:`ResizableChart<ResizableChart>`
  |  
  |
 | 
 | **addComponents(components)**: void
 | This registers a list of Charts to the controller.
 :Arguments:
  | **components**: :ref:`ResizableChart<ResizableChart>` []
  |  
  |
 | 
 | **resize()**: void
 | This is the method that will actually call resize() on all of the controller's registered components.
 | 
 | **trigger()**: void
 | This method will check if any of the component's container's dimensions have changed, and then it will call resize() if they have.
 | 