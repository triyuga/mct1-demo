# What is the GlucoseMonitor class?

The [GlucoseMonitor class](https://github.com/mc-t1/mct1/blob/master/src/GlucoseMonitor/GlucoseMonitor.ts) is a base class that defines the shape and functionality of a Blood Glucose Monitor.

# How does it work?

The constructor takes a player, whose blood glucose will be monitored, and a sample rate in milliseconds.

It has an abstract method `monitor` that must be implemented in descendant classes.
This method is called every `{sampleRate}` milliseconds, and receives the player's current BGL as an argument.

The BGL Bar in the user interface is implemented as a [BGLBarGlucoseMonitor](https://github.com/mc-t1/mct1/blob/master/src/GlucoseMonitor/BGLBarGlucoseMonitor/BGLBarGlucoseMonitor.ts).

# Unsolved mysteries:

* A [ConnectGlucoseMonitor](https://github.com/mc-t1/mct1/blob/master/src/GlucoseMonitor/ConnectGlucoseMonitor.ts) that sends the Blood Glucose readings to [getconnect.io](getconnect.io).
* The BGL Bar monitor does not have a test with data - it would be good to see it running in the interface.
