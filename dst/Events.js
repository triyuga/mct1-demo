"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var Emitter = new events_1.EventEmitter();
var magik = magikcraft.io;
var log = magik.dixit;
// const Listener = Java.type("org.bukkit.event");
// const HandlerList = Java.type("org.bukkit.event.HandlerList");
var EventPriority = Java.type("org.bukkit.event.EventPriority");
var EventCallback = Java.type("io.magikcraft.EventCallback");
var eventTypes = {
    PlayerDeathEvent: 'org.bukkit.event.entity.PlayerDeathEvent',
    PlayerRespawnEvent: 'org.bukkit.event.player.PlayerRespawnEvent',
    EntityDamageByEntityEvent: 'org.bukkit.event.entity.EntityDamageByEntityEvent',
    EntityDamageEvent: 'org.bukkit.event.entity.EntityDamageEvent',
    ProjectileHitEvent: 'org.bukkit.event.entity.ProjectileHitEvent',
    PlayerItemConsumeEvent: 'org.bukkit.event.player.PlayerItemConsumeEvent',
    PlayerQuitEvent: 'org.bukkit.event.player.PlayerQuitEvent',
    RegionEnterEvent: 'com.mewin.WGRegionEvents.events.RegionEnterEvent',
    RegionLeaveEvent: 'com.mewin.WGRegionEvents.events.RegionLeaveEvent',
};
var Events = {
    on: function (eventName, callback) { return Emitter.on(eventName, callback); },
    unregisterAll: function () {
        Emitter.removeAllListeners();
    },
    registerAll: function () {
        var _loop_1 = function (type) {
            var javaType = eventTypes[type];
            Emitter.removeAllListeners();
            magik.getPlugin().registerEvent(Java.type(javaType).class, EventPriority.MONITOR, true, new EventCallback({
                callback: function (event) {
                    Emitter.emit(type, event);
                }
            }));
        };
        for (var type in eventTypes) {
            _loop_1(type);
        }
    },
};
exports.default = Events;
