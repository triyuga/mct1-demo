import BGL from './BGL';
import Insulin from './Insulin';
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

const _default = init;
export const spells = {
    _default,
    init,
    setBGL,
    setInsulin,
}
