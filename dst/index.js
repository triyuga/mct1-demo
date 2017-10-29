"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player_1 = require("./Player");
exports.spells = {
    _default: function () { return Player_1.default.init(); },
    // Below: Utility functions only, not required for MCT1 operation.
    setBGL: function () { return Player_1.default.setBGL(); },
    setInsulin: function (num) { return Player_1.default.setInsulin(num); },
    setHeatlh: function (num) { return Player_1.default.setHealth(num); },
    setFood: function (num) { return Player_1.default.setFood(num); },
    getInventory: function () { return Player_1.default.getInventory(); },
};
