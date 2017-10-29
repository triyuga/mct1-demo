"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player_1 = require("./Player");
exports.spells = {
    _default: Player_1.default.init,
    setBGL: Player_1.default.setBGL,
    setInsulin: Player_1.default.setInsulin,
    setHeatlh: Player_1.default.setHealth,
    setFood: Player_1.default.setFood,
    getInventory: Player_1.default.getInventory,
};
