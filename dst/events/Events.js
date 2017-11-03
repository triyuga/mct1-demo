"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var entityDamageByEntityEvent_1 = require("./entityDamageByEntityEvent");
var Emitter_1 = require("./Emitter");
var magik = magikcraft.io;
var log = magik.dixit;
var eventHandlers = {
    entityDamageByEntityEvent: entityDamageByEntityEvent_1.default,
};
var Eventer = {
    test: 'test',
    on: Emitter_1.default.on,
    registerAll: function () {
        for (var name in eventHandlers) {
            eventHandlers[name]();
        }
    },
    unregisterAll: function (event) {
        Emitter_1.default.removeAllListeners();
        // event.getHandlerList().unregisterAll(magik.getPlugin());
        var listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
        log('listeners: ' + JSON.stringify(listeners));
    },
};
log('Eventer.test: ' + Eventer.test);
exports.default = Eventer;
