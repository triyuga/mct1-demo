"use strict";
// https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/event/player/PlayerInteractEntityEvent.html
Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("./Emitter");
var magik = magikcraft.io;
var log = magik.dixit;
var CommandCallback = Java.type("io.magikcraft.CommandCallback");
var EventPriority = Java.type("org.bukkit.event.EventPriority");
var EventCallback = Java.type("io.magikcraft.EventCallback");
var EntityDamageByEntityEvent = function (plugin) {
    plugin.registerEvent(Java.type("org.bukkit.event.entity.EntityDamageByEntityEvent").class, EventPriority.MONITOR, true, new EventCallback({
        callback: function (event) {
            Emitter_1.default.emit('EntityDamageByEntityEvent', event);
            var listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
            log('listeners: ' + JSON.stringify(listeners));
        }
    }));
};
exports.default = EntityDamageByEntityEvent;
