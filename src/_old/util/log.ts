declare const console: any;
import * as env from './env';

let _verbose = false;

export const info = (env.isNode) ? console.log
    : magikcraft.io.dixit;

export const debug = (msg) => ((_verbose) ? info(msg): undefined);

export const verbose = (trueOrFalse: boolean) => _verbose = trueOrFalse;