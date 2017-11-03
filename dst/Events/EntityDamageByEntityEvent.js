"use strict";
// https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/event/player/PlayerInteractEntityEvent.html
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter_1 = require("./EventEmitter");
var magik = magikcraft.io;
var log = magik.dixit;
var CommandCallback = Java.type("io.magikcraft.CommandCallback"), EventPriority = Java.type("org.bukkit.event.EventPriority"), EventCallback = Java.type("io.magikcraft.EventCallback");
function EntityDamageByEntityEvent() {
    magik.getPlugin().registerEvent(Java.type("org.bukkit.event.entity.EntityDamageByEntityEvent").class, EventPriority.MONITOR, true, new EventCallback({
        callback: function (event) {
            magik.dixit('EntityDamageByEntityEvent');
            EventEmitter_1.default.emit('EntityDamageByEntityEvent', event);
            var listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
            log('listeners: ' + JSON.stringify(listeners));
        }
    }));
}
exports.default = EntityDamageByEntityEvent;
