"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityDamageByEntityEvent_1 = require("./EntityDamageByEntityEvent");
var EventEmitter_1 = require("./EventEmitter");
var magik = magikcraft.io;
var log = magik.dixit;
var events = {
    EntityDamageByEntityEvent: EntityDamageByEntityEvent_1.default,
};
var Events = {
    on: EventEmitter_1.default.on,
    registerAll: function () {
        for (var name in events) {
            events[name]();
        }
    },
    unregisterAll: function (event) {
        EventEmitter_1.default.removeAllListeners();
        // event.getHandlerList().unregisterAll(magik.getPlugin());
        var listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
        log('listeners: ' + JSON.stringify(listeners));
    },
};
exports.default = Events;
