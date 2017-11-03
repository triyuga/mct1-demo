"use strict";
// https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/event/player/PlayerInteractEntityEvent.html
Object.defineProperty(exports, "__esModule", { value: true });
var magik = magikcraft.io;
var log = magik.dixit;
var CommandCallback = Java.type("io.magikcraft.CommandCallback");
var EventPriority = Java.type("org.bukkit.event.EventPriority");
var EventCallback = Java.type("io.magikcraft.EventCallback");
function EntityDamageByEntityEvent() {
    magik.getPlugin().registerEvent(Java.type("org.bukkit.event.entity.EntityDamageByEntityEvent").class, EventPriority.MONITOR, true, new EventCallback({
        callback: function (event) {
            magik.dixit('EntityDamageByEntityEvent');
            // Emitter.emit('EntityDamageByEntityEvent', event);
            // const listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
            // log('listeners: '+ JSON.stringify(listeners));
        }
    }));
}
exports.default = EntityDamageByEntityEvent;
