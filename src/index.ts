import BGL from './BGL';
import Insulin from './Insulin';
import Food from './Food';
import * as log from './old/util/log';

const magik = magikcraft.io;

export function init() {
    log.info(`init()`);
    BGL.set(4);
    Insulin.set(0);
}

export function setBGL(num: number = 0) {
    log.info(`setBGL(${num})`);
    BGL.set(num);
}

export function setInsulin(num: number = 0) {
    log.info(`setInsulin(${num})`);
    Insulin.set(num);
}

export function eat()  {
    magik.dixit('listening to eat event!');
    magik.Events.on('PlayerItemConsumeEvent', (evt) => {
        const itemType = evt.getItem().getType();
        magik.dixit(`you ate a ${itemType}!`);
        magik.dixit('evt.getItem(): ' + JSON.stringify('evt.getItem()'));
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
