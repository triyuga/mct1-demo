"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timer_1 = require("../util/timer");
var log_1 = require("../util/log");
var env_1 = require("../util/env");
var State = require("../State");
/**
* See: https://github.com/mc-t1/mct1/issues/35
*/
var milliseconds = 1000;
var sample_rate = 1; // seconds/sample
var Dose = (function () {
    function Dose(onsetDelay, duration, peak, bglDeltaPerUnit, onExhaustion) {
        if (onExhaustion === void 0) { onExhaustion = function () { }; }
        this.test_bgl = 0;
        this.test_insulinOnBoard = 0;
        this.onsetDelay = onsetDelay;
        this.duration = duration;
        this.peak = peak;
        this.bglDeltaPerUnit = bglDeltaPerUnit;
        this.onExhaustion = onExhaustion;
    }
    Dose.prototype.take = function (amount) {
        var _this = this;
        // This timeout is the onset Delay of taking the insulin
        timer_1.Interval.setTimeout(function () {
            log_1.debug('Starting absorption');
            _this.startInsulinAbsorption(amount);
        }, this.onsetDelay * milliseconds);
    };
    Dose.prototype.startInsulinAbsorption = function (amount) {
        var _this = this;
        var memoizedEffect = [];
        var dose = amount;
        log_1.debug('Absorption started');
        var elapsedTime = 0;
        var calculateInsulinEffectWithPeak = function (power, duration) { return function (elapsedTime) {
            if (elapsedTime > duration / 2) {
                return memoizedEffect.pop();
            }
            var effect = sample_rate * elapsedTime * Math.tan(Math.atan(4 * power / duration) / duration);
            memoizedEffect.push(effect);
            return effect;
        }; };
        var calculateInsulinEffectWithoutPeak = function (power, duration) { return function (elapsedTime) {
            return power / duration;
        }; };
        var activeEffectTime = this.duration - this.onsetDelay;
        var calculateInsulinEffect = (this.peak) ? calculateInsulinEffectWithPeak(this.bglDeltaPerUnit, activeEffectTime) : calculateInsulinEffectWithoutPeak(this.bglDeltaPerUnit, activeEffectTime);
        var _loop = timer_1.Interval.setInterval(function () {
            elapsedTime += sample_rate;
            log_1.debug("Elapsed time: " + elapsedTime);
            log_1.debug("Duration: " + activeEffectTime);
            if (elapsedTime >= activeEffectTime) {
                // insulin effect exhausted
                timer_1.Interval.clearInterval(_loop);
                log_1.debug('Insulin effect exhausted');
                _this.onExhaustion();
                return;
            }
            log_1.debug('Doing insulin effect');
            var bglDelta = (amount > 0) ? calculateInsulinEffect(elapsedTime) * dose : 0;
            var insulinAbsorbed = (amount > 0) ? Math.min(amount, (bglDelta / (_this.bglDeltaPerUnit * dose)) * dose) : 0;
            amount -= insulinAbsorbed;
            _this.doSideEffects(bglDelta, insulinAbsorbed);
        }, sample_rate * milliseconds);
    };
    Dose.prototype.doSideEffects = function (bglDelta, insulinDelta) {
        if (env_1.isNode) {
            this.test_bgl -= bglDelta;
            this.test_insulinOnBoard -= insulinDelta;
        }
        else {
            State.changeBGL(0 - bglDelta);
            State.changeRapidInsulin(0 - insulinDelta);
        }
    };
    return Dose;
}());
exports.Dose = Dose;
