"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityDamageByEntityEvent_1 = require("./EntityDamageByEntityEvent");
var EventEmitter_1 = require("./EventEmitter");
var magik = magikcraft.io;
var log = magik.dixit;
var eventHandlers = {
    EntityDamageByEntityEvent: EntityDamageByEntityEvent_1.default,
};
exports.Events = {
    on: EventEmitter_1.default.on,
    registerAll: function () {
        for (var name in eventHandlers) {
            eventHandlers[name]();
        }
    },
    unregisterAll: function (event) {
        EventEmitter_1.default.removeAllListeners();
        // event.getHandlerList().unregisterAll(magik.getPlugin());
        var listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
        log('listeners: ' + JSON.stringify(listeners));
    },
};
// export default Events; 
