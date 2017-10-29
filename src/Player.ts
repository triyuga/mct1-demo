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

class PlayerClass {
	name: string;
	initialised: boolean;
	player: any;
	insulin: number;
	BGL: number;
	digestionQueue: Array<any>;

	constructor(name) {
		this.name = name;
		this.initialised = false;
		this.init();
	}

	init() {
		if (!this.initialised) {
			this.player = magik.getSender();
			this.insulin = 0;
			this.BGL = 4;
			this.digestionQueue = [];
			this.onConsume();
			this.setupInventory();
			this.setFood(10);
			log('1');
			this.doDigestion();
			log('2');
			this.initialised = true;

		}
	}

	setFood = (num: number) => {
		this.player.setFoodLevel(num);
	}

	setHealth = (num: number) => {
		this.player.setHealth(num);
	} 

	setInsulin(num: number = 0) {
		this.insulin = num;
	}

	setBGL(num: number = 0) {
		this.BGL = num;
	}

	renderBars = () => {
		// BGLBar
		const BGLBar = Bar.bar()
			.text(`BGL: ${this.insulin}`)
			.color(Bar.color[this._BGLBarColor()])
			.style(Bar.style.NOTCHED_20)
			.progress((this.BGL / 20) * 100)
			.show();
		magik.playerMap.get(BGL_BAR_KEY).destroy();
		magik.playerMap.put(BGL_BAR_KEY, BGLBar);
		
		// insulinBar
		const insulinBar = Bar.bar()
			.text(`BGL: ${this.insulin}`)
			.color(Bar.color[this._BGLBarColor()])
			.style(Bar.style.NOTCHED_20)
			.progress((this.BGL / 20) * 100)
			.show();
		magik.playerMap.get(INSULIN_BAR_KEY).destroy();
		magik.playerMap.put(INSULIN_BAR_KEY, insulinBar);

		const digestionItems = this.digestionQueue.slice(0, 3);
		log('digestionItems.length: ' + digestionItems.length);

		digestionItems.map((item) => {
			// digestionBar
			const digestionBar = Bar.bar()
				.text(`Digesting: ${item.type}`)
				.color(Bar.color.RED)
				.style(Bar.style.NOTCHED_20)
				.progress(item.percentDigested)
				.show();
			magik.playerMap.get(`${DIGESTION_BAR_KEY}.${item.uuid}`).destroy();
			magik.playerMap.put(`${DIGESTION_BAR_KEY}.${item.uuid}`, digestionBar);
		});
	}

	doDigestion = () => {
		log('digesting...');
		log('this.digestionQueue.length: ' + this.digestionQueue.length);
		this.digestionQueue.map((item, i) => log(`digestionQueue[${i}].type: ${item.type}`));
		const that = this;
		magik.setTimeout(function() {
			if (that.digestionQueue[0]) {
				that.digestionQueue[0].percentDigested += 20;
				if (that.digestionQueue[0].percentDigested >= 100) {
					// finished digesting, remove from queue...
					that.digestionQueue.splice(0, 1);
				}
				// that.renderBars();
			}
			// repeat!
			log('repeat doDigestion');
			// that.doDigestion();
		}, 3000);
	}

	onConsume() {
		log('onConsume');
		// magik.Events.on('PlayerItemConsumeEvent', (event) => {
		// 	const type = event.getItem().getType();
		// 	// const amount = event.getItem().getAmount();
		// 	if (Food[type]) {
		// 		log(`You consumed a ${type}!`);
		// 		const digestionQueueItem = {
		// 			uuid: Utils.makeTimestamp(),
		// 			type: type,
		// 			percentDigested: 0,
		// 		};
		// 		this.digestionQueue.push(digestionQueueItem);
		// 		this.digestionQueue.map((item, i) => log(`item[${i}].type: ${item.type}`));
		// 		this.renderBars();
		// 		// event.setCancelled(true);
		// 	}
		// });
	}

	_BGLBarColor = () => {
		let color = 'GREEN';
		if (this.BGL >= 4 && this.BGL <= 8) {
			color = 'GREEN';
		}
		else if ((this.BGL < 4 && this.BGL >= 2) || (this.BGL > 8 && this.BGL <= 10)) {
			color = 'ORANGE';
		}
		else {
			color = 'RED';
		}
		return color;
	}

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
	}

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
	}
	
}


const playerName = magik.getSender().getName();
const Player = new PlayerClass(playerName);
export default Player;

