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
    setHeatlh(10);
    setFood(10);
    getInventory();
}
exports.init = init;
function getInventory() {
    log.info("getContents()");
    var sender = magik.getSender();
    var inventory = sender.getInventory(); //Contents of player inventory
    var contents = inventory['getContents']();
    magik.dixit("Inventory contents: " + JSON.stringify(contents));
}
exports.getInventory = getInventory;
function setInventory() {
    var sender = magik.getSender();
    var playerName = sender.getName();
    var plugin = magik.getPlugin();
    var server = plugin.getServer();
    var consoleSender = server.getConsoleSender();
    var items = [
        { type: 'CAKE', amount: 2 },
        { type: 'APPLE', amount: 10 },
        { type: 'BREAD', amount: 5 },
        { type: 'COOKED_FISH', amount: 5 },
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
function setFood(num) {
    if (num === void 0) { num = 10; }
    log.info("setFood(" + num + ")");
    var sender = magik.getSender();
    sender.setFoodLevel(num);
}
exports.setFood = setFood;
function setHeatlh(num) {
    if (num === void 0) { num = 20; }
    log.info("setHeatlh(" + num + ")");
    var sender = magik.getSender();
    sender['setHealth'](num);
}
exports.setHeatlh = setHeatlh;
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
    setHeatlh: setHeatlh,
    setFood: setFood,
    getInventory: getInventory,
};
