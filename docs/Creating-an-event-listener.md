You can find the documentation for the Magikcraft API at [apidoc.magikcraft.io](https://apidoc.magikcraft.io).

The documentation for the underlying Bukkit API is accessible at [bukkit.magikcraft.io](https://bukkit.magikcraft.io).

Something to be aware of is that event listeners are server-wide, so they need to filter for the current user: `magik.getSender()` retrieves the current player who is executing the code.

Here's an example of an event listener for the [`PlayerItemConsumeEvent`](https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/event/player/PlayerItemConsumeEvent.html).

```
import { log } from 'util/log';
// const log = magikcraft.io.dixit; // ES5
const PlayerItemConsumeEvent = Java.type("org.bukkit.event.player.PlayerItemConsumeEvent");
const EventPriority = Java.type("org.bukkit.event.EventPriority");
const EventCallback = Java.type("io.magikcraft.EventCallback");

// Bind the user who created the event into a closure
const me = magik.getSender().getName();

magik.getPlugin().registerEvent(
        PlayerItemConsumeEvent.class,
        EventPriority.MONITOR,
        true,

        // This callback will be called from Java.
        // hopefully the closure with the playername is available at that time. 
        // If it's not, we'll need to write a Java method that takes the username.
        new EventCallback({
            callback: function (event) {
                const userWhoTriggeredEvent = event.getPlayer().getName();
                if (userWhoTriggeredEvent !== me) {
                   return; // Early return because triggered by another player
                }
                const itemType = magik.getItem().getType();
                // ^ returns one of https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/Material.html
                event.setCancelled(true); // set true to cancel the server effect of this consumption
                log("I consumed " + itemType.toString()); // .toString() may not be necessary
            }
        }));
```