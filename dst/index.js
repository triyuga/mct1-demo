"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BGL_1 = require("./BGL");
var Insulin_1 = require("./Insulin");
var log = require("./old/util/log");
var magik = magikcraft.io;
function init() {
    log.info("init()");
    BGL_1.default.set(4);
    Insulin_1.default.set(0);
    listenConsume();
    var sender = magik.getSender();
    var playerName = sender.getName();
    magik.dixit("playerName: " + playerName);
    var plugin = magik.getPlugin();
    var server = plugin.getServer();
    // const consoleSender = server.getConsoleSender();
    server.dispatchCommand(null, "give " + playerName + " cake");
    magik.dixit("server.dispatchCommand(give " + playerName + " cake)");
    // var player = canon.plugin.getServer().getPlayer(playerName);
    // if (typeof playerName === "undefined") {
    //     canon.magik.msg(MSG.SATIO_GENERIC);
    //     return canon.sender.setFoodLevel(30);
    // }
    // var player = canon.plugin.getServer().getPlayer(playerName);
}
exports.init = init;
function setBGL(num) {
    if (num === void 0) { num = 0; }
    log.info("setBGL(" + num + ")");
    BGL_1.default.set(num);
}
exports.setBGL = setBGL;
function setInsulin(num) {
    if (num === void 0) { num = 0; }
    log.info("setInsulin(" + num + ")");
    Insulin_1.default.set(num);
}
exports.setInsulin = setInsulin;
function listenConsume() {
    magik.dixit('listening to PlayerItemConsumeEvent...');
    magik.Events.on('PlayerItemConsumeEvent', function (evt) {
        var event = evt.getItem();
        var foodType = event.getType();
        magik.dixit("you ate a " + foodType + "!");
        magik.dixit('event: ' + JSON.stringify(event));
    });
}
exports.listenConsume = listenConsume;
var _default = init;
exports.spells = {
    _default: _default,
    init: init,
    setBGL: setBGL,
    setInsulin: setInsulin,
    eat: eat,
};
