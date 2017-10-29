"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bukkit = require("../lib/bukkit");
var magik = magikcraft.io;
function registerConsumeEventHandler(callback) {
    var me = magik.getSender();
    magik.getPlugin().registerEvent(Bukkit.PlayerItemConsumeEvent.class, Bukkit.EventPriority.MONITOR, true, new Bukkit.EventCallback({
        callback: function (event) {
            var username = event.player.playerListName;
            var isMe = (username == me.getName());
            if (!isMe) {
                return;
            }
            callback(event);
        }
    }));
}
exports.registerConsumeEventHandler = registerConsumeEventHandler;
