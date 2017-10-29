"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { IBar } from 'magikcraft-lore-ui-bar/dst';
// import * as log from './old/util/log';
var Bar = require("./Bar");
// import * as uuid from 'uuid';
var magik = magikcraft.io;
var log = magik.dixit;
var INSULIN_BAR_KEY = 'mct1.bar.insulin';
var BGL_BAR_KEY = 'mct1.bar.BGL';
var DIGESTION_BAR_KEY = 'mct1.bar.digestiom';
var PlayerClass = (function () {
    function PlayerClass(name) {
        var _this = this;
        this.setFood = function (num) {
            _this.player.setFoodLevel(num);
        };
        this.setHealth = function (num) {
            _this.player.setHealth(num);
        };
        this.renderBars = function () {
            // BGLBar
            var BGLBar = Bar.bar()
                .text("BGL: " + _this.insulin)
                .color(Bar.color[_this._BGLBarColor()])
                .style(Bar.style.NOTCHED_20)
                .progress((_this.BGL / 20) * 100)
                .show();
            magik.playerMap.get(BGL_BAR_KEY).destroy();
            magik.playerMap.put(BGL_BAR_KEY, BGLBar);
            // insulinBar
            var insulinBar = Bar.bar()
                .text("BGL: " + _this.insulin)
                .color(Bar.color[_this._BGLBarColor()])
                .style(Bar.style.NOTCHED_20)
                .progress((_this.BGL / 20) * 100)
                .show();
            magik.playerMap.get(INSULIN_BAR_KEY).destroy();
            magik.playerMap.put(INSULIN_BAR_KEY, insulinBar);
            var digestionItems = _this.digestionQueue.slice(0, 3);
            log('digestionItems.length: ' + digestionItems.length);
            digestionItems.map(function (item) {
                // digestionBar
                var digestionBar = Bar.bar()
                    .text("Digesting: " + item.type)
                    .color(Bar.color.RED)
                    .style(Bar.style.NOTCHED_20)
                    .progress(item.percentDigested)
                    .show();
                magik.playerMap.get(DIGESTION_BAR_KEY + "." + item.uuid).destroy();
                magik.playerMap.put(DIGESTION_BAR_KEY + "." + item.uuid, digestionBar);
            });
        };
        this.doDigestion = function () {
            log('digesting...');
            log('this.digestionQueue.length: ' + _this.digestionQueue.length);
            _this.digestionQueue.map(function (item, i) { return log("digestionQueue[" + i + "].type: " + item.type); });
            var that = _this;
            magik.setTimeout(function () {
                if (that.digestionQueue[0]) {
                    that.digestionQueue[0].percentDigested += 20;
                    if (that.digestionQueue[0].percentDigested >= 100) {
                        // finished digesting, remove from queue...
                        that.digestionQueue.splice(0, 1);
                    }
                    // that.renderBars();
                }
                // repeat!
                log('repeat doDigestion');
                that.doDigestion();
            }, 3000);
        };
        this._BGLBarColor = function () {
            var color = 'GREEN';
            if (_this.BGL >= 4 && _this.BGL <= 8) {
                color = 'GREEN';
            }
            else if ((_this.BGL < 4 && _this.BGL >= 2) || (_this.BGL > 8 && _this.BGL <= 10)) {
                color = 'ORANGE';
            }
            else {
                color = 'RED';
            }
            return color;
        };
        this.initialised = false;
        this.name = name;
        log('name: ' + name);
        this.player = magik.getSender();
        this.insulin = 0;
        this.BGL = 4;
        this.digestionQueue = [];
    }
    PlayerClass.prototype.init = function () {
        if (!this.initialised) {
            this.clearInventory();
            this.setupInventory();
            this.setFood(10);
            this.doDigestion();
            this.onConsume();
            this.renderBars();
            this.initialised = true;
        }
    };
    PlayerClass.prototype.setInsulin = function (num) {
        if (num === void 0) { num = 0; }
        this.insulin = num;
    };
    PlayerClass.prototype.setBGL = function (num) {
        if (num === void 0) { num = 0; }
        this.BGL = num;
    };
    PlayerClass.prototype.onConsume = function () {
        log('onConsume');
        // magik.Events.on('PlayerItemConsumeEvent', (event) => {
        // 	const type = event.getItem().getType();
        // 	// const amount = event.getItem().getAmount();
        // 	if (Food[type]) {
        // 		log(`You consumed a ${type}!`);
        // 		const digestionQueueItem = {
        // 			uuid: Utils.makeTimestamp(),
        // 			type: type,
        // 			percentDigested: 0,
        // 		};
        // 		this.digestionQueue.push(digestionQueueItem);
        // 		this.digestionQueue.map((item, i) => log(`item[${i}].type: ${item.type}`));
        // 		this.renderBars();
        // 		// event.setCancelled(true);
        // 	}
        // });
    };
    PlayerClass.prototype.getInventory = function () {
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
    };
    PlayerClass.prototype.setupInventory = function () {
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
    };
    PlayerClass.prototype.clearInventory = function () {
        this.player.getInventory().clear();
    };
    return PlayerClass;
}());
var playerName = magik.getSender().getName();
var Player = new PlayerClass(playerName);
exports.default = Player;
