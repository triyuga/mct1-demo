// https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/event/player/PlayerInteractEntityEvent.html

import EventEmitter from './EventEmitter';
const magik = magikcraft.io;
const log = magik.dixit;
declare const Java: any;

const CommandCallback = Java.type("io.magikcraft.CommandCallback"),
    EventPriority = Java.type("org.bukkit.event.EventPriority"),
    EventCallback = Java.type("io.magikcraft.EventCallback");

export default function EntityDamageByEntityEvent() {
    magik.getPlugin().registerEvent(
        Java.type("org.bukkit.event.entity.EntityDamageByEntityEvent").class,
        EventPriority.MONITOR,
        true,
        new EventCallback({
            callback: function (event: any) {
                magik.dixit('EntityDamageByEntityEvent');
                EventEmitter.emit('EntityDamageByEntityEvent', event);

                const listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
                log('listeners: '+ JSON.stringify(listeners));
            }
        }));	
}
