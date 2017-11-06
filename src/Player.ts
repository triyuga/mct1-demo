import * as Bar from './Bar';
import Utils from './Utils';
import { getState, setState } from './State';
import Events from './Events';

// Read the file, and pass it to your callback

const magik = magikcraft.io;
const log = magik.dixit;

const player = magik.getSender();

import InventoryList from './InventoryList';
import FoodList from './FoodList';
const Food:any = {};
FoodList.forEach(item => Food[item.type] = item);

// TODO:
// * Use XP bar for lightning
// * BGL going down due to insulin = get health
// * See in dark when in range
// * All super powers only when in range
// * don't allow them to below 2, or above 20 (blind at 15)
// * high GI go top top of queue, digest faster, effect BGL positively, even if insulin in system
// * low GI, digest slower, BGL still goes down in Insulin in system

const Player = {
	init() {
		this.destroyBars();
		this._init();
		player.setFoodLevel(2);
	},

	doCountdown(countdown = 10) {
		magik.setTimeout(() => {
			countdown--;
			if (countdown > 0) {
				log('' + countdown);
				this.doCountdown(countdown);
			}
			else {
				this.lightningStruck(); // !!!!!
			}
		}, 1000);
	},

	lightningStruck(distance = 5) {
		magik.setTimeout(() => {
			const loc = player.getLocation();
			const locations = [
				`${loc.getX()+distance} ${loc.getY()+distance} ${loc.getZ()}`,
				`${loc.getX()-distance} ${loc.getY()+distance} ${loc.getZ()}`,
				`${loc.getX()+distance} ${loc.getY()-distance} ${loc.getZ()}`,
				`${loc.getX()-distance} ${loc.getY()-distance} ${loc.getZ()}`,
			];
			locations.forEach(location => {
				const server = magik.getPlugin().getServer();
				const cmd = `execute ${player.getName()} ~ ~ ~ summon LIGHTNING_BOLT ${location}`;
				server.dispatchCommand(server.getConsoleSender(), cmd);
			});
			if (distance > 0) {
				distance--;
				this.lightningStruck() // !!!!
			}
			else {
				this.init();
			}
		}, (distance*500));
	},

	_init() {
		let state = getState();
		// Start digestion if not already started.
		if (!state.digesting) {
			this.doDigestion();
			state.digesting = true;
			setState(state);
			// log('digesting!');
		}

		// Start listening if not already started.
		if (!state.listening) {
			// log('listening!');
			this.enableEventListeners();
			state.listening = true;
			setState(state);
		}

		this.cancelNegativeEffects();
		this.cancelSuperPowers();
		this.clearInventory();
		this.setupInventory();
		this.renderBars();
	},

	enableEventListeners() {
		let state = getState();
		Events.registerAll();
		
		// ProjectileHitEvent
		let projectileHitCounter = 0;
		Events.on('ProjectileHitEvent', (event) => { 
			projectileHitCounter++;
			
			let state = getState();	
			// Identify shooter. Skip if not player.
			const shooter = event.getEntity().getShooter();
			if (!shooter || shooter.getName() !== player.getName()) {
				return;
			}
			// Get loc
			let loc:any = null;
			if (event.getHitEntity()) {
				loc = event.getHitEntity().getLocation();
			} else if (event.getHitBlock()) {
				loc = event.getHitBlock().getLocation();
			}
			// Skip if could not find loc.
			if (!loc) return;
			// Summon lightning_bolt at location.
			const location = `${loc.getX()} ${loc.getY()+1} ${loc.getZ()}`;
			const server = magik.getPlugin().getServer();
			// const cmd = `execute ${player.getName()} ~ ~ ~ summon CHICKEN ${location}`;
			const cmd = `execute ${player.getName()} ~ ~ ~ summon LIGHTNING_BOLT ${location}`;
			server.dispatchCommand(server.getConsoleSender(), cmd);

			// Food or Health cost...
			if (projectileHitCounter % 5 === 0) { // Every 3 hits...
				if (player.getFoodLevel() > 0) {
					player.setFoodLevel(Math.max(player.getFoodLevel()-1, 0));
				}
			}
		});

		// PlayerItemConsumeEvent
		Events.on('PlayerItemConsumeEvent', (event) => { 
			let state = getState();
			// Identify consumer. Skip if not player.
			const consumer = event.getPlayer();
			if (consumer.getName() != player.getName()) {
				return;
			}
			// Act on know FOOD eat...
			const type = event.getItem().getType();
			if (Food[type]) {
				log(`You ate a ${type}!`);
				const item = {
					timestamp: Utils.makeTimestamp(),
					type: Food[type].type,
					percentDigested: 0,
				};
				state.digestionQueue.push(item);
				setState(state);
				this.renderBars();
			}
			// Act on POTION drink... (insulin)
			else if (type == 'POTION') { // important! use double arrow (not triple)
				log(`You drank an INSULIN POTION!`);
				state.insulin += 2;
				setState(state);
				this.renderBars();
			}
		});

		// PlayerDeathEvent
		Events.on('PlayerDeathEvent', (event) => {
			// Skip if not this player.
			if (event.getPlayer().getName() != player.getName()) {
				return;
			}
			// log('PlayerDeathEvent: ' + event.getDeathMessage());
			let state = getState();
			state.dead = true;
			setState(state);
		});

		// PlayerRespawnEvent
		Events.on('PlayerRespawnEvent', (event) => {
			// Skip if not this player.
			if (event.getPlayer().getName() != player.getName()) {
				return;
			}
			log('PlayerRespawnEvent: ' + event.getRespawnLocation())
			let state = getState();
			state.dead = false;
			setState(state);
			
			// Re-init
			this._init();
		});

		// EntityDamageEvent
		Events.on('EntityDamageEvent', (event) => {
			// Cancel lightning and fire damage for player.
			const entityType = event.getEntityType();
			if (entityType == 'PLAYER') {
				// Skip if not this player.
				if (event.getEntity().getName() != player.getName()) {
					return;
				}
				const cause = event.getCause(); // LIGHTNING STARVATION FIRE FALL ENTITY_ATTACK
				if (cause == 'LIGHTNING' || cause == 'FIRE' || cause == 'FIRE_TICK') {
					// magik.dixit('set LIGHTNING damage to 0 for ' + event.getEntity().getName());
					event.setDamage(0);
					event.setCancelled(true);
				}
			}
		});
		
		// PlayerQuitEvent
		Events.on('PlayerQuitEvent', (event) => {
			// Skip if not this player.
			if (event.getPlayer().getName() != player.getName()) {
				return;
			}		
			player.setFoodLevel(15);
			player['setHealth'](20);
			this.cancelNegativeEffects();
			this.cancelSuperPowers();
			setState({})
			Events.unregisterAll();
		});
	},

	destroyBars() {
		let state = getState();
		if (state.bglBar) state.bglBar.destroy();
		if (state.insulinBar) state.insulinBar.destroy();
		if (state.digestionBar0) state.digestionBar0.destroy();
		if (state.digestionBar1) state.digestionBar1.destroy();
		state.bglBar = null;
		state.insulinBar = null;
		state.digestionBar0 = null;
		state.digestionBar1 = null;
		setState(state);
	},

	renderBars() {
		// First, clear all bars.... 
		this.destroyBars();

		let state = getState();
		// Minecraft supports upto 4 bars onscreen at once.

		// bglBar color
		let color  = 'GREEN';
		if (state.bgl >= 4 && state.bgl <= 8) {
			color = 'GREEN';
		} else if ((state.bgl < 4 && state.bgl >= 2) || (state.bgl > 8 && state.bgl <= 12)) {
			color = 'YELLOW';
		} else {
			color = 'RED';
		}
		// bglBar
		state.bglBar = Bar.bar()
			.text(`BGL: ${Math.round(state.bgl*10)/10}`) // round to 1 decimal
			.color(Bar.color[color])
			.style(Bar.style.NOTCHED_20)
			.progress((state.bgl/20)*100)
			.show();

		// insulinBar
		state.insulinBar = Bar.bar()
			.text(`Insulin: ${Math.round(state.insulin*10)/10}`) // round to 1 decimal
			.color(Bar.color.BLUE)
			.style(Bar.style.NOTCHED_20)
			.progress((state.insulin/20)*100) // insulin as percentage, rounded to 1 decimal
			.show();

		// digestionBar(s)
		state.digestionQueue.slice(0, 2).map((item, i) => {
			const food = Food[item.type];
			state[`digestionBar${i}`] = Bar.bar()
				.text(`Digesting: ${food.type} (${food.carbs} carbs)`)
				.color((food.GI === 'high') ? Bar.color.PURPLE : Bar.color.PINK)
				.style(Bar.style.NOTCHED_20)
				.progress(100 - item.percentDigested)
				.show();
		});

		// SetState
		setState(state);
	},

	doDigestion(tickCount = 0) {
		let state = getState();
		const that = this;
		magik.setTimeout(function() {
			// Skip if dead!
			if (state.dead) {
				log('skip digestion coz dead!');
				that.doDigestion(tickCount);
				return;
			}

			// Every 10 ticks...
			if (tickCount % 10 === 0) {
				// Reduce food level.
				player.setFoodLevel(Math.max((player.getFoodLevel()+1), 0));
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
			if (state.digestionQueue[0]) {
				state.digestionQueue[0].percentDigested += 5;
				state.bgl += 0.2;
				if (player['getHealth']() < 20) {
					player['setHealth'](Math.min((player['getHealth']()+0.5), 20))
				}
				if (state.digestionQueue[0].percentDigested >= 100) {
					// finished digesting... remove from queue...
					state.digestionQueue.splice(0,1);
				}
			}

			state.inHealthyRange = (state.bgl >= 4 && state.bgl <= 8);
			setState(state);
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
					const server = magik.getPlugin().getServer();
					const cmd = `execute ${player.getName()} ~ ~ ~ minecraft:kill @e[type=Item,r=50]`;
					server.dispatchCommand(server.getConsoleSender(), cmd);
				}
				const worldName = player.getWorld()['getName']();
				if (worldName == 'mct1-main') {
					const Material = Java.type("org.bukkit.Material");
					const ItemStack = Java.type("org.bukkit.inventory.ItemStack");
					const Location = Java.type('org.bukkit.Location');
					let loc;

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

	doEffects() {
		let state = getState();

		if ((state.bgl >= 4 && state.bgl <= 8)) {
			this.cancelNegativeEffects();
			// Super powers!
			this.giveSuperPowers();
		}
		else { // Out of range...

			// Cancel super powers...
			this.cancelSuperPowers();
			
			// Confusion!
			if ((state.bgl < 4 && state.bgl >= 3) || (state.bgl > 8 && state.bgl <= 12)) {
				this._makeEffect('CONFUSION', 3500);
			}
			// More Confusion!
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

	cancelNegativeEffects() {
		this._cancelEffect('CONFUSION');
		this._cancelEffect('BLINDNESS');
		this._cancelEffect('POISON');
	},

	giveSuperPowers() {
		this._makeEffect('SPEED', 10000000, 'WHITE', 3);
		this._makeEffect('JUMP', 10000000, 'WHITE', 3);
		this._makeEffect('GLOWING', 10000000, 'WHITE');
		this._makeEffect('NIGHT_VISION', 10000000, 'WHITE');
	},

	cancelSuperPowers() {
		this._cancelEffect('SPEED');
		this._cancelEffect('JUMP');
		this._cancelEffect('GLOWING');
		this._cancelEffect('NIGHT_VISION');
	},

	_makeEffect(type, milliseconds, color = 'GREEN', amplifier = 1) {
		const PotionEffectType = magik.type("potion.PotionEffectType");
		if (player['hasPotionEffect'](PotionEffectType[type]) == true) {
			// Skip if effect already active!
			return;
		}
		const PotionEffect = magik.type("potion.PotionEffect");
		const Color = magik.type("Color");
		const duration = milliseconds/1000*40; // 20 tick. 1 tick = 0.05 seconds
		const c = Color[color];
		const l = PotionEffectType[type];
		const effect = new PotionEffect(l, duration, amplifier, true, true, c);
		player.addPotionEffect(effect);
	},

	_cancelEffect(type) {
		const PotionEffectType = magik.type("potion.PotionEffectType");
		if (player['hasPotionEffect'](PotionEffectType[type]) == true) {
			player['removePotionEffect'](PotionEffectType[type]);
		}
	},

	setupInventory() {
		const items = [
			{ type: 'SNOWBALL', amount: 128 },
			{ type: 'APPLE', amount: 64 },
			{ type: 'BREAD', amount: 64 },
			{ type: 'COOKED_FISH', amount: 64 },
			{ type: 'POTION', amount: 128 },
		];

		const server = magik.getPlugin().getServer();

		items.map(item => {
			server.dispatchCommand(server.getConsoleSender(), `give ${player.getName()} ${item.type} ${item.amount}`);
			// loh(`server.dispatchCommand(give ${player.getName()} ${item.type} ${item.amount})`);
		});
	},

	clearInventory() {
		player.getInventory()['clear']();
	},

	// getInventory() {
    //     const inventory = player.getInventory(); //Contents of player inventory
    //     for (let i = 0; i <= 35; i++) {
    //         const item = inventory['getItem'](i);
    //         if (item) {
    //             const type = item.getType();
    //             const amount = item.getAmount();
    //             log('i: ' + i);
    //             log('type: ' + type);
    //             log('amount: ' + amount);
    //         }
    //     }
	// },

	// refreshInventory() {
	// 	// const MATERIAL = Java.type("org.bukkit.Material");
    //     // const ItemStack = Java.type("org.bukkit.inventory.ItemStack");
	// 	const server = magik.getPlugin().getServer();

	// 	// event.getPlayer().getInventory().setItem(37, new ItemStack(Material.CHEESE, 1));
	// 	// const thing = new ItemStack(MATERIAL[item]);
	// 	// canon.sender.getInventory().addItem(thing);
		
	// 	InventoryList.map(item => {
	// 		// const stack = new ItemStack(MATERIAL[item.type], item.quantity);
	// 		// player.getInventory()['setItem'](item.slot, stack);
	// 		const slot = (item.slot <= 8) ? `slot.hotbar.${item.slot}` : `slot.inventory.${item.slot-1}`
	// 		const cmd = `replaceitem entity ${player.getName()} ${slot} ${item.type} ${item.quantity}`;
	// 		magik.dixit(cmd);
	// 		server.dispatchCommand(server.getConsoleSender(), cmd);
	// 		// log(`server.dispatchCommand(give ${player.getName()} ${item.type} ${item.amount})`);
	// 	});
	// },
}

export default Player;