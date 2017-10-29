declare const setInterval: any, clearInterval: any, setTimeout: any;

import * as env from './env';

export interface Timer {
    setInterval: (handler:(...args: any[]) => void, timeout: number) => number;
    clearInterval: (handle: number) => void;
    setTimeout: (handler:(...args: any[]) => void, timeout: number) => number;
}
export const Interval = (env.isNode) ?
    {
        setInterval,
        clearInterval,
        setTimeout
    } :
    {
        setInterval: magikcraft.io.setInterval,
        clearInterval: magikcraft.io.clearInterval,
        setTimeout: magikcraft.io.setTimeout
    }