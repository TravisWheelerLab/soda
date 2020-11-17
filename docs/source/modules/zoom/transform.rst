.. _Transform:

Transform
=========
*Interface* Transform
----------------------

Stub interface for the `Transform` class in D3, which doesn't appear to be exported from the D3 types package. A D3 Transform object is generated when a browser zoom event occurs in a DOM element that D3 has been configured to listen for zoom events in. It can then be used to scale and translate both DOM elements and D3 scales.

:Properties:
 | **k**: number
 | The scaling factor.
 |
 | **x**: number
 | The x translation amount.
 |
 | **y**: number
 | The y translation amount.
 |


:Methods:
 | **rescaleX(scale)**: :ref:`ScaleLinear<ScaleLinear>`
 | A callback that can modify d3 scale to appropriately represent coordinate translations in the context of the new zoom level.
 :Arguments:
  | **scale**: :ref:`ScaleLinear<ScaleLinear>`
  | The the original scale to be transformed. 
  |
 | 