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
		this.setFood(10);
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
		else if ((state.bgl < 4 && state.bgl >= 2) || (state.bgl > 8 && state.bgl <= 10)) color = 'ORANGE';
		else color = 'RED';
		state.bglBar = Bar.bar()
			.text(`BGL: ${state.bgl}`)
			.color(Bar.color[color])
			.style(Bar.style.NOTCHED_20)
			.progress((state.bgl / 20) * 100)
			.show();

		// insulinBar
		state.insulinBar = Bar.bar()
			.text(`Insulin: ${state.insulin}`)
			.color(Bar.color.BLUE)
			.style(Bar.style.NOTCHED_20)
			.progress((state.insulin / 20) * 100)
			.show();

		// digestionBar(s)
		state.digestionQueue.slice(0, 2).map((item, i) => {
			state[`digestionBar${i}`] = Bar.bar()
				.text(`Digesting: ${item.type}`)
				.color(Bar.color.RED)
				.style(Bar.style.NOTCHED_20)
				.progress(item.percentDigested)
				.show();
		});

		setState(state);
	},

	doDigestion() {
		// log('digesting...');
		const that = this;
		magik.setTimeout(function() {
			if (state.digestionQueue[0]) {
				state.digestionQueue[0].percentDigested += 10;
				state.bgl += 1;
				if (state.insulin > 0) {
					state.insulin -= 1;
					if (state.insulin < 0) state.insulin = 0; 
					state.bgl -= 2;
				}			
				if (state.digestionQueue[0].percentDigested >= 100) {
					// finished digesting... remove from queue...
					state.digestionQueue.splice(0, 1);
				}
				setState(state);
				that.renderBars();
			}
			// repeat!
			that.doDigestion();
		}, 1000);
	},

	_onConsume(event) {
		const type = event.getItem().getType();
		// const amount = event.getItem().getAmount();
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
		else if (type === 'POTION') {
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
			{ type: 'APPLE', amount: 10 },
			{ type: 'BREAD', amount: 5 },
			{ type: 'COOKED_FISH', amount: 5 },
			{ type: 'POTION', amount: 64 },
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
}

export default Player;

