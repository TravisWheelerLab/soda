.. _RuleController:

.. _ruleTooltip

.. _verticalRule

Rule-controller
===============
*Class* RuleController implements :ref:`Plugin<Plugin>`
--------------------------------------------------------

This plugin object allows a dynamic vertical rule to be added to any Chart.

:Constructor signature:
 | **new RuleController(): RuleController**

:Properties:
 | **activeComponent**: :ref:`ChartBase<ChartBase>` <any>
 | The component that the RuleController has identified as the one that the user is currently hovering with the mouse.
 |
 | **components**: :ref:`ChartBase<ChartBase>` <any> []
 | A list of Charts that the RuleController will place rules in.
 |


:Methods:
 | **addComponent(component)**: void
 | Add a component to the RuleController and add a rule to that component.
 :Arguments:
  | **component**: :ref:`ChartBase<ChartBase>`
  |  
  |
 | 
 | **alert()**: void
 | This should be called by registered components whenever the height of a component changes.
 | 
 | **chartMouseMove(chart)**: void
 | This method is routed to the mousemove event on each components' SVG viewport. It updates the activeComponent property, and then moves the rule to follow the mouse position.
 :Arguments:
  | **chart**: :ref:`ChartBase<ChartBase>`
  |  
  |
 | 
 | **moveRule()**: void
 | This method is responsible for moving the rule on each of the RuleController's components.
 | 
 | **updateRuleSize()**: void
 | This method checks each component's height, and adjusts that height of each embedded rule to match it.
 | 

*Function* ruleTooltip
-----------------------

:Call signature:
 | **ruleTooltip(chart): void**

 | A utility function that creates the tooltip that floats next to the rule.

:Arguments:
 | **chart**: :ref:`ChartBase<ChartBase>`
 |  
 |


*Function* verticalRule
------------------------

:Call signature:
 | **verticalRule(chart): void**

 | A utility function that creates the actual rule.

:Arguments:
 | **chart**: :ref:`ChartBase<ChartBase>`
 |  
 |