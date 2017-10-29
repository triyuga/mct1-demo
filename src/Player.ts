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
		magik.Events.on('PlayerItemConsumeEvent', this._onConsume);
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
		if (state.bglBar) state.bglBar.destroy();
		if (state.insulinBar) state.insulinBar.destroy();
		if (state.digestionBar0) state.digestionBar0.destroy();
		if (state.digestionBar1) state.digestionBar1.destroy();
		// if (state.digestionBar2) state.digestionBar2.destroy();

		// BGLBar
		let color  = 'GREEN';
		if (state.bgl >= 4 && state.bgl <= 8) color = 'GREEN';
		else if ((state.bgl < 4 && state.bgl >= 2) || (state.bgl > 8 && state.bgl <= 10)) color = 'YELLOW';
		else color = 'RED';
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

		setState(state);
	},

	doDigestion() {
		// log('digesting...');
		const that = this;
		magik.setTimeout(function() {
			let updated = false;
			
			if (state.insulin > 0) {
				state.insulin -= 0.1;
				state.bgl -= 0.3;
				updated = true;
			}

			if (state.digestionQueue[0]) {
				state.digestionQueue[0].percentDigested += 5;
				state.bgl += 0.2;	
				if (state.digestionQueue[0].percentDigested >= 100) {
					// finished digesting... remove from queue...
					state.digestionQueue.splice(0, 1);
				}
				updated = true;
			}

			if (updated) {
				setState(state);
				that.renderBars();
				that.doEffects();
			}
			// repeat!
			that.doDigestion();
		}, 1000);
	},

	_onConsume(event) {
		const type = event.getItem().getType();
		// const amount = event.getItem().getAmount();
		log(`_onConsume type: ${type}`);
		if (Food[type]) {
			log(`You consumed a ${type}!`);
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
			log(`You consumed an INSULIN POTION!`);
			state.insulin += 2;
			setState(state);
			this.renderBars();
		}
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
			magik.dixit(`server.dispatchCommand(give ${player.getName()} ${item.type} ${item.amount})`);
		});
	},

	clearInventory() {
		player.getInventory()['clear']();
	},

	doEffects() {
		if ((state.bgl < 4 && state.bgl >= 2) || (state.bgl >= 10 && state.bgl < 12)) {
			this.doConfusion();
		}
		else if (state.bgl < 2 || state.bgl > 10) {
			this.doBlindness();
		}
	},

	doConfusion() {
		if (!state.confusionEffect) {
			this._makeEffect('CONFUSION', 5000);
			state.confusionEffect = true;
			setState(state);
			magik.setTimeout(() => {
				state.confusionEffect = false;
				setState(state);
			}, 5000);
		}
	},

	doBlindness() {
		if (!state.blindnessEffect) {
			this._makeEffect('BLINDNESS', 5000);
			state.blindnessEffect = true;
			setState(state);
			magik.setTimeout(() => {
				state.blindnessEffect = false;
				setState(state);
			}, 5000);
		}
	},

	_makeEffect(type, milliseconds, color = 'GREEN') {
		const PotionEffect = magik.type("potion.PotionEffect");
		const PotionEffectType = magik.type("potion.PotionEffectType");
		const Color = magik.type("Color");
		const duration = milliseconds/1000*20; // 20 tick. 1 tick = 0.05 seconds
		const amplifier = 1;
		const c = Color[color];
		const l = PotionEffectType[type];
		const effect = new PotionEffect(l, duration, amplifier, true, true, c);
		player.addPotionEffect(effect);
	}
}

export default Player;

