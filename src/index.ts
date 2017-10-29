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
    
    const sender = magik.getSender();
    const playerName = sender.getName();
    magik.dixit(`playerName: ${playerName}`);

    const plugin = magik.getPlugin();
    const server = plugin.getServer();
    // const consoleSender = server.getConsoleSender();
    server.dispatchCommand(null, `give ${playerName} cake`);
    magik.dixit(`server.dispatchCommand(give ${playerName} cake)`);

    // var player = canon.plugin.getServer().getPlayer(playerName);
    
    // if (typeof playerName === "undefined") {
    //     canon.magik.msg(MSG.SATIO_GENERIC);
    //     return canon.sender.setFoodLevel(30);
    // }
    // var player = canon.plugin.getServer().getPlayer(playerName);


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
    eat,
}
