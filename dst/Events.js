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
var State_1 = require("./State");
// import instanceUUID from './instanceUUID';
var eventTypes = {
    PlayerDeathEvent: 'org.bukkit.event.entity.PlayerDeathEvent',
    PlayerRespawnEvent: 'org.bukkit.event.player.PlayerRespawnEvent',
    EntityDamageByEntityEvent: 'org.bukkit.event.entity.EntityDamageByEntityEvent',
    EntityDamageEvent: 'org.bukkit.event.entity.EntityDamageEvent',
    ProjectileHitEvent: 'org.bukkit.event.entity.ProjectileHitEvent',
    PlayerItemConsumeEvent: 'org.bukkit.event.player.PlayerItemConsumeEvent',
};
var Events = {
    on: function (eventName, callback) { return Emitter.on(eventName, callback); },
    registerAll: function (instanceUUID) {
        var _loop_1 = function (type) {
            var javaType = eventTypes[type];
            magik.getPlugin().registerEvent(Java.type(javaType).class, EventPriority.MONITOR, true, new EventCallback({
                callback: function (event) {
                    var state = State_1.getState();
                    log('-----.instanceUUID: ' + instanceUUID);
                    log('state.instanceUUID: ' + state.instanceUUID);
                    if (state.instanceUUID === instanceUUID) {
                        // Only emit if state.instanceUUID !== instanceUUID at time of registration.								
                        Emitter.emit(type, event);
                        // return;
                    }
                }
            }));
        };
        for (var type in eventTypes) {
            _loop_1(type);
        }
    },
};
exports.default = Events;
