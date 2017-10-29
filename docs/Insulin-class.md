Insulin is implemented using an [Insulin class](https://github.com/mc-t1/mct1/tree/master/src/Insulin) that can be instantiated with constructor parameters to yield a fast-acting or basal response insulin.

The Insulin constructor takes:

* `onsetDelay` - the number of milliseconds before the insulin's BGL-reducing effect kicks in
* `duration` - the number of milliseconds of total action
* `power` - how "powerful" the insulin effect is (how this is measured / implemented is not clear yet)
* `peak` - if this is `true`, then the insulin effect is scaled along a saw-tooth curve that peaks at the mid-point of the duration, approximating a bell-curve. This is characteristic of rapid-acting insulins. If it is `false`, then the insulin effect is applied consistently across the duration, which is characteristic of basal, or low-acting insulin.

Two insulins are currently constructed - a rapid-acting and a basal one, named [`rapid-insulin`](https://github.com/mc-t1/mct1/blob/master/src/Insulin/rapid-insulin.ts) and [`basal-insulin`](https://github.com/mc-t1/mct1/blob/master/src/Insulin/basal-insulin.ts).

The Insulin class has a `take` method. When a player wants to take insulin, this is done like this: `insulin.take(units, player)`. This creates an initial timer that waits for the onset delay, then creates a 1 second interval loop that applies the scaled insulin effect until the insulin duration is reached. This effect is implemented as a delta to the current BGL of the player.

## Unsolved mysteries

* This class has no tests
* What units are the power, and how do they scale?
* What's a realistic time-scaling to match the game-time?
* How do we measure the total amount of insulin and display that in the HUD in-game?