"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var magik = magikcraft.io;
function giveInsulinPotions(quantity) {
    if (quantity === void 0) { quantity = 1; }
    var MATERIAL = Java.type("org.bukkit.Material");
    var ItemStack = Java.type("org.bukkit.inventory.ItemStack");
    var potion = new ItemStack(MATERIAL['POTION']);
    for (var i = 0; i++; i < quantity) {
        magik.getSender().getInventory().addItem(potion);
    }
}
exports.giveInsulinPotions = giveInsulinPotions;
