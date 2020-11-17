.. _ZoomController:

Zoom-controller
===============
*Class* ZoomController
-----------------------

This class can be used to synchronize and propagate browser zoom events across different Charts.

:Constructor signature:
 | **new ZoomController(): ZoomController**

:Properties:
 | **_queryEnd**: number | undefined
 | The end of the semantic query range that the ZoomController expects its components to be displaying.
 |
 | **_queryStart**: number | undefined
 | The start of the semantic query range that the ZoomController expects its components to be displaying.
 |
 | **_width**: number | undefined
 | The width in pixels that the ZoomController expects all of its components to have.
 |
 | **_xScale**: ScaleLinear | undefined
 | The initial D3 scale that the ZoomController will use to translate between semantic coordinates and the component's SVG viewport coordinates. This scale will be rescaled and stored as _zoomedXScale after a zoom event takes place.
 |
 | **_zoomedXScale**: ScaleLinear | undefined
 | The rescaled D3 scale that gets created after a zoom event.
 |
 | **components**: :ref:`ZoomableChart<ZoomableChart>` <any> []
 | A list of Charts that the ZoomController will control.
 |
 | **transform**: :ref:`Transform<Transform>`
 | A D3 Transform object that represents the current zoom level relative to the initial render
 |


:Methods:
 | **addComponent<T>(component)**: void
 | This method registers a component with the ZoomController. It will also register itself on the added component.
 :Type parameters:
 | **T**, generic
 |


 :Arguments:
  | **component**: :ref:`ZoomableChart<ZoomableChart>`
  | The component to be added. 
  |
 | 
 | **addComponents(components)**: void
 | This method registers a list of components with the ZoomController.
 :Arguments:
  | **components**: :ref:`ZoomableChart<ZoomableChart>` []
  |  
  |
 | 
 | **checkComponentWidthEquality()**: boolean
 | This utility method checks if any of the ZoomController's components have widths that differ from each other.
 | 
 | **checkForTransformDifference(transform)**: boolean
 | This utility function compares an arbitrary D3 Transform object to the ZoomController's internal Transform object and checks if they represent different zoom transforms.
 :Arguments:
  | **transform**: :ref:`Transform<Transform>`
  |  
  |
 | 
 | **checkForWidthChange()**: boolean
 | This utility method checks if any of the ZoomController's components have a width that differs from the ZoomController's internal assumed width. After the first component with a different width is found, the method returns true.
 | 
 | **getQueryEnd()**: number
 | Getter for the assumed end of the semantic query range of the components of the ZoomController.
 | 
 | **getQueryStart()**: number
 | Getter for the assumed start of the semantic query range of the components of the ZoomController.
 | 
 | **getSemanticViewRange()**: None
 | Get the semantic start, end and width of the query that is currently rendered in the ZoomController's components.
 | 
 | **getWidth()**: number
 | Getter for the assumed width of the components of the ZoomController.
 | 
 | **getXScale()**: :ref:`ScaleLinear<ScaleLinear>`
 | Getter for the initial D3 scale.
 | 
 | **getZoomedXScale()**: :ref:`ScaleLinear<ScaleLinear>`
 | Getter for the D3 scale that has been rescaled to match the current zoom level.
 | 
 | **handleResize()**: void
 | This method should be called whenever we know that the ZoomController's components' widths have changed. It updates the ZoomController's assumed component with to match the component width, adjusts the D3 scales appropriately, and then re-renders the charts to display the semantic query range of the components before the resize occurred.
 | 
 | **setQueryRange(queryStart, queryEnd)**: void
 | This method updates the internal assumed query range of the ZoomController.
 :Arguments:
  | **queryStart**: number
  | 
  |
  | **queryEnd**: number
  |  
  |
 | 
 | **setToComponentWidth()**: void
 | This method sets the internal assumed width of the ZoomController to the width of its first component.
 | 
 | **setXScale()**: void
 | This method redefines the ZoomController's internal D3 scale with the internal assumed semantic query and component width. For example, if the controlled components are resized in the browser, this should be called so that the scale behaves as intended when transforming between semantic and viewport coordinates.
 | 
 | **trigger(callerTransform)**: void
 | This method is called by a ZoomableChart whenever it receives a browser zoom event. It first checks to see if any of the components have changed size and responds by appropriately updating the ZoomController to accommodate any changes. Next, it checks if the component supplied a D3 Transform argument that actually represents a different zoom level. If the Transform is actually different, it will update the D3 scales and re-render all of the components.
 :Arguments:
  | **callerTransform**: :ref:`Transform<Transform>`
  |  
  |
 | 
 | **updateCompTransforms()**: void
 | D3 stores Transform objects on DOM elements that have received zoom events. Whenever an element receives a zoom event, the Transform object that bubbles up is computed relative to that pre-existing internal Transform. As such, these internal Transforms need to be set manually whenever a zoom event is propagated onto a component that did not originally receive that event. This method will set each of the ZoomController's components' internal Transforms to match the ZoomController's internal Transform.
 | 
 | **updateZoomedScale()**: void
 | This method rescales the internal D3 Scale with the internal D3 Transform object and stores it on the _zoomedXScale property.
 | 
 | **zoomToRange(start, end)**: void
 |  This method will adjust the view of each of the ZoomController's components to match the semantic range  provided in the arguments.
 :Arguments:
  | **start**: number
  | The start of the new range.
  |
  | **end**: number
  | The end of the new range. 
  |
 | 
 | **zoomedRender()**: void
 | This method will get a list of ZoomBehaviors from each of its components, and then, for each ZoomBehavior, it will make a D3 Selection to the target glyphs and call the ZoomBehavior's apply() callback with that selection and the component as arguments.
 | 