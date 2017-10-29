// import { IBar } from 'magikcraft-lore-ui-bar/dst';
import * as log from './old/util/log';
import * as Bar from './Bar';

const magik = magikcraft.io;

const BGL_BAR_KEY = 'mct1.bar.bgl';

class PlayerClass {
	name: string;

	constructor(name) {
		this.name = name;
		magik.dixit(name);
	}

	getInventory() {
        magik.dixit('Player.getInventory()');
        const sender = magik.getSender();
        const inventory = sender.getInventory(); //Contents of player inventory
        
        for (let i = 0; i <= 35; i++) {
            const item = inventory['getItem'](i);
            if (item) {
                const type = item.getType();
                const amount = item.getAmount();
                magik.dixit('i: ' + i);
                magik.dixit('type: ' + type);
                magik.dixit('amount: ' + amount);
            }
            
        }
    }
}


const playerName = magik.getSender().getName();
const Player = new PlayerClass(playerName);
export default Player;

