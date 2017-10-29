"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Insulin_1 = require("../Insulin/Insulin");
/**
* 5s onset delay
* 30s effect duration
* 30 power
* true = saw-tooth response profile
*/
var rapid = new Insulin_1.Insulin(5, 30, 30, true);
exports.rapid = rapid;
/**
 * 5s onset delay
 * 300s effect duration
 * 2 power
 * false = flat response profile
 */
var basal = new Insulin_1.Insulin(5, 300, 2, false);
exports.basal = basal;
