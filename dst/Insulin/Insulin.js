"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dose_1 = require("./Dose");
var log_1 = require("../util/log");
var State = require("../State");
/**
 * See: https://github.com/mc-t1/mct1/issues/35
 */
var sample_rate = 1; // seconds/sample
var milliseconds = 1000;
var Insulin = (function () {
    /**
     * Creates an instance of Insulin.
     * @param {any} onsetDelay - seconds delay till insulin effect starts
     * @param {number} duration - seconds of action
     * @param {number} bglDeltaPerUnit - power factor (how many mmol/l 1 unit will drop)
     * @param {boolean} [peak=false] set to true for a saw-tooth, false for flat response
     * @memberof Insulin
     */
    function Insulin(onsetDelay, duration, bglDeltaPerUnit, peak) {
        if (peak === void 0) { peak = false; }
        this.exhaustionListeners = [];
        this.onsetDelay = onsetDelay;
        this.duration = duration;
        this.peak = peak; // Set to true for a saw-tooth acting insulin, false for a flat basal one
        this.bglDeltaPerUnit = bglDeltaPerUnit;
        if (this.peak) {
            var time = (duration - onsetDelay) / sample_rate;
            var height = (bglDeltaPerUnit * 2) / time;
            this.angle = Math.atan(height / (time / 2));
        }
    }
    Insulin.prototype.take = function (amount) {
        log_1.debug("Taking " + amount + " rapid");
        State.changeRapidInsulin(amount);
        new Dose_1.Dose(this.onsetDelay, this.duration, this.peak, this.bglDeltaPerUnit, this.doExhaustion).take(amount);
    };
    Insulin.prototype.onExhaustion = function (callback) {
        this.exhaustionListeners.push(callback);
    };
    Insulin.prototype.doExhaustion = function () {
        if (this.exhaustionListeners) {
            this.exhaustionListeners.forEach(function (fn) { return fn(); });
        }
    };
    return Insulin;
}());
exports.Insulin = Insulin;
