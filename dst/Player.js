"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var magik = magikcraft.io;
var BGL_BAR_KEY = 'mct1.bar.bgl';
var PlayerClass = (function () {
    function PlayerClass(name) {
        this.name = name;
        magik.dixit(name);
    }
    PlayerClass.prototype.getInventory = function () {
        magik.dixit('Player.getInventory()');
        var sender = magik.getSender();
        var inventory = sender.getInventory(); //Contents of player inventory
        for (var i = 0; i <= 35; i++) {
            var item = inventory['getItem'](i);
            if (item) {
                var type = item.getType();
                var amount = item.getAmount();
                magik.dixit('i: ' + i);
                magik.dixit('type: ' + type);
                magik.dixit('amount: ' + amount);
            }
        }
    };
    return PlayerClass;
}());
var playerName = magik.getSender().getName();
var Player = new PlayerClass(playerName);
exports.default = Player;
