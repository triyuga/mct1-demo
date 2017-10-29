# What is the Blood Glucose Class

The [Blood Glucose Class](https://github.com/mc-t1/mct1/blob/master/src/BGL/BGL.ts) internally represents the current blood glucose level (BGL) in Millimoles per Litre (mmol/L), which is the Australian unit of measurement for Blood Glucose.

In the United States, West-Germany and other countries, mass concentration is measured in Milligrams per Decilitre (mg/dL).

# What does it do?

This class implements high and low health effects based on the player's BGL.

# How does it work?

It has a `getBGL` method that returns the current blood glucose level in mmol/L by default, and that takes a `units` parameter.
Pass in `BGLUnits.mgdl` as a parameter to `getBGL` to get the current blood glucose level in mg/dl (US units).

You can use the static class methods `mgdl2mmolL()` and `mmolL2mgdl()` to do a conversion if you need to.

Modifying the current blood glucose level is accomplished by calling the `applyBGLchange` method with a delta in mmol/L. 
This allows insulin and food actors to act on and modify blood glucose level with no knowledge of its current level.

# Future plans

Currently, rise and fall alerts are implemented in the BGL class.
Potentially they belong in a `GlucoseMonitor` class.

This would require exposing the current delta in addition to the BGL, making the class and the interaction more complex.
If there is another compelling benefit to moving alerts to a `GlucoseMonitor` (language support?), then it would tip the scales.

# Unsolved mysteries

* This class has no tests.
* The app needs to be configurable for units by the user, so they can choose whether to use US or Australian units.
* High and low effects need to be done. A working stub implementation that causes hyperglycaemic blindness is there.
* Low effects, gradation, reversal of effects still need to be done.
