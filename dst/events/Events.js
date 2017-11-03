"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityDamageByEntityEvent_1 = require("./EntityDamageByEntityEvent");
var Emitter_1 = require("./Emitter");
var magik = magikcraft.io;
var log = magik.dixit;
var HandlerList = Java.type("org.bukkit.event.HandlerList");
var eventHandlers = {
    EntityDamageByEntityEvent: EntityDamageByEntityEvent_1.default,
};
var Events = {
    test: 'test',
    on: function (eventName, callback) { return Emitter_1.default.on(eventName, callback); },
    registerAll: function () {
        for (var name in eventHandlers) {
            eventHandlers[name].register();
        }
        // HandlerList.bakeAll();
    },
    unregisterAll: function () {
        for (var name in eventHandlers) {
            eventHandlers[name].unregister();
        }
        // HandlerList.unregisterAll(magik.getPlugin());
        // log('unregisterAll listeners...');
        // const listeners = HandlerList.getRegisteredListeners(magik.getPlugin());
        // log('listeners: ' + JSON.stringify(listeners));
        // Emitter.removeAllListeners();
        // // event.getHandlerList().unregisterAll(magik.getPlugin());
        // const listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
        // log('listeners: '+ JSON.stringify(listeners));
    },
};
exports.default = Events;
