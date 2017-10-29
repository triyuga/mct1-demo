"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @TODO: Currently not used. To be reimplemented.
 */
var log = require("../util/log");
var Effects_1 = require("../Effects");
var env = require("../util/env");
var bgl_alerts_1 = require("./bgl-alerts");
var BGLunits;
(function (BGLunits) {
    BGLunits[BGLunits["mmolL"] = 0] = "mmolL";
    BGLunits[BGLunits["mgdl"] = 1] = "mgdl";
})(BGLunits || (BGLunits = {}));
/**
 *
 * The BGL class manages the player's Blood Glucose Level
 * Internally it stores the BGL in mmol/L, and provides a getter that
 * can return the value in mg/dl.
 *
 * @class BGL
 */
var BGL = (function () {
    function BGL() {
        this._bgl = BGL.InitialLevel;
        this.effects = (env.isNode) ? log.info
            : Effects_1.applyEffect;
    }
    BGL.prototype.getBGL = function (units) {
        if (units === void 0) { units = BGLunits.mmolL; }
        switch (units) {
            case BGLunits.mmolL:
                return this.getBGLmmolL();
            case BGLunits.mgdl:
                return this.getBGLmgdl();
        }
    };
    BGL.prototype.getBGLmmolL = function () {
        return this._bgl;
    };
    BGL.prototype.getBGLmgdl = function () {
        return Math.round(this._bgl * 18);
    };
    BGL.mmolL2mgdl = function (bgl) {
        return Math.round(bgl * 18);
    };
    BGL.mgdl2mmolL = function (bgl) {
        return Math.round(bgl / 18);
    };
    BGL.prototype.applyBGLchange = function (delta) {
        // The following keeps newBGL 0 - 30
        var newBGL = (function (bgl) { return Math.min(bgl, 30); })(Math.max(this._bgl + delta, 0));
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
    };
    BGL.prototype.BGLRisingFast = function () {
        return (this.bglDelta >= bgl_alerts_1.thresholds.RISE_ALERT_WARN_THRESHOLD);
    };
    BGL.prototype.BGLFallingFast = function () {
        return (this.bglDelta <= bgl_alerts_1.thresholds.FALL_RATE_ALERT_THRESHOLD);
    };
    BGL.prototype.BGLIsHigh = function () {
        return (this._bgl > bgl_alerts_1.thresholds.HIGH_EVENT_THRESHOLD);
    };
    BGL.prototype.BGLIsLow = function () {
        return (this._bgl < bgl_alerts_1.thresholds.LOW_EVENT_THRESHOLD);
    };
    BGL.prototype.BGLGoingLow = function () {
        return (this._bgl < bgl_alerts_1.thresholds.LOW_ALERT_THRESHOLD && this.bglDelta < 0);
    };
    BGL.prototype.BGLinRange = function () {
        return (this._bgl > bgl_alerts_1.thresholds.LOW_ALERT_THRESHOLD && this._bgl < bgl_alerts_1.thresholds.HIGH_ALERT_THRESHOLD);
    };
    BGL.InitialLevel = 5;
    return BGL;
}());
exports.BGL = BGL;
