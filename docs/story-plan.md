# Learning Outcomes

* BGL has a healthy range, if you go outside of the range you get negative effects.
* Eating food will spike your Carbs bar and as a consequence your BGL.
* Taking insulin lowers your BGL.
* Practice through repetition, managing your BGL, keeping it in the healthy range.
* Our target audience is 6-14 year olds.

# Framing and Scope

T1 is a bit like Advanced Mode in a game.
It's an extra challenge to manage it alongside the other Magikcraft elements like spell casting and crafting, but if you do you will gain extra benefits in-game.

## Scope

While it is important to teach the concepts of T1D, we have to balance what is important with what is fun.
We also have to keep in mind the time to delivery of the project as an MVP is limited.

The following items are excluded from the initial release:

* Digestion rate of food stuffs.
* Ketone levels.
* Carb counting.
* Injections or pumping (platform limitation - would require custom game code to render).

## Game Dynamics

The colour of the BGL level bar will communicate to the player if the BGL is within a healthy range or not.
Blue for low, red for high.

If it’s in a healthy range it should be green.

# Proposed Levels

## Tutorial (Level 1)

Want to help? This task is tracked in https://github.com/mc-t1/mct1/issues/44

**Theme** Intro to Minecraft

1. Learn how to move around.
2. Learn how to use tools.
3. Learn how to eat.

Finish the level by going through a warp portal.

## Level 2 - Get the T1 Feeling

Want to help? This task is tracked in https://github.com/mc-t1/mct1/issues/45

**Theme** Getting the T1 condition

1. In a village, receive a quest.
2. Set off on the quest
3. Get struck by lightning, which gives you "T1" powers.
4. Screen goes black and Level 3 begins.

Quest Ideas:

* Deliver an item
* Gather a set of items

## Level 3 - Cakemageddon

Want to help? This task is tracked in https://github.com/mc-t1/mct1/issues/46

**Theme** Start managing T1D

1. You wake up in a new environment with beds and a table set with food.
2. You are hungry and the health HUD reflects this: your health bar is at 20%.
3. On a table is a cake (really high carb food). If you don't eat foodstuffs quickly you start losing health, so you must eat.
4. As soon as you eat the cake, the MCT1 Bars open. You see the BGL bar going up.
5. You then move forward through the room and come across an insulin potion ampule.
6. When you consume the potion, the Insulin bar increases and you see the BGL go down.
With this amazing knowledge you now have to eat your way through a cake wall.
Yes: a wall made of cake.
And it’s a double-bricker.
7. As you eat the cakewall, you have to manage your BGL and Insulin levels.
8. When you get out of cakemageddon, you walk into a new room with a different food to consume that is low carb.
You then see the effects of low carb food on your insulin.

### Considerations

High effects IRL: https://www.diabetesaustralia.com.au/hyperglycaemia
Low effects IRL: https://www.diabetesaustralia.com.au/hypoglycaemia

Using the [`PotionEffectType`](https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/potion/PotionEffectType.html) class, we could emulate some T1D conditions in-game:

* Low
* * CONFUSION
* * BLIND
* High
* * SLOW
* Very Low or High
* * Death
