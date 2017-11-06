"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bar = require("./Bar");
var Utils_1 = require("./Utils");
var State_1 = require("./State");
// import * as fs from 'fs-extra'; 
var Events_1 = require("./Events");
// Read the file, and pass it to your callback
var magik = magikcraft.io;
var log = magik.dixit;
var player = magik.getSender();
var FoodList_1 = require("./FoodList");
var Food = {};
FoodList_1.default.forEach(function (item) { return Food[item.type] = item; });
// TODO:
// * Use XP bar for lightning
// * BGL going down due to insulin = get health
// * See in dark when in range
// * All super powers only when in range
// * don't allow them to below 2, or above 20 (blind at 15)
// * high GI go top top of queue, digest faster, effect BGL positively, even if insulin in system
// * low GI, digest slower, BGL still goes down in Insulin in system
var Player = {
    init: function () {
        this.destroyBars();
        this._init();
        player.setFoodLevel(2);
    },
    _init: function () {
        var state = State_1.getState();
        // Start digestion if not already started.
        if (!state.digesting) {
            this.doDigestion();
            state.digesting = true;
            State_1.setState(state);
            log('digesting!');
        }
        // Start listening if not already started.
        if (!state.listening) {
            log('listening!');
            this.enableEventListeners();
            state.listening = true;
            State_1.setState(state);
        }
        this.cancelNegativeEffects();
        this.cancelSuperPowers();
        this.clearInventory();
        this.setupInventory();
        this.renderBars();
        // log('state: ' + JSON.stringify(state));
    },
    enableEventListeners: function () {
        var _this = this;
        var state = State_1.getState();
        Events_1.default.registerAll();
        // ProjectileHitEvent
        Events_1.default.on('ProjectileHitEvent', function (event) {
            var state = State_1.getState();
            // Identify shooter. Skip if not player.
            var shooter = event.getEntity().getShooter();
            if (!shooter || shooter.getName() !== player.getName()) {
                return;
            }
            // Get loc
            var loc = null;
            if (event.getHitEntity()) {
                loc = event.getHitEntity().getLocation();
            }
            else if (event.getHitBlock()) {
                loc = event.getHitBlock().getLocation();
            }
            // Skip if could not find loc.
            if (!loc)
                return;
            // Summon lightning_bolt at location.
            var location = loc.getX() + " " + (loc.getY() + 1) + " " + loc.getZ();
            var server = magik.getPlugin().getServer();
            var cmd = "execute " + player.getName() + " ~ ~ ~ summon CHICKEN " + location;
            server.dispatchCommand(server.getConsoleSender(), cmd);
            // Food or Health cost...
            if (player.getFoodLevel() > 0) {
                player.setFoodLevel(Math.max(player.getFoodLevel() - 0.5, 0));
            }
        });
        // PlayerItemConsumeEvent
        Events_1.default.on('PlayerItemConsumeEvent', function (event) {
            var state = State_1.getState();
            // log('digestionQueue 1.0: ' + JSON.stringify(state.digestionQueue));
            // Identify consumer. Skip if not player.
            var consumer = event.getPlayer();
            if (consumer.getName() !== player.getName()) {
                return;
            }
            // Act on know FOOD eat...
            var type = event.getItem().getType();
            if (Food[type]) {
                log("You ate a " + type + "!");
                // log('digestionQueue 1.1: ' + JSON.stringify(state.digestionQueue));
                var item = {
                    timestamp: Utils_1.default.makeTimestamp(),
                    type: Food[type].type,
                    percentDigested: 0,
                };
                // log('item: ' + JSON.stringify(item));
                state.digestionQueue.push(item);
                State_1.setState(state);
                // log('digestionQueue 1.2: ' + JSON.stringify(state.digestionQueue));
                _this.renderBars();
                // event.setCancelled(true);
            }
            else if (type == 'POTION') {
                log("You drank an INSULIN POTION!");
                state.insulin += 2;
                State_1.setState(state);
                _this.renderBars();
            }
        });
        // PlayerDeathEvent
        Events_1.default.on('PlayerDeathEvent', function (event) {
            // Skip if not this player.
            if (event.getPlayer().getName() !== player.getName()) {
                return;
            }
            log('PlayerDeathEvent: ' + event.getDeathMessage());
            var state = State_1.getState();
            state.dead = true;
            State_1.setState(state);
            // this.reset();
        });
        // PlayerRespawnEvent
        Events_1.default.on('PlayerRespawnEvent', function (event) {
            // Skip if not this player.
            if (event.getPlayer().getName() !== player.getName()) {
                return;
            }
            log('PlayerRespawnEvent: ' + event.getRespawnLocation());
            var state = State_1.getState();
            state.dead = false;
            State_1.setState(state);
            // Re-init
            _this._init();
        });
        // EntityDamageEvent
        Events_1.default.on('EntityDamageEvent', function (event) {
            // Cancel lightning and fire damage for player.
            var entityType = event.getEntityType();
            if (entityType == 'PLAYER') {
                // Skip if not this player.
                if (event.getEntity().getName() !== player.getName()) {
                    return;
                }
                var cause = event.getCause(); // LIGHTNING STARVATION FIRE FALL ENTITY_ATTACK
                if (cause == 'LIGHTNING' || cause == 'FIRE' || cause == 'FIRE_TICK') {
                    magik.dixit('set LIGHTNING damage to 0 for ' + event.getEntity().getName());
                    event.setDamage(0);
                    event.setCancelled(true);
                }
            }
        });
        // PlayerQuitEvent
        Events_1.default.on('PlayerQuitEvent', function (event) {
            // Skip if not this player.
            if (event.getPlayer().getName() !== player.getName()) {
                return;
            }
            Events_1.default.unregisterAll();
        });
    },
    destroyBars: function () {
        var state = State_1.getState();
        if (state.bglBar)
            state.bglBar.destroy();
        if (state.insulinBar)
            state.insulinBar.destroy();
        if (state.digestionBar0)
            state.digestionBar0.destroy();
        if (state.digestionBar1)
            state.digestionBar1.destroy();
        state.bglBar = null;
        state.insulinBar = null;
        state.digestionBar0 = null;
        state.digestionBar1 = null;
        State_1.setState(state);
    },
    renderBars: function () {
        // First, clear all bars.... 
        this.destroyBars();
        var state = State_1.getState();
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
        // log('digestionQueue 3.1: ' + JSON.stringify(state.digestionQueue));
        state.digestionQueue.slice(0, 2).map(function (item, i) {
            var food = Food[item.type];
            state["digestionBar" + i] = Bar.bar()
                .text("Digesting: " + food.type + " (" + food.carbs + " carbs)")
                .color((food.GI === 'high') ? Bar.color.PURPLE : Bar.color.PINK)
                .style(Bar.style.NOTCHED_20)
                .progress(100 - item.percentDigested)
                .show();
        });
        // log('digestionQueue 3.2: ' + JSON.stringify(state.digestionQueue));
        // SetState
        State_1.setState(state);
    },
    doDigestion: function (tickCount) {
        if (tickCount === void 0) { tickCount = 0; }
        var state = State_1.getState();
        // log('digesting...');
        var that = this;
        magik.setTimeout(function () {
            // Skip if dead!
            if (state.dead) {
                log('skip digestion coz dead!');
                that.doDigestion(tickCount);
                return;
            }
            // Every 10 ticks...
            if (tickCount % 10 === 0) {
                // Reduce food level.
                player.setFoodLevel(Math.max((player.getFoodLevel() - 1), 0));
            }
            // handle insulin in system
            if (state.insulin > 0) {
                state.insulin -= 0.1;
                state.bgl -= 0.3;
                if (state.bgl < 2 && player.getFoodLevel() >= 20) {
                    player.setFoodLevel(15);
                }
            }
            // handle digestionQueue
            // log('digestionQueue 2.1: ' + JSON.stringify(state.digestionQueue));
            if (state.digestionQueue[0]) {
                state.digestionQueue[0].percentDigested += 5;
                state.bgl += 0.2;
                if (player['getHealth']() < 20) {
                    player['setHealth'](Math.min((player['getHealth']() + 0.5), 20));
                }
                if (state.digestionQueue[0].percentDigested >= 100) {
                    // finished digesting... remove from queue...
                    state.digestionQueue.splice(0, 1);
                }
            }
            // log('digestionQueue 2.2: ' + JSON.stringify(state.digestionQueue));
            state.inHealthyRange = (state.bgl >= 4 && state.bgl <= 8);
            State_1.setState(state);
            that.renderBars();
            that.doEffects();
            // Never allow player to be full!
            if (player.getFoodLevel() >= 20) {
                player.setFoodLevel(19.5);
            }
            // repeat ongoingly!
            tickCount++;
            that.doDigestion(tickCount);
        }, 1000);
    },
    doEffects: function () {
        var state = State_1.getState();
        if ((state.bgl >= 4 && state.bgl <= 8)) {
            this.cancelNegativeEffects();
            // Super powers!
            this.giveSuperPowers();
        }
        else {
            // Cancel super powers...
            this.cancelSuperPowers();
            // Confusion!
            if ((state.bgl < 4 && state.bgl >= 3) || (state.bgl > 8 && state.bgl <= 12)) {
                this._makeEffect('CONFUSION', 3500);
            }
            else if (state.bgl < 3 || state.bgl > 16) {
                this._makeEffect('CONFUSION', 6000);
            }
            // Layer additional effects.
            if (state.bgl < 2 || state.bgl >= 16) {
                this._makeEffect('BLINDNESS', 5000);
                this._makeEffect('POISON', 5000);
            }
        }
    },
    cancelNegativeEffects: function () {
        this._cancelEffect('CONFUSION');
        this._cancelEffect('BLINDNESS');
        this._cancelEffect('POISON');
    },
    giveSuperPowers: function () {
        this._makeEffect('SPEED', 10000000, 'WHITE', 3);
        this._makeEffect('JUMP', 10000000, 'WHITE', 3);
        this._makeEffect('GLOWING', 10000000, 'WHITE');
        this._makeEffect('NIGHT_VISION', 10000000, 'WHITE');
    },
    cancelSuperPowers: function () {
        this._cancelEffect('SPEED');
        this._cancelEffect('JUMP');
        this._cancelEffect('GLOWING');
        this._cancelEffect('NIGHT_VISION');
    },
    _makeEffect: function (type, milliseconds, color, amplifier) {
        if (color === void 0) { color = 'GREEN'; }
        if (amplifier === void 0) { amplifier = 1; }
        var PotionEffectType = magik.type("potion.PotionEffectType");
        if (player['hasPotionEffect'](PotionEffectType[type]) == true) {
            // Skip if effect already active!
            return;
        }
        var PotionEffect = magik.type("potion.PotionEffect");
        var Color = magik.type("Color");
        var duration = milliseconds / 1000 * 40; // 20 tick. 1 tick = 0.05 seconds
        var c = Color[color];
        var l = PotionEffectType[type];
        var effect = new PotionEffect(l, duration, amplifier, true, true, c);
        player.addPotionEffect(effect);
    },
    _cancelEffect: function (type) {
        var PotionEffectType = magik.type("potion.PotionEffectType");
        if (player['hasPotionEffect'](PotionEffectType[type]) == true) {
            player['removePotionEffect'](PotionEffectType[type]);
        }
    },
    setupInventory: function () {
        var items = [
            { type: 'SNOWBALL', amount: 128 },
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
