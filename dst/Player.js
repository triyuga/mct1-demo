"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { IBar } from 'magikcraft-lore-ui-bar/dst';
// import * as log from './old/util/log';
var Bar = require("./Bar");
var Utils_1 = require("./Utils");
var Food_1 = require("./Food");
// import * as uuid from 'uuid';
var magik = magikcraft.io;
var log = magik.dixit;
var INSULIN_BAR_KEY = 'mct1.bar.insulin';
var BGL_BAR_KEY = 'mct1.bar.BGL';
var DIGESTION_BAR_KEY = 'mct1.bar.digestiom';
var Player = {
    name: magik.getSender().getName(),
    player: magik.getSender(),
    insulin: magik.playerMap.get('insulin') || 0,
    BGL: magik.playerMap.get('BGL') || 4,
    init: function () {
        this.clearInventory();
        this.setupInventory();
        this.setFood(10);
        this.doDigestion();
        this.renderBars();
        magik.Events.on('PlayerItemConsumeEvent', this._onConsume);
    },
    setFood: function (num) {
        this.player.setFoodLevel(num);
    },
    setHealth: function (num) {
        this.player.setHealth(num);
    },
    setInsulin: function (num) {
        if (num === void 0) { num = 0; }
        this.insulin = num;
        magik.playerMap.put('insulin', this.insulin);
    },
    setBGL: function (num) {
        if (num === void 0) { num = 0; }
        this.BGL = num;
        magik.playerMap.put('BGL', this.BGL);
    },
    renderBars: function () {
        // BGLBar
        var color = 'GREEN';
        if (this.BGL >= 4 && this.BGL <= 8) {
            color = 'GREEN';
        }
        else if ((this.BGL < 4 && this.BGL >= 2) || (this.BGL > 8 && this.BGL <= 10)) {
            color = 'ORANGE';
        }
        else {
            color = 'RED';
        }
        var BGLBar = Bar.bar()
            .text("BGL: " + this.insulin)
            .color(Bar.color[color])
            .style(Bar.style.NOTCHED_20)
            .progress((this.BGL / 20) * 100)
            .show();
        if (magik.playerMap.containsKey(BGL_BAR_KEY))
            magik.playerMap.get(BGL_BAR_KEY).destroy();
        magik.playerMap.put(BGL_BAR_KEY, BGLBar);
        // insulinBar
        var insulinBar = Bar.bar()
            .text("Insulin: " + this.insulin)
            .color(Bar.color.BLUE)
            .style(Bar.style.NOTCHED_20)
            .progress((this.BGL / 20) * 100)
            .show();
        if (magik.playerMap.containsKey(INSULIN_BAR_KEY))
            magik.playerMap.get(INSULIN_BAR_KEY).destroy();
        magik.playerMap.put(INSULIN_BAR_KEY, insulinBar);
        if (magik.playerMap.containsKey(DIGESTION_BAR_KEY + ".0"))
            magik.playerMap.get(DIGESTION_BAR_KEY + ".0").destroy();
        if (magik.playerMap.containsKey(DIGESTION_BAR_KEY + ".1"))
            magik.playerMap.get(DIGESTION_BAR_KEY + ".1").destroy();
        if (magik.playerMap.containsKey(DIGESTION_BAR_KEY + ".2"))
            magik.playerMap.get(DIGESTION_BAR_KEY + ".2").destroy();
        var digestionQueue = magik.playerMap.get('digestionQueue') || [];
        digestionQueue.slice(0, 3).map(function (item, i) {
            // digestionBar
            var digestionBar = Bar.bar()
                .text("Digesting: " + item.type)
                .color(Bar.color.RED)
                .style(Bar.style.NOTCHED_20)
                .progress(item.percentDigested)
                .show();
            var barKey = DIGESTION_BAR_KEY + "." + i;
            magik.playerMap.put(barKey, digestionBar);
        });
    },
    doDigestion: function () {
        log('digesting...');
        var that = this;
        magik.setTimeout(function () {
            var digestionQueue = magik.playerMap.get('digestionQueue') || [];
            var item = digestionQueue[0];
            log('digestionQueue: ' + JSON.stringify(digestionQueue));
            if (item) {
                item.percentDigested += 21;
                if (item.percentDigested > 100) {
                    log('finished digesting ' + item.uuid + ' (' + item.type + ')');
                    // finished digesting...
                    // remove bar...
                    var barKey = DIGESTION_BAR_KEY + "." + digestionQueue[0].uuid;
                    if (magik.playerMap.containsKey(barKey)) {
                        log('destroy ' + barKey);
                        magik.playerMap.get(barKey).destroy();
                    }
                    digestionQueue.splice(0, 1);
                    log('updated digestionQueue: ' + JSON.stringify(digestionQueue));
                    // remove from queue...
                    magik.playerMap.put('digestionQueue', digestionQueue);
                }
                that.renderBars();
            }
            // repeat!
            log('repeat doDigestion');
            that.doDigestion();
        }, 3000);
    },
    _onConsume: function (event) {
        log('onConsume');
        var type = event.getItem().getType();
        // const amount = event.getItem().getAmount();
        if (Food_1.default[type]) {
            log("You consumed a " + type + "!");
            var item = {
                timestamp: Utils_1.default.makeTimestamp(),
                type: type,
                percentDigested: 0,
            };
            this.setDigestionQueue(this.getDigestionQueue().push(item));
            this.renderBars();
            // event.setCancelled(true);
        }
    },
    getDigestionQueue: function () {
        var digestionQueue = magik.playerMap.get('digestionQueue') || [];
        digestionQueue.sort(function (a, b) { return a.timestamp - b.timestamp; });
        return digestionQueue;
    },
    setDigestionQueue: function (digestionQueue) {
        magik.playerMap.put('digestionQueue', digestionQueue);
    },
    getInventory: function () {
        var inventory = this.player.getInventory(); //Contents of player inventory
        for (var i = 0; i <= 35; i++) {
            var item = inventory['getItem'](i);
            if (item) {
                var type = item.getType();
                var amount = item.getAmount();
                log('i: ' + i);
                log('type: ' + type);
                log('amount: ' + amount);
            }
        }
    },
    setupInventory: function () {
        var _this = this;
        var items = [
            { type: 'CAKE', amount: 2 },
            { type: 'APPLE', amount: 10 },
            { type: 'BREAD', amount: 5 },
            { type: 'COOKED_FISH', amount: 5 },
        ];
        var server = magik.getPlugin().getServer();
        items.map(function (item) {
            server.dispatchCommand(server.getConsoleSender(), "give " + _this.name + " " + item.type + " " + item.amount);
            magik.dixit("server.dispatchCommand(give " + _this.name + " " + item.type + " " + item.amount + ")");
        });
    },
    clearInventory: function () {
        this.player.getInventory().clear();
    },
};
// const playerName = magik.getSender().getName();
// const Player = new PlayerClass(playerName);
exports.default = Player;
