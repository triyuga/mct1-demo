/**
 * @TODO: Currently not used. To be reimplemented.
 */
import * as log from '../util/log';
import { applyEffect } from '../Effects';
import * as env from '../util/env';
import { thresholds } from './bgl-alerts';
enum BGLunits {
    'mmolL',
    'mgdl'
}

/**
 *
 * The BGL class manages the player's Blood Glucose Level
 * Internally it stores the BGL in mmol/L, and provides a getter that
 * can return the value in mg/dl.
 *
 * @class BGL
 */
export class BGL {

    private _bgl: number;
    private bglDelta: number;
    private static InitialLevel = 5;
    private say: (msg: string) => void;
    private effects: (effect: string) => void;

    constructor() {
        this._bgl = BGL.InitialLevel;
        this.effects = (env.isNode) ? log.info
            : applyEffect;
    }

    getBGL(units: BGLunits = BGLunits.mmolL): number {
        switch (units) {
            case BGLunits.mmolL:
                return this.getBGLmmolL();
            case BGLunits.mgdl:
                return this.getBGLmgdl();
        }
    }

    getBGLmmolL() {
        return this._bgl;
    }

    getBGLmgdl() {
        return Math.round(this._bgl * 18);
    }

    static mmolL2mgdl(bgl: number) {
        return Math.round(bgl * 18);
    }

    static mgdl2mmolL(bgl: number) {
        return Math.round(bgl / 18);
    }

    applyBGLchange(delta: number) {

        // The following keeps newBGL 0 - 30
        const newBGL = (bgl => Math.min(bgl, 30))(Math.max(this._bgl + delta, 0));
        this._bgl = newBGL;
        this.bglDelta = delta;

        // Should alerts be moved out to a glucose monitor?
        if (this.BGLFallingFast()) {
            this.say('ALERT: BGL Falling fast');
        }
        if (this.BGLRisingFast()) {
            this.say('ALERT: BGL Rising fast');
        }
        if (this.BGLinRange()) {
            if (this.BGLGoingLow()) {
                this.say('WARNING: Dropping to a low!');
            }
        }

        // Effects
        if (!this.BGLinRange()) {
            if (this.BGLIsLow()) {
                this.effects('CONFUSION');
            }
            if (this.BGLIsHigh()) {
                this.effects('BLINDNESS');
            }
        }
        if (newBGL === 0) {
            this.say("Aaaarrrggh!"); // kill player
        }
    }

    BGLRisingFast() {
        return (this.bglDelta >= thresholds.RISE_ALERT_WARN_THRESHOLD);
    }

    BGLFallingFast() {
        return (this.bglDelta <= thresholds.FALL_RATE_ALERT_THRESHOLD);
    }

    BGLIsHigh() {
        return (this._bgl > thresholds.HIGH_EVENT_THRESHOLD);
    }

    BGLIsLow() {
        return (this._bgl < thresholds.LOW_EVENT_THRESHOLD);
    }

    BGLGoingLow() {
        return (this._bgl < thresholds.LOW_ALERT_THRESHOLD && this.bglDelta < 0);
    }

    BGLinRange(): boolean {
        return (this._bgl > thresholds.LOW_ALERT_THRESHOLD && this._bgl < thresholds.HIGH_ALERT_THRESHOLD);
    }
}








