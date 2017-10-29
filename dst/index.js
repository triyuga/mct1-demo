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
    setInventory();
}
exports.init = init;
function setInventory() {
    var sender = magik.getSender();
    var playerName = sender.getName();
    var plugin = magik.getPlugin();
    var server = plugin.getServer();
    var consoleSender = server.getConsoleSender();
    var items = [
        { type: 'cake', amount: 2 },
        { type: 'apple', amount: 10 },
        { type: 'bread', amount: 5 },
        { type: 'fish', amount: 5 },
    ];
    items.map(function (item) {
        server.dispatchCommand(consoleSender, "give " + playerName + " " + item.type + " " + item.amount);
        magik.dixit("server.dispatchCommand(give " + playerName + " " + item.type + " " + item.amount + ")");
    });
}
exports.setInventory = setInventory;
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
    listenConsume: listenConsume,
    setInventory: setInventory,
};
