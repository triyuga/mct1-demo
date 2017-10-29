import { Interval } from '../util/timer';
import { debug } from '../util/log';
import { isNode } from '../util/env';
import * as State from '../State';

/**
* See: https://github.com/mc-t1/mct1/issues/35
*/

const milliseconds = 1000;
const sample_rate = 1; // seconds/sample

export class Dose {

    private onsetDelay: number;
    private duration: number;
    private peak: boolean;
    private bglDeltaPerUnit: number;
    private onExhaustion: () => void;
    public test_bgl = 0;
    public test_insulinOnBoard = 0;

    constructor(onsetDelay, duration, peak, bglDeltaPerUnit, onExhaustion = () => {}) {
        this.onsetDelay = onsetDelay;
        this.duration = duration;
        this.peak = peak;
        this.bglDeltaPerUnit = bglDeltaPerUnit;
        this.onExhaustion = onExhaustion;
    }

    take(amount: number) {
        // This timeout is the onset Delay of taking the insulin
        Interval.setTimeout(() => {
            debug('Starting absorption');
            this.startInsulinAbsorption(amount);
        }, this.onsetDelay * milliseconds);
    }

    startInsulinAbsorption(amount: number) {
        const memoizedEffect: number[] = [];

        const dose = amount;
        debug('Absorption started');
        let elapsedTime = 0;


        const calculateInsulinEffectWithPeak = (power, duration) => elapsedTime => {
            if (elapsedTime > duration / 2) {
                return (memoizedEffect.pop() as number);
            }
            const effect = sample_rate * elapsedTime * Math.tan(Math.atan(4 * power / duration) / duration);
            memoizedEffect.push(effect);
            return effect;
        };

        const calculateInsulinEffectWithoutPeak = (power, duration) => elapsedTime => {
            return power / duration;
        }

        const activeEffectTime = this.duration - this.onsetDelay;

        const calculateInsulinEffect = (this.peak) ? calculateInsulinEffectWithPeak(this.bglDeltaPerUnit, activeEffectTime) : calculateInsulinEffectWithoutPeak(this.bglDeltaPerUnit, activeEffectTime);

        let _loop = Interval.setInterval(
            () => {
                elapsedTime += sample_rate;
                debug(`Elapsed time: ${elapsedTime}`);
                debug(`Duration: ${activeEffectTime}`);
                if (elapsedTime >= activeEffectTime) {
                    // insulin effect exhausted
                    Interval.clearInterval(_loop);
                    debug('Insulin effect exhausted');
                    this.onExhaustion();
                    return;
                }
                debug('Doing insulin effect');
                const bglDelta = (amount > 0) ? calculateInsulinEffect(elapsedTime) * dose : 0;
                const insulinAbsorbed = (amount > 0) ? Math.min(amount, (bglDelta / (this.bglDeltaPerUnit * dose)) * dose) : 0;
                amount -= insulinAbsorbed;
                this.doSideEffects(bglDelta, insulinAbsorbed);
            },
            sample_rate * milliseconds
        );
    }

    doSideEffects(bglDelta, insulinDelta) {
        if (isNode) {
            this.test_bgl -= bglDelta;
            this.test_insulinOnBoard -= insulinDelta;
        } else {
            State.changeBGL(0 - bglDelta);
            State.changeRapidInsulin(0 - insulinDelta);
        }
    }
}