import BGL from './BGL';
import * as log from './old/util/log';

const magik = magikcraft.io;

log.info('MCT1 loading...');

export function init() {
    BGL.init();
}

export function setBGL(num: number = 0) {
    BGL.set(num);
}

const _default = init;
export const spells = {
    _default,
    init,
    setBGL,
}
