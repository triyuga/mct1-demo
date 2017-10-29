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
        this.setFood(2);
        this.doDigestion();
        this.renderBars();
        magik.Events.on('PlayerItemConsumeEvent', this.onConsume);
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
        // First, clear all bars.... 
        if (state.bglBar)
            state.bglBar.destroy();
        if (state.insulinBar)
            state.insulinBar.destroy();
        if (state.digestionBar0)
            state.digestionBar0.destroy();
        if (state.digestionBar1)
            state.digestionBar1.destroy();
        // Minecraft supports upto 4 bars onscreen at once.
        // bglBar color
        var color = 'GREEN';
        if (state.bgl >= 4 && state.bgl <= 8) {
            color = 'GREEN';
        }
        else if ((state.bgl < 4 && state.bgl >= 2) || (state.bgl > 8 && state.bgl <= 12)) {
            color = 'YELLOW';
        }
        else {
            color = 'RED';
        }
        // bglBar
        state.bglBar = Bar.bar()
            .text("BGL: " + Math.round(state.bgl * 10) / 10) // round to 1 decimal
            .color(Bar.color[color])
            .style(Bar.style.NOTCHED_20)
            .progress((state.bgl / 20) * 100)
            .show();
        // insulinBar
        state.insulinBar = Bar.bar()
            .text("Insulin: " + Math.round(state.insulin * 10) / 10) // round to 1 decimal
            .color(Bar.color.BLUE)
            .style(Bar.style.NOTCHED_20)
            .progress((state.insulin / 20) * 100) // insulin as percentage, rounded to 1 decimal
            .show();
        // digestionBar(s)
        state.digestionQueue.slice(0, 2).map(function (item, i) {
            state["digestionBar" + i] = Bar.bar()
                .text("Digesting: " + item.type)
                .color(Bar.color.PURPLE)
                .style(Bar.style.NOTCHED_20)
                .progress(100 - item.percentDigested)
                .show();
        });
        // SetState
        State_1.setState(state);
    },
    doDigestion: function () {
        // log('digesting...');
        var that = this;
        magik.setTimeout(function () {
            var updated = false;
            // handle insulin in system
            if (state.insulin > 0) {
                state.insulin -= 0.1;
                state.bgl -= 0.3;
                updated = true;
            }
            // handle digestionQueue
            if (state.digestionQueue[0]) {
                state.digestionQueue[0].percentDigested += 5;
                state.bgl += 0.2;
                if (state.digestionQueue[0].percentDigested >= 100) {
                    // finished digesting... remove from queue...
                    state.digestionQueue.splice(0, 1);
                }
                updated = true;
            }
            // update if changes...
            if (updated) {
                State_1.setState(state);
                that.renderBars();
                that.doEffects();
            }
            // repeat ongoingly!
            that.doDigestion();
        }, 1000);
    },
    onConsume: function (event) {
        var type = event.getItem().getType();
        if (Food_1.default[type]) {
            log("You ate a " + type + "!");
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
        else if (type == 'POTION') {
            log("You drank an INSULIN POTION!");
            state.insulin += 2;
            State_1.setState(state);
            this.renderBars();
        }
    },
    doEffects: function () {
        if ((state.bgl < 4 && state.bgl >= 2) || (state.bgl >= 10 && state.bgl < 12)) {
            this.doConfusion();
        }
        else if (state.bgl < 2 || state.bgl > 10) {
            this.doBlindness();
        }
    },
    doConfusion: function () {
        if (!state.confusionEffect) {
            this._makeEffect('CONFUSION', 3000);
            state.confusionEffect = true;
            State_1.setState(state);
            magik.setTimeout(function () {
                state.confusionEffect = false;
                State_1.setState(state);
            }, 3000);
        }
    },
    doBlindness: function () {
        if (!state.blindnessEffect) {
            this._makeEffect('BLINDNESS', 5000);
            state.blindnessEffect = true;
            State_1.setState(state);
            magik.setTimeout(function () {
                state.blindnessEffect = false;
                State_1.setState(state);
            }, 5000);
        }
    },
    _makeEffect: function (type, milliseconds, color) {
        if (color === void 0) { color = 'GREEN'; }
        var PotionEffect = magik.type("potion.PotionEffect");
        var PotionEffectType = magik.type("potion.PotionEffectType");
        var Color = magik.type("Color");
        var duration = milliseconds / 1000 * 40; // 20 tick. 1 tick = 0.05 seconds
        var amplifier = 1;
        var c = Color[color];
        var l = PotionEffectType[type];
        var effect = new PotionEffect(l, duration, amplifier, true, true, c);
        player.addPotionEffect(effect);
    },
    getInventory: function () {
        var inventory = player.getInventory(); //Contents of player inventory
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
        var items = [
            { type: 'APPLE', amount: 64 },
            { type: 'BREAD', amount: 64 },
            { type: 'COOKED_FISH', amount: 64 },
            { type: 'POTION', amount: 128 },
        ];
        var server = magik.getPlugin().getServer();
        items.map(function (item) {
            server.dispatchCommand(server.getConsoleSender(), "give " + player.getName() + " " + item.type + " " + item.amount);
            magik.dixit("server.dispatchCommand(give " + player.getName() + " " + item.type + " " + item.amount + ")");
        });
    },
    clearInventory: function () {
        player.getInventory()['clear']();
    },
};
exports.default = Player;
