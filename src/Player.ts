// import { IBar } from 'magikcraft-lore-ui-bar/dst';
// import * as log from './old/util/log';
import * as Bar from './Bar';
import Utils from './Utils';
import Food from './Food';
// import * as uuid from 'uuid';

const magik = magikcraft.io;
const log = magik.dixit;

const INSULIN_BAR_KEY = 'mct1.bar.insulin';
const BGL_BAR_KEY = 'mct1.bar.BGL';
const DIGESTION_BAR_KEY = 'mct1.bar.digestiom';

const Player = {
	name: magik.getSender().getName(),
	player: magik.getSender(),
	insulin: magik.playerMap.get('insulin') || 0,
	BGL: magik.playerMap.get('BGL') || 4,

	init() {
		this.clearInventory();
		this.setupInventory();
		this.setFood(10);
		this.doDigestion();
		this.renderBars();
		magik.Events.on('PlayerItemConsumeEvent', this._onConsume);
	},

	setFood(num: number) {
		this.player.setFoodLevel(num);
	},

	setHealth(num: number) {
		this.player.setHealth(num);
	},

	setInsulin(num: number = 0) {
		this.insulin = num;
		magik.playerMap.put('insulin', this.insulin);
	},

	setBGL(num: number = 0) {
		this.BGL = num;
		magik.playerMap.put('BGL', this.BGL);
	},

	renderBars() {
		// BGLBar
		let color  = 'GREEN';
		if (this.BGL >= 4 && this.BGL <= 8) {
			color = 'GREEN';
		}
		else if ((this.BGL < 4 && this.BGL >= 2) || (this.BGL > 8 && this.BGL <= 10)) {
			color = 'ORANGE';
		}
		else {
			color = 'RED';
		}
		const BGLBar = Bar.bar()
			.text(`BGL: ${this.insulin}`)
			.color(Bar.color[color])
			.style(Bar.style.NOTCHED_20)
			.progress((this.BGL / 20) * 100)
			.show();
		if (magik.playerMap.containsKey(BGL_BAR_KEY)) magik.playerMap.get(BGL_BAR_KEY).destroy();
		magik.playerMap.put(BGL_BAR_KEY, BGLBar);
		
		// insulinBar
		const insulinBar = Bar.bar()
			.text(`Insulin: ${this.insulin}`)
			.color(Bar.color.BLUE)
			.style(Bar.style.NOTCHED_20)
			.progress((this.BGL / 20) * 100)
			.show();
		if (magik.playerMap.containsKey(INSULIN_BAR_KEY)) magik.playerMap.get(INSULIN_BAR_KEY).destroy();
		magik.playerMap.put(INSULIN_BAR_KEY, insulinBar);

		
		const digestionQueue = magik.playerMap.get('digestionQueue') || [];
		const digestionItems = digestionQueue.slice(0, 3);

		log('digestionItems.length: ' + digestionItems.length);
		digestionItems.map((item) => {
			// digestionBar
			const digestionBar = Bar.bar()
				.text(`Digesting: ${item.type}`)
				.color(Bar.color.RED)
				.style(Bar.style.NOTCHED_20)
				.progress(item.percentDigested)
				.show();
			const barKey = `${DIGESTION_BAR_KEY}.${item.uuid}`;
			if (magik.playerMap.containsKey(barKey)) magik.playerMap.get(barKey).destroy();
			magik.playerMap.put(barKey, digestionBar);
		});
	},

	doDigestion() {
		log('digesting...');
		const that = this;
		magik.setTimeout(function() {
			const digestionQueue = magik.playerMap.get('digestionQueue') || [];
			log('digestionQueue: ' + JSON.stringify(digestionQueue));
			if (digestionQueue[0]) {
				digestionQueue[0].percentDigested += 20;
				if (digestionQueue[0].percentDigested >= 100) {
					// finished digesting, remove from queue...
					digestionQueue.splice(0, 1);
					magik.playerMap.put('digestionQueue', digestionQueue);
				}
				that.renderBars();
			}
			// repeat!
			log('repeat doDigestion');
			that.doDigestion();
		}, 3000);
	},

	_onConsume(event) {
		log('onConsume');
		const type = event.getItem().getType();
		// const amount = event.getItem().getAmount();
		if (Food[type]) {
			log(`You consumed a ${type}!`);
			const digestionQueueItem = {
				uuid: Utils.makeTimestamp(),
				type: type,
				percentDigested: 0,
			};
			const digestionQueue = magik.playerMap.get('digestionQueue') || [];
			digestionQueue.push(digestionQueueItem);
			magik.playerMap.put('digestionQueue', digestionQueue);

			log('digestionQueue: (1) ' + JSON.stringify(digestionQueue));
			this.renderBars();
			// event.setCancelled(true);
		}
	},

	getInventory() {
        const inventory = this.player.getInventory(); //Contents of player inventory
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
			{ type: 'CAKE', amount: 2 },
			{ type: 'APPLE', amount: 10 },
			{ type: 'BREAD', amount: 5 },
			{ type: 'COOKED_FISH', amount: 5 },
		];

		const server = magik.getPlugin().getServer();

		items.map(item => {
			server.dispatchCommand(server.getConsoleSender(), `give ${this.name} ${item.type} ${item.amount}`);
			magik.dixit(`server.dispatchCommand(give ${this.name} ${item.type} ${item.amount})`);
		});
	},

	clearInventory() {
		this.player.getInventory().clear();
	},	
}


// const playerName = magik.getSender().getName();
// const Player = new PlayerClass(playerName);
export default Player;

