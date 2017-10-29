"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../");
var log = require("../util/log");
var Bukkit = require("../lib/bukkit");
var Carbs_1 = require("../Carbs");
var magik = magikcraft.io;
function handleConsumeEvent(event) {
    if (event.getItem().getType() == Bukkit.Material.APPLE) {
        Carbs_1.Food.apple.eat();
        return;
    }
    if (event.getItem().getItemMeta() instanceof Bukkit.PotionMeta) {
        _1.takeInsulin();
        return;
    }
    log.info(event.getItem().toString());
}
function registerEventHandlers() {
    magik.Events.on('PlayerItemConsumeEvent', handleConsumeEvent);
}
exports.registerEventHandlers = registerEventHandlers;
