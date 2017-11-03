"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bar = require("./Bar");
var Utils_1 = require("./Utils");
var State_1 = require("./State");
// import * as fs from 'fs-extra'; 
var Events_1 = require("./events/Events");
// Read the file, and pass it to your callback
var magik = magikcraft.io;
var log = magik.dixit;
var player = magik.getSender();
var state = State_1.getState();
var InventoryList_1 = require("./InventoryList");
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
        this.clearInventory();
        // this.refreshInventory();
        this.setupInventory();
        this.setFood(2);
        this.doDigestion();
        this.renderBars();
        // Super Powers!
        this.superSpeed();
        this.superJump();
        this.superGlow();
        this.superNightVision();
        if (!state.listening) {
            log('listening');
            this.enableEventListeners();
            state.listening = true;
            State_1.setState(state);
        }
    },
    enableEventListeners: function () {
        magik.Events.on('ProjectileHit', this.onProjectileHit);
        magik.Events.on('PlayerItemConsumeEvent', this.onConsume);
        Events_1.default.registerAll();
        Events_1.default.on('EntityDamageByEntityEvent', function (event) { return log('EntityDamageByEntityEvent: ' + event.getCause()); });
        // Events.on('ProjectileHit', this.onProjectileHit);
        // Events.on('PlayerItemConsumeEvent', this.onConsume);
        // const cmd = `cast EntityDamageEvent`;
        // player['performCommand'](cmd);
        // magik.Events.on('CreatureSpawn', (event) => log('CreatureSpawn'));
        // magik.Events.on('EntityDeath', (event) => log('EntityDeath'));
    },
    disableEventListeners: function () {
        magik.Events.off('ProjectileHit', this.onProjectileHit);
        magik.Events.off('PlayerItemConsumeEvent', this.onConsume);
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
        log('onConsume!');
        var consumer = event.getPlayer();
        if (consumer.getName() !== player.getName()) {
            return;
        }
        var type = event.getItem().getType();
        if (Food[type]) {
            if (type == 'APPLE') {
                log('running disableEventListeners!');
                this.disableEventListeners();
                log('ran disableEventListeners!');
                return;
            }
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
        // else {
        // 	player['setHealth'](player['getHealth']() - 1);
        // }
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
    superNightVision: function () {
        this._makeEffect('NIGHT_VISION', 10000000, 'WHITE');
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
        // const MATERIAL = Java.type("org.bukkit.Material");
        // const ItemStack = Java.type("org.bukkit.inventory.ItemStack");
        var server = magik.getPlugin().getServer();
        // event.getPlayer().getInventory().setItem(37, new ItemStack(Material.CHEESE, 1));
        // const thing = new ItemStack(MATERIAL[item]);
        // canon.sender.getInventory().addItem(thing);
        InventoryList_1.default.map(function (item) {
            // const stack = new ItemStack(MATERIAL[item.type], item.quantity);
            // player.getInventory()['setItem'](item.slot, stack);
            var slot = (item.slot <= 8) ? "slot.hotbar." + item.slot : "slot.inventory." + (item.slot - 1);
            var cmd = "replaceitem entity " + player.getName() + " " + slot + " " + item.type + " " + item.quantity;
            magik.dixit(cmd);
            server.dispatchCommand(server.getConsoleSender(), cmd);
            // magik.dixit(`server.dispatchCommand(give ${player.getName()} ${item.type} ${item.amount})`);
        });
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
// const actionType = event.getAction().getType();
// const handType = event.getHand().getType(); // EquipmentSlot
// const itemType = event.getItem().getType(); // ItemStack
// const materialType = event.getMaterial().getType(); // Material
// const hasItem = event.hasItem(); // Check if this event involved an item
// magik.dixit('actionType: ' + actionType);
// magik.dixit('handType: ' + handType);
// magik.dixit('itemType: ' + itemType);
// magik.dixit('materialType: ' + materialType);
// magik.dixit('hasItem: ' + hasItem);
// // getBlockFace(); // BlockFace
// // getClickedBlock().getType();
// // getHandlerList(); // HandlerList
// // getHandlers(); // HandlerList
// // hasBlock() // Check if this event involved a block
// // isBlockInHand() // boolean whether this was a block placement event
// // isCancelled() // boolean
// // setCancelled(boolean cancel) // 
// // setUseInteractedBlock(Event.Result useInteractedBlock) 
// // setUseItemInHand(Event.Result useItemInHand) 
// // useInteractedBlock() // Event.Result This controls the action to take with the block (if any) that was clicked on.
// // useItemInHand() // Event.Result	 
