import { Dose } from './Dose';
import { debug } from '../util/log';
import * as State from '../State';

/**
 * See: https://github.com/mc-t1/mct1/issues/35
 */

const sample_rate = 1; // seconds/sample
const milliseconds = 1000;
export class Insulin {
    public onsetDelay: number;
    public duration: number;
    public peak: boolean;
    public angle: number;
    public bglDeltaPerUnit: number;
    private exhaustionListeners: (() => void)[] = [];

    /**
     * Creates an instance of Insulin.
     * @param {any} onsetDelay - seconds delay till insulin effect starts
     * @param {number} duration - seconds of action
     * @param {number} bglDeltaPerUnit - power factor (how many mmol/l 1 unit will drop)
     * @param {boolean} [peak=false] set to true for a saw-tooth, false for flat response
     * @memberof Insulin
     */
    constructor(onsetDelay, duration: number, bglDeltaPerUnit: number, peak = false) {
        this.onsetDelay = onsetDelay;
        this.duration = duration;
        this.peak = peak; // Set to true for a saw-tooth acting insulin, false for a flat basal one
        this.bglDeltaPerUnit = bglDeltaPerUnit;


        if (this.peak) {
            const time = (duration - onsetDelay) / sample_rate;
            const height = (bglDeltaPerUnit * 2) / time;
            this.angle = Math.atan(height / (time / 2));
        }
    }

    take(amount: number) {
        debug(`Taking ${amount} rapid`);
        State.changeRapidInsulin(amount);

        new Dose(this.onsetDelay, this.duration, this.peak, this.bglDeltaPerUnit, this.doExhaustion).take(amount);
    }

    onExhaustion(callback: () => void){
        this.exhaustionListeners.push(callback);
    }

    private doExhaustion() {
        if (this.exhaustionListeners) {
            this.exhaustionListeners.forEach(fn => fn());
        }
    }
}