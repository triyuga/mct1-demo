"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityDamageByEntityEvent_1 = require("./EntityDamageByEntityEvent");
var EventEmitter_1 = require("./EventEmitter");
var magik = magikcraft.io;
var log = magik.dixit;
var eventHandlers = {
    EntityDamageByEntityEvent: EntityDamageByEntityEvent_1.default,
};
var Events = {
    test: 'test',
    on: EventEmitter_1.default.on,
    registerAll: function () {
        for (var name in eventHandlers) {
            eventHandlers[name]();
        }
    },
};
log('Events.test: ' + Events.test);
exports.default = Events;
