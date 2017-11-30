"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bar = require("./Bar");
var Utils_1 = require("./Utils");
var State_1 = require("./State");
var Events_1 = require("./Events");
// Read the file, and pass it to your callback
var magik = magikcraft.io;
var log = magik.dixit;
var player = magik.getSender();
var FoodList_1 = require("./FoodList");
var Food = {};
FoodList_1.default.forEach(function (item) { return Food[item.type] = item; });
var initialWalkSpeed = 0.1999460905790329;
var KEY = 'mct1-mutex';
// TODO:
// * Use XP bar for lightning
// * BGL going down due to insulin = get health
// * See in dark when in range
// * high GI go top top of queue, digest faster, effect BGL positively, even if insulin in system
// * low GI, digest slower, BGL still goes down in Insulin in system
var Player = {
    init: function (isUSA) {
        if (isUSA === void 0) { isUSA = false; }
        // if (magik.playerMap.get(KEY) === 'true') {
        // 	return; // player already has MCT1
        // }
        this.destroyBars();
        player['setWalkSpeed'](initialWalkSpeed); // restore walking
        this._init(isUSA);
        player.setFoodLevel(4);
        this.enableT1();
    },
    enableT1: function () {
        var state = State_1.getState();
        state.disabled = false;
        State_1.setState(state);
    },
    disableT1: function () {
        this.cancelNegativeEffects();
        this.cancelSuperPowers();
        this.destroyBars();
        var state = State_1.getState();
        state.disabled = true;
        State_1.setState(state);
        Events_1.default.unregisterAll();
    },
    doCountdown: function (countdown, isUSA, current) {
        var _this = this;
        if (countdown === void 0) { countdown = 10; }
        if (isUSA === void 0) { isUSA = false; }
        if (current === void 0) { current = countdown; }
        // magik.playerMap.put(KEY, 'true'); // set mutex
        // if (magik.playerMap.get(KEY) === 'true') {
        // 	return; // player already has MCT1
        // }
        magik.setTimeout(function () {
            current--;
            var newWalkSpeed = (current / countdown) * initialWalkSpeed;
            player['setWalkSpeed'](newWalkSpeed);
            if (current > 0) {
                if (player.getName() === 'triyuga' || player.getName() === 'sitapati') {
                    log('DEV: ' + current);
                }
                _this.doCountdown(countdown, isUSA, current);
            }
            else {
                _this.lightningStruck(10, isUSA); // !!!!!
            }
        }, 1000);
    },
    lightningStruck: function (distance, isUSA) {
        var _this = this;
        if (distance === void 0) { distance = 10; }
        if (isUSA === void 0) { isUSA = false; }
        magik.setTimeout(function () {
            var loc = player.getLocation();
            var locations = [
                loc.getX() + distance + " " + loc.getY() + " " + (loc.getZ() + distance),
                loc.getX() - distance + " " + loc.getY() + " " + (loc.getZ() + distance),
                loc.getX() + distance + " " + loc.getY() + " " + (loc.getZ() - distance),
                loc.getX() - distance + " " + loc.getY() + " " + (loc.getZ() - distance),
                loc.getX() + distance + " " + loc.getY() + " " + loc.getZ(),
                loc.getX() - distance + " " + loc.getY() + " " + loc.getZ(),
                loc.getX() + " " + loc.getY() + " " + (loc.getZ() + distance),
                loc.getX() + " " + loc.getY() + " " + (loc.getZ() - distance),
            ];
            locations.forEach(function (location) {
                var server = magik.getPlugin().getServer();
                var cmd = "execute " + player.getName() + " ~ ~ ~ summon LIGHTNING_BOLT " + location;
                server.dispatchCommand(server.getConsoleSender(), cmd);
            });
            if (distance > 0) {
                distance--;
                _this.lightningStruck(distance); // !!!!
            }
            else {
                _this.init(isUSA);
                log('warping in 10 secs...');
                magik.setTimeout(function () {
                    log('Welcome to the MCT1 Training Facitiy!');
                    // const server = magik.getPlugin().getServer();
                    // const cmd = `execute ${player.getName()} ~ ~ ~ warp training`;
                    player['performCommand']('warp training');
                }, 10000);
            }
        }, (100));
    },
    graduationFireworks: function (times) {
        var _this = this;
        if (times === void 0) { times = 10; }
        magik.setTimeout(function () {
            var coords = [
                { x: 840, y: 132, z: 1092 },
                { x: 855, y: 132, z: 1056 },
                { x: 881, y: 132, z: 1061 },
                { x: 896, y: 132, z: 1073 },
                { x: 906, y: 132, z: 1093 },
                { x: 895, y: 132, z: 1115 },
                { x: 874, y: 132, z: 1125 },
                { x: 854, y: 132, z: 1118 },
            ];
            coords.forEach(function (coord) {
                var location = coord.x + " " + coord.y + " " + coord.z;
                var server = magik.getPlugin().getServer();
                var cmd = "execute " + player.getName() + " ~ ~ ~ summon minecraft:fireworks_rocket " + location + " {LifeTime:20,FireworksItem:{id:fireworks,Count:1,tag:{Fireworks:{Explosions:[{Type:2,Flicker:1,Trail:0,Colors:[16719647],FadeColors:[9437112]},{Type:0,Flicker:1,Trail:1,Colors:[15335199],FadeColors:[4472319]},{Type:3,Flicker:1,Trail:0,Colors:[5046064],FadeColors:[16764879]},{Type:4,Flicker:0,Trail:1,Colors:[3342591],FadeColors:[16777105]}]}}}}";
                server.dispatchCommand(server.getConsoleSender(), cmd);
            });
            times--;
            if (times > 0) {
                _this.graduationFireworks(times);
            }
        }, (1000));
    },
    _init: function (isUSA) {
        if (isUSA === void 0) { isUSA = false; }
        var state = State_1.getState();
        state.isUSA = isUSA;
        State_1.setState(state);
        // Start digestion if not already started.
        if (!state.digesting) {
            this.doDigestion();
            state.digesting = true;
            State_1.setState(state);
        }
        // Start listening if not already started.
        if (!state.listening) {
            this.enableEventListeners();
            state.listening = true;
            State_1.setState(state);
        }
        this.cancelNegativeEffects();
        this.cancelSuperPowers();
        this.refreshInventory();
        this.renderBars();
    },
    enableEventListeners: function () {
        var _this = this;
        var state = State_1.getState();
        Events_1.default.registerAll();
        // ProjectileHitEvent
        var projectileHitCounter = 0;
        Events_1.default.on('ProjectileHitEvent', function (event) {
            projectileHitCounter++;
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
            // const cmd = `execute ${player.getName()} ~ ~ ~ summon CHICKEN ${location}`;
            var cmd = "execute " + player.getName() + " ~ ~ ~ summon LIGHTNING_BOLT " + location;
            server.dispatchCommand(server.getConsoleSender(), cmd);
            // Food or Health cost...
            if (projectileHitCounter % 5 === 0) {
                if (player.getFoodLevel() > 0) {
                    player.setFoodLevel(Math.max(player.getFoodLevel() - 1, 0));
                }
            }
        });
        // PlayerItemConsumeEvent
        Events_1.default.on('PlayerItemConsumeEvent', function (event) {
            var state = State_1.getState();
            // Identify consumer. Skip if not player.
            var consumer = event.getPlayer();
            if (consumer.getName() != player.getName()) {
                return;
            }
            var coords = [];
            var Material = Java.type("org.bukkit.Material");
            var Location = Java.type('org.bukkit.Location');
            // Act on know FOOD eat...
            var type = event.getItem().getType();
            if (Food[type]) {
                log("You ate a " + type + "!");
                var item = {
                    timestamp: Utils_1.default.makeTimestamp(),
                    food: Food[type],
                    carbsDigested: 0,
                };
                state.digestionQueue.push(item);
                State_1.setState(state);
                _this.renderBars();
                // ########
                if (state.inRegion == 'training-1') {
                    log('Great, now move on to the next training chamber!');
                    coords = [
                        // front door
                        { x: 926, y: 95, z: 1116 },
                        { x: 926, y: 95, z: 1115 },
                        { x: 926, y: 95, z: 1114 },
                        { x: 926, y: 96, z: 1116 },
                        { x: 926, y: 96, z: 1115 },
                        { x: 926, y: 96, z: 1114 },
                        { x: 926, y: 97, z: 1116 },
                        { x: 926, y: 97, z: 1115 },
                        { x: 926, y: 97, z: 1114 },
                    ];
                    coords.forEach(function (coord) {
                        var loc = new Location(player.getWorld(), coord.x, coord.y, coord.z);
                        loc.getBlock().setType(Material.AIR);
                    });
                }
                // ########
            }
            else if (type == 'POTION') {
                log("You drank an INSULIN POTION!");
                state.insulin += 2;
                State_1.setState(state);
                _this.renderBars();
                // ########
                if (state.inRegion == 'training-2') {
                    log('Great, now move on to the next training chamber!');
                    coords = [
                        // forward door
                        { x: 940, y: 94, z: 1116 },
                        { x: 940, y: 94, z: 1117 },
                        { x: 940, y: 94, z: 1118 },
                        { x: 940, y: 95, z: 1116 },
                        { x: 940, y: 95, z: 1117 },
                        { x: 940, y: 95, z: 1118 },
                        { x: 940, y: 96, z: 1116 },
                        { x: 940, y: 96, z: 1117 },
                        { x: 940, y: 96, z: 1118 },
                    ];
                    coords.forEach(function (coord) {
                        var loc = new Location(player.getWorld(), coord.x, coord.y, coord.z);
                        loc.getBlock().setType(Material.AIR);
                    });
                }
                // ########
            }
        });
        // PlayerDeathEvent
        Events_1.default.on('PlayerDeathEvent', function (event) {
            // Skip if not this player.
            log('PlayerDeathEvent');
            if (event.getEntity().getName() != player.getName()) {
                return;
            }
            var server = magik.getPlugin().getServer();
            var cmd = "execute " + player.getName() + " ~ ~ ~ spawnpoint " + player.getName();
            server.dispatchCommand(server.getConsoleSender(), cmd);
            var state = State_1.getState();
            state.dead = true;
            State_1.setState(state);
        });
        // PlayerRespawnEvent
        Events_1.default.on('PlayerRespawnEvent', function (event) {
            // Skip if not this player.
            if (event.getPlayer().getName() != player.getName()) {
                return;
            }
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
            var cause = event.getCause();
            if (entityType == 'PLAYER') {
                // Skip if not this player.
                if (event.getEntity().getName() != player.getName()) {
                    return;
                }
                // LIGHTNING, FIRE, FIRE_TICK
                if (cause == 'LIGHTNING' || cause == 'FIRE' || cause == 'FIRE_TICK') {
                    // magik.dixit('set LIGHTNING damage to 0 for ' + event.getEntity().getName());
                    event.setDamage(0);
                    event.setCancelled(true);
                }
                // STARVATION
                if (cause == 'STARVATION') {
                    magik.dixit('You are starving! Eat food now!');
                }
                // FALL, ENTITY_ATTACK
            }
            if (entityType == 'WITHER' && cause == 'PROJECTILE') {
                event.setDamage(10);
            }
        });
        // PlayerQuitEvent
        Events_1.default.on('PlayerQuitEvent', function (event) {
            // Skip if not this player.
            if (event.getPlayer().getName() != player.getName()) {
                return;
            }
            player.setFoodLevel(15);
            player['setHealth'](20);
            _this.cancelNegativeEffects();
            _this.cancelSuperPowers();
            State_1.setState({});
            Events_1.default.unregisterAll();
        });
        // RegionEnterEvent
        Events_1.default.on('RegionEnterEvent', function (event) {
            if (event.getPlayer().getName() != player.getName()) {
                return;
            }
            var regionName = event.getRegion().getId();
            var world = event.getPlayer().getWorld();
            var state = State_1.getState();
            state.inRegion = regionName;
            State_1.setState(state);
            var coords = [];
            var Material = Java.type("org.bukkit.Material");
            var Location = Java.type('org.bukkit.Location');
            switch (regionName) {
                case 'training-1':
                    // Set food and BGL
                    state.bgl = 6;
                    State_1.setState(state);
                    player.setFoodLevel(1);
                    coords = [
                        // front door
                        { x: 926, y: 95, z: 1116 },
                        { x: 926, y: 95, z: 1115 },
                        { x: 926, y: 95, z: 1114 },
                        { x: 926, y: 96, z: 1116 },
                        { x: 926, y: 96, z: 1115 },
                        { x: 926, y: 96, z: 1114 },
                        { x: 926, y: 97, z: 1116 },
                        { x: 926, y: 97, z: 1115 },
                        { x: 926, y: 97, z: 1114 },
                        // behind door
                        { x: 910, y: 95, z: 1113 },
                        { x: 910, y: 95, z: 1114 },
                        { x: 910, y: 95, z: 1115 },
                        { x: 910, y: 96, z: 1113 },
                        { x: 910, y: 96, z: 1114 },
                        { x: 910, y: 96, z: 1115 },
                        { x: 910, y: 97, z: 1113 },
                        { x: 910, y: 97, z: 1114 },
                        { x: 910, y: 97, z: 1115 },
                    ];
                    coords.forEach(function (coord) {
                        var loc = new Location(player.getWorld(), coord.x, coord.y, coord.z);
                        loc.getBlock().setType(Material.GLASS);
                    });
                    break;
                case 'training-2':
                    // Set Insulin
                    // state.insulin = 4;
                    // setState(state);
                    coords = [
                        // forward door
                        { x: 940, y: 94, z: 1116 },
                        { x: 940, y: 94, z: 1117 },
                        { x: 940, y: 94, z: 1118 },
                        { x: 940, y: 95, z: 1116 },
                        { x: 940, y: 95, z: 1117 },
                        { x: 940, y: 95, z: 1118 },
                        { x: 940, y: 96, z: 1116 },
                        { x: 940, y: 96, z: 1117 },
                        { x: 940, y: 96, z: 1118 },
                        // behind door
                        { x: 926, y: 95, z: 1116 },
                        { x: 926, y: 95, z: 1115 },
                        { x: 926, y: 95, z: 1114 },
                        { x: 926, y: 96, z: 1116 },
                        { x: 926, y: 96, z: 1115 },
                        { x: 926, y: 96, z: 1114 },
                        { x: 926, y: 97, z: 1116 },
                        { x: 926, y: 97, z: 1115 },
                        { x: 926, y: 97, z: 1114 },
                    ];
                    coords.forEach(function (coord) {
                        var loc = new Location(player.getWorld(), coord.x, coord.y, coord.z);
                        loc.getBlock().setType(Material.GLASS);
                    });
                    break;
                case 'tower-top':
                    // fireworks coords.
                    _this.graduationFireworks();
                    break;
            }
        });
        // RegionLeaveEvent
        Events_1.default.on('RegionLeaveEvent', function (event) {
            if (event.getPlayer().getName() != player.getName()) {
                return;
            }
            var coords = [];
            var Material = Java.type("org.bukkit.Material");
            var Location = Java.type('org.bukkit.Location');
            var regionName = event.getRegion().getId();
            var world = event.getPlayer().getWorld();
            var state = State_1.getState();
            state.inRegion = null;
            State_1.setState(state);
            switch (regionName) {
                case 'training-1':
                    coords = [
                        // front door
                        { x: 926, y: 95, z: 1116 },
                        { x: 926, y: 95, z: 1115 },
                        { x: 926, y: 95, z: 1114 },
                        { x: 926, y: 96, z: 1116 },
                        { x: 926, y: 96, z: 1115 },
                        { x: 926, y: 96, z: 1114 },
                        { x: 926, y: 97, z: 1116 },
                        { x: 926, y: 97, z: 1115 },
                        { x: 926, y: 97, z: 1114 },
                        // behind door
                        { x: 910, y: 95, z: 1113 },
                        { x: 910, y: 95, z: 1114 },
                        { x: 910, y: 95, z: 1115 },
                        { x: 910, y: 96, z: 1113 },
                        { x: 910, y: 96, z: 1114 },
                        { x: 910, y: 96, z: 1115 },
                        { x: 910, y: 97, z: 1113 },
                        { x: 910, y: 97, z: 1114 },
                        { x: 910, y: 97, z: 1115 },
                    ];
                    coords.forEach(function (coord) {
                        var loc = new Location(player.getWorld(), coord.x, coord.y, coord.z);
                        loc.getBlock().setType(Material.AIR);
                    });
                    break;
                case 'training-2':
                    coords = [
                        // forward door
                        { x: 940, y: 94, z: 1116 },
                        { x: 940, y: 94, z: 1117 },
                        { x: 940, y: 94, z: 1118 },
                        { x: 940, y: 95, z: 1116 },
                        { x: 940, y: 95, z: 1117 },
                        { x: 940, y: 95, z: 1118 },
                        { x: 940, y: 96, z: 1116 },
                        { x: 940, y: 96, z: 1117 },
                        { x: 940, y: 96, z: 1118 },
                        // behind door
                        { x: 926, y: 95, z: 1116 },
                        { x: 926, y: 95, z: 1115 },
                        { x: 926, y: 95, z: 1114 },
                        { x: 926, y: 96, z: 1116 },
                        { x: 926, y: 96, z: 1115 },
                        { x: 926, y: 96, z: 1114 },
                        { x: 926, y: 97, z: 1116 },
                        { x: 926, y: 97, z: 1115 },
                        { x: 926, y: 97, z: 1114 },
                    ];
                    coords.forEach(function (coord) {
                        var loc = new Location(player.getWorld(), coord.x, coord.y, coord.z);
                        loc.getBlock().setType(Material.AIR);
                    });
                    break;
            }
        });
        Events_1.default.on('PlayerCommandPreprocessEvent', function (event) {
            // log('event.getMessage(): ' + event.getMessage());
            // event.setCancelled(true);
        });
        // Events.on('ServerCommandEvent', (event) => {
        // 	log('event.getCommand(): ' + event.getCommand());
        // 	log('event.getSender(): ' + event.getSender());
        // });
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
        var bgl = Math.round(state.bgl * 10) / 10;
        if (state.isUSA)
            bgl = Math.round(bgl * 18);
        state.bglBar = Bar.bar()
            .text("BGL: " + bgl) // round to 1 decimal
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
            // const food = Food[item.type];
            var percentDigested = (item.carbsDigested / item.food.carbs) * 100;
            state["digestionBar" + i] = Bar.bar()
                .text("Digesting: " + item.food.type + " (" + item.food.carbs + " carbs) (" + item.food.GI + " GI)")
                .color((item.food.GI === 'high') ? Bar.color.PINK : Bar.color.PURPLE)
                .style(Bar.style.NOTCHED_20)
                .progress(100 - percentDigested)
                .show();
        });
        // SetState
        State_1.setState(state);
    },
    doDigestion: function (tickCount) {
        if (tickCount === void 0) { tickCount = 0; }
        var state = State_1.getState();
        if (state.disabled) {
            return;
        }
        var that = this;
        magik.setTimeout(function () {
            // Skip if dead!
            if (state.dead) {
                // log('skip digestion coz dead!');
                that.doDigestion(tickCount);
                return;
            }
            // Every 10 ticks...
            if (tickCount % 10 === 0) {
                // Refresh Inventory
                that.refreshInventory();
                // bgl rises slowly, even if not digesting...
                state.bgl += 0.1;
                // If player has food in digestionQueue, up foodlevel
                if (state.digestionQueue && state.digestionQueue.length > 0) {
                    player.setFoodLevel(Math.max((player.getFoodLevel() + 1), 0));
                }
                else {
                    player.setFoodLevel(Math.max((player.getFoodLevel() - 1), 0));
                }
            }
            // handle insulin in system
            if (state.insulin > 0) {
                state.insulin -= 0.1;
                state.bgl -= 0.15;
            }
            // handle digestionQueue
            if (state.digestionQueue[0]) {
                if (state.digestionQueue[0].food.GI === 'high') {
                    // high GI, digest faster...
                    state.digestionQueue[0].carbsDigested += 1;
                    state.bgl += 0.2;
                }
                else {
                    // low GI, digest slower...
                    state.digestionQueue[0].carbsDigested += 0.5;
                    state.bgl += 0.1;
                }
                if (state.insulin > 0) {
                    if (player['getHealth']() < 20) {
                        player['setHealth'](Math.min((player['getHealth']() + 0.5), 20));
                    }
                }
                if (state.digestionQueue[0].carbsDigested >= state.digestionQueue[0].food.carbs) {
                    // finished digesting... remove from queue...
                    state.digestionQueue.splice(0, 1);
                }
            }
            // bgl should never go below 2!
            if (state.bgl < 2) {
                state.bgl = 2;
            }
            // bgl should never go above 20!
            if (state.bgl > 20) {
                state.bgl = 20;
            }
            State_1.setState(state);
            that.renderBars();
            that.doEffects();
            // Never allow player to be full!
            if (player.getFoodLevel() >= 20) {
                player.setFoodLevel(19.5);
            }
            // Spawn Items...
            if (tickCount % 5 === 0) {
                if (tickCount % 50 === 0) {
                    // Cleanup dropped items.
                    var server = magik.getPlugin().getServer();
                    var cmd = "execute " + player.getName() + " ~ ~ ~ minecraft:kill @e[type=Item,r=50]";
                    server.dispatchCommand(server.getConsoleSender(), cmd);
                }
                var worldName = player.getWorld()['getName']();
                if (worldName == 'mct1-main') {
                    var Material = Java.type("org.bukkit.Material");
                    var ItemStack = Java.type("org.bukkit.inventory.ItemStack");
                    var Location = Java.type('org.bukkit.Location');
                    var loc = void 0;
                    // Spawn Apples!
                    loc = new Location(player.getWorld(), 920, 97, 1115);
                    player.getWorld()['dropItem'](loc, new ItemStack(Material.APPLE, 1));
                    // Spawn Potions!
                    loc = new Location(player.getWorld(), 933, 96, 1117);
                    player.getWorld()['dropItem'](loc, new ItemStack(Material.POTION, 1));
                }
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
            if (state.bgl <= 2 || state.bgl >= 16) {
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
        this._makeEffect('SPEED', 10000000, 'WHITE', 2);
        this._makeEffect('JUMP', 10000000, 'WHITE', 2);
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
    clearInventory: function () {
        player.getInventory()['clear']();
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
        var InventoryList = [
            {
                "type": "SNOWBALL",
                "quantity": 64,
                "refresh": true,
                "slot": 0
            },
            {
                "type": "APPLE",
                "quantity": 64,
                "refresh": true,
                "slot": 1
            },
            {
                "type": "BREAD",
                "quantity": 64,
                "refresh": true,
                "slot": 2
            },
            {
                "type": "COOKED_FISH",
                "quantity": 64,
                "refresh": true,
                "slot": 3
            },
            {
                "type": "COOKIE",
                "quantity": 64,
                "refresh": true,
                "slot": 4
            },
            {
                "type": "POTION",
                "quantity": 64,
                "refresh": true,
                "slot": 5
            },
        ];
        var server = magik.getPlugin().getServer();
        InventoryList.map(function (item) {
            var slot = (item.slot <= 8) ? "slot.hotbar." + item.slot : "slot.inventory." + (item.slot - 8);
            var cmd = "replaceitem entity " + player.getName() + " " + slot + " " + item.type + " " + item.quantity;
            server.dispatchCommand(server.getConsoleSender(), cmd);
        });
    },
};
exports.default = Player;
