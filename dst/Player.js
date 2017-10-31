"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bar = require("./Bar");
var Utils_1 = require("./Utils");
var State_1 = require("./State");
// Read the file, and pass it to your callback
var magik = magikcraft.io;
var log = magik.dixit;
var player = magik.getSender();
var state = State_1.getState();
// declare function require(name:string);
// declare const require: any;
// const foodList = fs.readFileSync('./men.json, handleJSONFile);
// const foodList = JSON.parse(fs.readFileSync('./food.json', 'utf8'));
var foodList = [
    {
        "type": "COOKED_CHICKEN",
        "carbs": 10,
        "GI": "high"
    },
    {
        "type": "COOKED_FISH",
        "carbs": 11,
        "GI": "low"
    },
    {
        "type": "BREAD",
        "carbs": 14,
        "GI": "high"
    },
    {
        "type": "COOKIE",
        "carbs": 30,
        "GI": "high"
    },
    {
        "type": "APPLE",
        "carbs": 10,
        "GI": "low"
    },
    {
        "type": "BAKED_POTATO",
        "carbs": 25,
        "GI": "high"
    },
    {
        "type": "PUMPKIN_PIE",
        "carbs": 31,
        "GI": "high"
    },
    {
        "type": "MUSHROOM_STEW",
        "carbs": 14,
        "GI": "low"
    },
    {
        "type": "BEETROOT",
        "carbs": 31,
        "GI": "high"
    }
];
var Food = {};
foodList.forEach(function (item) { return Food[item.type] = item; });
// const inventoryList = JSON.parse(fs.readFileSync('./inventory.json', 'utf8'));
// const inventoryList = require('./inventory.json');
var inventoryList = [
    {
        "type": "COOKED_CHICKEN",
        "quantity": 64,
        "refresh": true,
        "slot": 15
    },
    {
        "type": "COOKED_FISH",
        "quantity": 64,
        "refresh": true,
        "slot": 16
    },
    {
        "type": "BREAD",
        "quantity": 64,
        "refresh": true,
        "slot": 17
    },
    {
        "type": "COOKIE",
        "quantity": 64,
        "refresh": true,
        "slot": 24
    },
    {
        "type": "APPLE",
        "quantity": 64,
        "refresh": true,
        "slot": 25
    },
    {
        "type": "BAKED_POTATO",
        "quantity": 64,
        "refresh": true,
        "slot": 26
    },
    {
        "type": "PUMPKIN_PIE",
        "quantity": 64,
        "refresh": true,
        "slot": 33
    },
    {
        "type": "MUSHROOM_STEW",
        "quantity": 64,
        "refresh": true,
        "slot": 34
    },
    {
        "type": "BEETROOT",
        "quantity": 64,
        "refresh": true,
        "slot": 35
    }
];
// TODO:
// * Use XP bar for lightning
var Player = {
    init: function () {
        this.clearInventory();
        // this.refreshInventory();
        this.setFood(2);
        this.doDigestion();
        this.renderBars();
        // Super Powers!
        this.superSpeed();
        this.superJump();
        this.superGlow();
        magik.Events.on('ProjectileHit', this.onProjectileHit);
        // Handle eatFood and takeInsulin events.
        magik.Events.on('PlayerItemConsumeEvent', this.onConsume);
        // magik.Events.on('FoodLevelChange', this.onFoodLevelChange);
        // magik.Events.on('BlockBreak', (event) => log('BlockBreak'));
        // magik.Events.on('BlockBurn', (event) => log('BlockBurn'));
        // magik.Events.on('BlockCanBuild', (event) => log('BlockCanBuild'));
        // magik.Events.on('BlockDamage', (event) => log('BlockDamage'));
        // magik.Events.on('BlockPlace', (event) => log('BlockPlace'));
        // magik.Events.on('CreatureSpawn', (event) => log('CreatureSpawn'));
        // magik.Events.on('EntityDeath', (event) => log('EntityDeath'));
        // magik.Events.on('EntityRegainHealth', (event) => log('EntityRegainHealth'));
        // magik.Events.on('FoodLevelChange', (event) => log('FoodLevelChange'));
        // magik.Events.on('PlayerItemConsumeEvent', (event) => log('PlayerItemConsumeEvent'));
        // magik.Events.on('PlayerJoin', (event) => log('PlayerJoin'));
        // magik.Events.on('PlayerMove', (event) => log('PlayerMove'));
        // magik.Events.on('PlayerQuit', (event) => log('PlayerQuit'));
        // magik.Events.on('PlayerTeleport', (event) => log('PlayerTeleport'));
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
            var food = Food[item.type];
            state["digestionBar" + i] = Bar.bar()
                .text("Digesting: " + food.type + " (" + food.carbs + " carbs)")
                .color((food.GI === 'high') ? Bar.color.PURPLE : Bar.color.PINK)
                .style(Bar.style.NOTCHED_20)
                .progress(100 - item.percentDigested)
                .show();
        });
        // SetState
        State_1.setState(state);
    },
    doDigestion: function (tickCount) {
        if (tickCount === void 0) { tickCount = 0; }
        // log('digesting...');
        var that = this;
        magik.setTimeout(function () {
            var updated = false;
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
                updated = true;
            }
            // handle digestionQueue
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
                updated = true;
            }
            // update if changes...
            if (updated) {
                State_1.setState(state);
                that.renderBars();
                that.doEffects();
            }
            // Never allow player to be full!
            if (player.getFoodLevel() >= 20) {
                player.setFoodLevel(19.5);
            }
            // repeat ongoingly!
            tickCount++;
            that.doDigestion(tickCount);
        }, 1000);
    },
    onConsume: function (event) {
        var consumer = event.getPlayer();
        if (consumer.getName() !== player.getName()) {
            return;
        }
        var type = event.getItem().getType();
        if (Food[type]) {
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
    onProjectileHit: function (event) {
        // Identify shooter.
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
        if (!loc)
            return;
        var location = loc.getX() + " " + loc.getY() + " " + loc.getZ();
        var server = magik.getPlugin().getServer();
        var cmd = "execute " + player.getName() + " ~ ~ ~ summon lightning_bolt " + location;
        server.dispatchCommand(server.getConsoleSender(), cmd);
        // Food or Health cost...
        if (player.getFoodLevel() > 0) {
            player.setFoodLevel(Math.max(player.getFoodLevel() - 1, 0));
        }
        else {
            player['setHealth'](player['getHealth']() - 1);
        }
    },
    onInteract: function (event) {
        // Do stuff.
    },
    doEffects: function () {
        // Confusion!
        if ((state.bgl < 4 && state.bgl >= 2) || (state.bgl >= 8 && state.bgl <= 10)) {
            this.doConfusion(2500);
        }
        else if (state.bgl < 2 || state.bgl > 10) {
            this.doConfusion(5000);
        }
        // Layer additional effects.
        if (state.bgl < 0 || state.bgl > 12) {
            this.doBlindness(5000);
            this.doPoison(5000);
        }
    },
    doConfusion: function (milliseconds) {
        if (!state.confusionEffect) {
            this._makeEffect('CONFUSION', milliseconds);
            state.confusionEffect = true;
            State_1.setState(state);
            magik.setTimeout(function () {
                state.confusionEffect = false;
                State_1.setState(state);
            }, milliseconds);
        }
    },
    doBlindness: function (milliseconds) {
        if (!state.blindnessEffect) {
            this._makeEffect('BLINDNESS', milliseconds);
            state.blindnessEffect = true;
            State_1.setState(state);
            magik.setTimeout(function () {
                state.blindnessEffect = false;
                State_1.setState(state);
            }, milliseconds);
        }
    },
    doPoison: function (milliseconds) {
        if (!state.poisonEffect) {
            this._makeEffect('POISON', milliseconds);
            state.poisonEffect = true;
            State_1.setState(state);
            magik.setTimeout(function () {
                state.poisonEffect = false;
                State_1.setState(state);
            }, milliseconds);
        }
    },
    superSpeed: function () {
        this._makeEffect('SPEED', 10000000, 'WHITE', 3);
    },
    superJump: function () {
        this._makeEffect('JUMP', 10000000, 'WHITE', 3);
    },
    superGlow: function () {
        this._makeEffect('GLOWING', 10000000, 'WHITE');
    },
    _makeEffect: function (type, milliseconds, color, amplifier) {
        if (color === void 0) { color = 'GREEN'; }
        if (amplifier === void 0) { amplifier = 1; }
        var PotionEffect = magik.type("potion.PotionEffect");
        var PotionEffectType = magik.type("potion.PotionEffectType");
        var Color = magik.type("Color");
        var duration = milliseconds / 1000 * 40; // 20 tick. 1 tick = 0.05 seconds
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
    refreshInventory: function () {
        var MATERIAL = Java.type("org.bukkit.Material");
        var ItemStack = Java.type("org.bukkit.inventory.ItemStack");
        var server = magik.getPlugin().getServer();
        // event.getPlayer().getInventory().setItem(37, new ItemStack(Material.CHEESE, 1));
        // const thing = new ItemStack(MATERIAL[item]);
        // canon.sender.getInventory().addItem(thing);
        inventoryList.map(function (item) {
            var stack = new ItemStack(MATERIAL[item.type], item.quantity);
            player.getInventory()['setItem'](item.slot, stack);
            // server.dispatchCommand(server.getConsoleSender(), `give ${player.getName()} ${item.type} ${item.amount}`);
            // magik.dixit(`server.dispatchCommand(give ${player.getName()} ${item.type} ${item.amount})`);
        });
    },
    clearInventory: function () {
        player.getInventory()['clear']();
    },
};
exports.default = Player;
