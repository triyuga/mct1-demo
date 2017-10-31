import * as Bar from './Bar';
import Utils from './Utils';
import Food from './Food';
import { getState, setState } from './State';

const magik = magikcraft.io;
const log = magik.dixit;

const player = magik.getSender();
const state = getState();

const Player = {
	init() {
		this.clearInventory();
		this.setupInventory();
		this.setFood(2);
		this.doDigestion();
		this.renderBars();
		magik.Events.on('PlayerItemConsumeEvent', this.onConsume);
		
		magik.Events.on('BlockBreak', (event) => log('BlockBreak'));
		magik.Events.on('BlockBurn', (event) => log('BlockBurn'));
		magik.Events.on('BlockCanBuild', (event) => log('BlockCanBuild'));
		// magik.Events.on('BlockDamage', (event) => log('BlockDamage'));
		magik.Events.on('BlockPlace', (event) => log('BlockPlace'));
		magik.Events.on('CreatureSpawn', (event) => log('CreatureSpawn'));
		magik.Events.on('EntityDeath', (event) => log('EntityDeath'));
		magik.Events.on('EntityRegainHealth', (event) => log('EntityRegainHealth'));
		magik.Events.on('FoodLevelChange', (event) => log('FoodLevelChange'));
		magik.Events.on('PlayerItemConsumeEvent', (event) => log('PlayerItemConsumeEvent'));
		magik.Events.on('PlayerJoin', (event) => log('PlayerJoin'));
		// magik.Events.on('PlayerMove', (event) => log('PlayerMove'));
		magik.Events.on('PlayerQuit', (event) => log('PlayerQuit'));
		magik.Events.on('PlayerTeleport', (event) => log('PlayerTeleport'));
		
		magik.Events.on('BlockDamage', (event) => {
			// const server = magik.getPlugin().getServer();
			// server.dispatchCommand(server.getConsoleSender(), `lightning`);
			magik.shakti();
		});
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
			state[`digestionBar${i}`] = Bar.bar()
				.text(`Digesting: ${item.type}`)
				.color(Bar.color.PURPLE)
				.style(Bar.style.NOTCHED_20)
				.progress(100 - item.percentDigested)
				.show();
		});

		// SetState
		setState(state);
	},

	doDigestion() {
		// log('digesting...');
		const that = this;
		magik.setTimeout(function() {
			let updated = false;
			
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
				if (state.digestionQueue[0].percentDigested >= 100) {
					// finished digesting... remove from queue...
					state.digestionQueue.splice(0, 1);
				}
				updated = true;
			}

			// update if changes...
			if (updated) {
				setState(state);
				that.renderBars();
				that.doEffects();
			}

			// repeat ongoingly!
			that.doDigestion();
		}, 1000);
	},

	onConsume(event) {
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

	// onInteract(event) {
	// 	log('PlayerInteract!');
	// 	const blockType = event.Block.getType();
	// 	const playerName = event.Player.getName();
	// 	log('blockType: ' + blockType);
	// 	log('playerName: ' + playerName);
	// },

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

	_makeEffect(type, milliseconds, color = 'GREEN') {
		const PotionEffect = magik.type("potion.PotionEffect");
		const PotionEffectType = magik.type("potion.PotionEffectType");
		const Color = magik.type("Color");
		const duration = milliseconds/1000*40; // 20 tick. 1 tick = 0.05 seconds
		const amplifier = 1;
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

	setupInventory() {
		const items = [
			{ type: 'APPLE', amount: 64 },
			{ type: 'BREAD', amount: 64 },
			{ type: 'COOKED_FISH', amount: 64 },
			{ type: 'POTION', amount: 128 },
		];

		const server = magik.getPlugin().getServer();

		items.map(item => {
			server.dispatchCommand(server.getConsoleSender(), `give ${player.getName()} ${item.type} ${item.amount}`);
			// magik.dixit(`server.dispatchCommand(give ${player.getName()} ${item.type} ${item.amount})`);
		});
	},

	clearInventory() {
		player.getInventory()['clear']();
	},
}

export default Player;

