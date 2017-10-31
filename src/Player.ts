import * as Bar from './Bar';
import Utils from './Utils';
import { getState, setState } from './State';
import * as fs from 'fs-extra';


// Read the file, and pass it to your callback

const magik = magikcraft.io;
const log = magik.dixit;

const player = magik.getSender();
const state = getState();

// declare function require(name:string);
// declare const require: any;
// const foodList = fs.readFileSync('./men.json, handleJSONFile);

// const foodList = JSON.parse(fs.readFileSync('./food.json', 'utf8'));
const foodList = [
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

const Food:any = {};
foodList.forEach(item => Food[item.type] = item);
// const inventoryList = JSON.parse(fs.readFileSync('./inventory.json', 'utf8'));
// const inventoryList = require('./inventory.json');

const inventoryList = [
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

const Player = {
	init() {
		this.clearInventory();
		this.refreshInventory();
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

	setFood(num: number) {
		player.setFoodLevel(num);
	},

	setHealth(num: number) {
		player['setHealth'](num);
	},

	setInsulin(num: number = 0) {
		state.insulin = num;
		setState(state);
	},

	setBGL(num: number = 0) {
		state.bgl = num;
		setState(state);
	},

	renderBars() {
		// First, clear all bars.... 
		if (state.bglBar) state.bglBar.destroy();
		if (state.insulinBar) state.insulinBar.destroy();
		if (state.digestionBar0) state.digestionBar0.destroy();
		if (state.digestionBar1) state.digestionBar1.destroy();
		
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
		// log('digesting...');
		const that = this;
		magik.setTimeout(function() {
			let updated = false;

			// Every 10 ticks...
			if (tickCount % 10 === 0) {
				// Reduce food level.
				player.setFoodLevel(Math.max((player.getFoodLevel()-1), 0));
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
					player['setHealth'](Math.min((player['getHealth']()+0.5), 20))
				}
				if (state.digestionQueue[0].percentDigested >= 100) {
					// finished digesting... remove from queue...
					state.digestionQueue.splice(0,1);
				}
				updated = true;
			}

			// update if changes...
			if (updated) {
				setState(state);
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

	onConsume(event) {
		const consumer = event.getPlayer();
		if (consumer.getName() !== player.getName()) {
			return;
		}	
		const type = event.getItem().getType();
		if (Food[type]) {
			log(`You ate a ${type}!`);
			const item = {
				timestamp: Utils.makeTimestamp(),
				type: type,
				percentDigested: 0,
			};
			state.digestionQueue.push(item);
			setState(state);
			this.renderBars();
			// event.setCancelled(true);
		}
		else if (type == 'POTION') { // important! use double arrow (not triple)
			log(`You drank an INSULIN POTION!`);
			state.insulin += 2;
			setState(state);
			this.renderBars();
		}
	},

	onProjectileHit(event) {
		// Identify shooter.
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

		if (!loc) return;
		
		const location = `${loc.getX()} ${loc.getY()} ${loc.getZ()}`;
		const server = magik.getPlugin().getServer();
		const cmd = `execute ${player.getName()} ~ ~ ~ summon lightning_bolt ${location}`;
		server.dispatchCommand(server.getConsoleSender(), cmd);

		// Food or Health cost...
		if (player.getFoodLevel() > 0) {
			player.setFoodLevel(Math.max(player.getFoodLevel()-1, 0));
		}
		else {
			player['setHealth'](player['getHealth']() - 1);
		}
	},

	onInteract(event) {
		// Do stuff.
	},

	doEffects() {
		// Confusion!
		if ((state.bgl < 4 && state.bgl >= 2) || (state.bgl >= 8 && state.bgl <= 10)) {
			this.doConfusion(2500);
		}
		// More Confusion!
		else if (state.bgl < 2 || state.bgl > 10) {
			this.doConfusion(5000);
		}
		// Layer additional effects.
		if (state.bgl < 0 || state.bgl > 12) {
			this.doBlindness(5000);
			this.doPoison(5000);
		}
	},

	doConfusion(milliseconds) {
		if (!state.confusionEffect) {
			this._makeEffect('CONFUSION', milliseconds);
			state.confusionEffect = true;
			setState(state);
			magik.setTimeout(() => {
				state.confusionEffect = false;
				setState(state);
			}, milliseconds);
		}
	},

	doBlindness(milliseconds) {
		if (!state.blindnessEffect) {
			this._makeEffect('BLINDNESS', milliseconds);
			state.blindnessEffect = true;
			setState(state);
			magik.setTimeout(() => {
				state.blindnessEffect = false;
				setState(state);
			}, milliseconds);
		}
	},

	doPoison(milliseconds) {
		if (!state.poisonEffect) {
			this._makeEffect('POISON', milliseconds);
			state.poisonEffect = true;
			setState(state);
			magik.setTimeout(() => {
				state.poisonEffect = false;
				setState(state);
			}, milliseconds);
		}
	},

	superSpeed() {
		this._makeEffect('SPEED', 10000000, 'WHITE', 3);
	},
	superJump() {
		this._makeEffect('JUMP', 10000000, 'WHITE', 3);
	},
	superGlow() {
		this._makeEffect('GLOWING', 10000000, 'WHITE');
	},

	_makeEffect(type, milliseconds, color = 'GREEN', amplifier = 1) {
		const PotionEffect = magik.type("potion.PotionEffect");
		const PotionEffectType = magik.type("potion.PotionEffectType");
		const Color = magik.type("Color");
		const duration = milliseconds/1000*40; // 20 tick. 1 tick = 0.05 seconds
		const c = Color[color];
		const l = PotionEffectType[type];
		const effect = new PotionEffect(l, duration, amplifier, true, true, c);
		player.addPotionEffect(effect);
	},

	getInventory() {
        const inventory = player.getInventory(); //Contents of player inventory
        for (let i = 0; i <= 35; i++) {
            const item = inventory['getItem'](i);
            if (item) {
                const type = item.getType();
                const amount = item.getAmount();
                log('i: ' + i);
                log('type: ' + type);
                log('amount: ' + amount);
            }
        }
	},

	refreshInventory() {
		const MATERIAL = Java.type("org.bukkit.Material");
        const ItemStack = Java.type("org.bukkit.inventory.ItemStack");
		const server = magik.getPlugin().getServer();

		// event.getPlayer().getInventory().setItem(37, new ItemStack(Material.CHEESE, 1));
		// const thing = new ItemStack(MATERIAL[item]);
		// canon.sender.getInventory().addItem(thing);
		
		inventoryList.map(item => {
			const cmd = ``;
			const stack = new ItemStack(MATERIAL[item.type], item.quantity);
			player.getInventory()['setItem'](item.slot, stack);
			
			// server.dispatchCommand(server.getConsoleSender(), `give ${player.getName()} ${item.type} ${item.amount}`);
			// magik.dixit(`server.dispatchCommand(give ${player.getName()} ${item.type} ${item.amount})`);
		});
	},

	clearInventory() {
		player.getInventory()['clear']();
	},
}

export default Player;

