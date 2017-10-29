import BGL from './BGL';
import Insulin from './Insulin';
import Food from './Food';
import * as log from './old/util/log';

const magik = magikcraft.io;

export function init() {
    log.info(`init()`);
    BGL.set(4);
    Insulin.set(0);
    listenConsume();
    setInventory();
}

export function setInventory() {
    const sender = magik.getSender();
    const playerName = sender.getName();
    const plugin = magik.getPlugin();
    const server = plugin.getServer();
    const consoleSender = server.getConsoleSender();
    
    const items = [
        { type: 'cake', amount: 2 },
        { type: 'apple', amount: 10 },
        { type: 'bread', amount: 5 },
        { type: 'fish', amount: 5 },
    ];

    items.map(item => {
        server.dispatchCommand(consoleSender, `give ${playerName} ${item.type} ${item.amount}`);
        magik.dixit(`server.dispatchCommand(give ${playerName} ${item.type} ${item.amount})`);
    });
}

export function setBGL(num: number = 0) {
    log.info(`setBGL(${num})`);
    BGL.set(num);
}

export function setInsulin(num: number = 0) {
    log.info(`setInsulin(${num})`);
    Insulin.set(num);
}

export function listenConsume()  {
    magik.dixit('listening to PlayerItemConsumeEvent...');
    magik.Events.on('PlayerItemConsumeEvent', (evt) => {
        const event = evt.getItem();
        const foodType = event.getType();
        magik.dixit(`you ate a ${foodType}!`);
        magik.dixit('event: ' + JSON.stringify(event));
    });
}

const _default = init;
export const spells = {
    _default,
    init,
    setBGL,
    setInsulin,
    listenConsume,
    setInventory,
}
