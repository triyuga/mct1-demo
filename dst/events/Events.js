"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var edbee_1 = require("./edbee");
var Emitter_1 = require("./Emitter");
var magik = magikcraft.io;
var log = magik.dixit;
var eventHandlers = {
    edbee: edbee_1.default,
};
var Events = {
    test: 'test',
    on: Emitter_1.default.on,
    registerAll: function () {
        for (var name in eventHandlers) {
            eventHandlers[name](magik.getPlugin());
        }
    },
    unregisterAll: function (event) {
        Emitter_1.default.removeAllListeners();
        // event.getHandlerList().unregisterAll(magik.getPlugin());
        var listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
        log('listeners: ' + JSON.stringify(listeners));
    },
};
log('Events.test: ' + Events.test);
exports.default = Events;
