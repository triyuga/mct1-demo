"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bar = require("./Bar");
var Utils_1 = require("./Utils");
var Food_1 = require("./Food");
var State_1 = require("./State");
var magik = magikcraft.io;
var log = magik.dixit;
var player = magik.getSender();
var state = State_1.getState();
var Player = {
    init: function () {
        this.clearInventory();
        this.setupInventory();
        this.setFood(10);
        this.doDigestion();
        this.renderBars();
        magik.Events.on('PlayerItemConsumeEvent', this._onConsume);
    },
    setFood: function (num) {
        player.setFoodLevel(num);
    },
    setHealth: function (num) {
        player['setHealth'](num);
    },
    setInsulin: function (num) {
        if (num === void 0) { num = 0; }
        state.insulin = num;
        State_1.setState(state);
    },
    setBGL: function (num) {
        if (num === void 0) { num = 0; }
        state.bgl = num;
        State_1.setState(state);
    },
    renderBars: function () {
        if (state.bglBar)
            state.bglBar.destroy();
        if (state.insulinBar)
            state.insulinBar.destroy();
        if (state.digestionBar0)
            state.digestionBar0.destroy();
        if (state.digestionBar1)
            state.digestionBar1.destroy();
        if (state.digestionBar2)
            state.digestionBar2.destroy();
        // BGLBar
        var color = 'GREEN';
        if (state.bgl >= 4 && state.bgl <= 8)
            color = 'GREEN';
        else if ((state.bgl < 4 && state.bgl >= 2) || (state.bgl > 8 && state.bgl <= 10))
            color = 'ORANGE';
        else
            color = 'RED';
        state.bglBar = Bar.bar()
            .text("BGL: " + state.insulin)
            .color(Bar.color[color])
            .style(Bar.style.NOTCHED_20)
            .progress((state.bgl / 20) * 100)
            .show();
        // insulinBar
        state.insulinBar = Bar.bar()
            .text("Insulin: " + state.insulin)
            .color(Bar.color.BLUE)
            .style(Bar.style.NOTCHED_20)
            .progress((state.bgl / 20) * 100)
            .show();
        // digestionBar(s)
        state.digestionQueue.slice(0, 3).map(function (item, i) {
            state["digestionBar" + i] = Bar.bar()
                .text("Digesting: " + item.type)
                .color(Bar.color.RED)
                .style(Bar.style.NOTCHED_20)
                .progress(item.percentDigested)
                .show();
        });
        State_1.setState(state);
    },
    doDigestion: function () {
        log('digesting...');
        var that = this;
        magik.setTimeout(function () {
            if (state.digestionQueue[0]) {
                state.digestionQueue[0].percentDigested += 21;
                if (state.digestionQueue[0].percentDigested > 100) {
                    // finished digesting... remove from queue...
                    state.digestionQueue.splice(0, 1);
                }
                State_1.setState(state);
                that.renderBars();
            }
            // repeat!
            that.doDigestion();
        }, 3000);
    },
    _onConsume: function (event) {
        var type = event.getItem().getType();
        // const amount = event.getItem().getAmount();
        if (Food_1.default[type]) {
            log("You consumed a " + type + "!");
            var item = {
                timestamp: Utils_1.default.makeTimestamp(),
                type: type,
                percentDigested: 0,
            };
            state.digestionQueue.push(item);
            State_1.setState(state);
            this.renderBars();
            // event.setCancelled(true);
        }
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
exports.default = Player;
