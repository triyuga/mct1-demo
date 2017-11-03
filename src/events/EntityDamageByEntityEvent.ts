// https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/event/player/PlayerInteractEntityEvent.html

import Emitter from './Emitter';
const magik = magikcraft.io;
const log = magik.dixit;
declare const Java: any;

const CommandCallback = Java.type("io.magikcraft.CommandCallback");
const EventPriority = Java.type("org.bukkit.event.EventPriority");
const EventCallback = Java.type("io.magikcraft.EventCallback");

const EntityDamageByEntityEvent = (plugin) => {
    plugin.registerEvent(
        Java.type("org.bukkit.event.entity.EntityDamageByEntityEvent").class,
        EventPriority.MONITOR,
        true,
        new EventCallback({
            callback: function (event: any) {
                Emitter.emit('EntityDamageByEntityEvent', event);
                log('here 1');

                const listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
                log('listeners: '+ JSON.stringify(listeners));
            }
        }));	
}

export default EntityDamageByEntityEvent;