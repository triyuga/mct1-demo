# What is the Carbohydrate class?

The [Carbohydrate Class](https://github.com/mc-t1/mct1/blob/master/src/Carbs/Carbohydrate.ts) can be used to construct various food.

# What does it do?

It maps the number of grams, GI and GL contained in minecraft foods and translates that into

# How does it work?

Its constructor takes the following parameters:

* `grams` - this is the number of grams of carbohydrate per serving of this food. It should probably be more accurately named.
* `glycemicIndex` - GI is how fast the food converts to glucose in the blood.
* `glycemicLoad` - Glycemic Load (GL) is a measure of both the quality (the GI value) and quantity (grams per serve) of a carbohydrate in a meal. A food’s glycemic load is determined by multiplying its glycemic index by the amount of carbohydrate the food contains in each serve and dividing by 100.

It has an `eat()` method that takes a player.
This starts a digestion loop, and the effect of the food on the player's BGL takes place over time using the `digest()` method.
The loop ends when the food is exhausted by being completely digested.

# Future plans

Here is the list of Minecraft foods: [http://minecraft.gamepedia.com/Food](http://minecraft.gamepedia.com/Food).

## Unsolved mysteries

* This class has no tests
* How does glycemic index work and how is it modelled?
* How does glycemic load work and how is it modelled?
* Minecraft foods need to be mapped and instances of the class created for each one.
* Maybe a data object and an iterator could be good for that?
* What about a digestion queue? Should everything start digesting as soon as it is eaten?
