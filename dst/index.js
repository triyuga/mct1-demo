"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player_1 = require("./Player");
var _default = Player_1.default.init;
exports.spells = {
    _default: _default,
    setBGL: Player_1.default.setBGL,
    setInsulin: Player_1.default.setInsulin,
    setHeatlh: Player_1.default.setHealth,
    setFood: Player_1.default.setFood,
    getInventory: Player_1.default.getInventory,
};
