"use strict";
// https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/event/player/PlayerInteractEntityEvent.html
Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("./Emitter");
var magik = magikcraft.io;
var log = magik.dixit;
var EventPriority = Java.type("org.bukkit.event.EventPriority");
var EventCallback = Java.type("io.magikcraft.EventCallback");
var _EntityDamageByEntityEvent = Java.type("org.bukkit.event.entity.EntityDamageByEntityEvent");
var EntityDamageByEntityEvent = {
    register: function () {
        magik.getPlugin().registerEvent(_EntityDamageByEntityEvent.class, EventPriority.MONITOR, true, new EventCallback({
            callback: function (event) {
                Emitter_1.default.emit('EntityDamageByEntityEvent', event);
            }
        }));
    },
    unregister: function () {
        _EntityDamageByEntityEvent.getHandlerList().unregister(magik.getPlugin()); // unregister listeners owned by plugin from PlayerMoveEvent
    },
};
// const EntityDamageByEntityEvent = () => {
//     magik.getPlugin().registerEvent(
//         Java.type("org.bukkit.event.entity.EntityDamageByEntityEvent").class,
//         EventPriority.MONITOR,
//         true,
//         new EventCallback({
//             callback: function (event: any) {
//                 Emitter.emit('EntityDamageByEntityEvent', event);
//             }
//         }));	
// }
exports.default = EntityDamageByEntityEvent;
