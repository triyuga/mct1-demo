import BGL from './BGL';
import * as log from './old/util/log';

const magik = magikcraft.io;

export function init() {
    log.info(`init()`);
    BGL.init();
}

export function setBGL(num: number = 0) {
    log.info(`setBGL(${num})`);
    BGL.set(num);
}

const _default = init;
export const spells = {
    _default,
    init,
    setBGL,
}
