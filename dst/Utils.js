"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inArray = require("in-array");
var UtilsHelper = (function () {
    function UtilsHelper() {
    }
    UtilsHelper.prototype.ucfirst = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    UtilsHelper.prototype.inArray = function (needle, haystack) {
        return inArray(haystack, needle);
    };
    UtilsHelper.prototype.makeTimestamp = function () {
        return Math.floor(Date.now() / 1000);
    };
    UtilsHelper.prototype.cloneObject = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
    return UtilsHelper;
}());
var Utils = new UtilsHelper;
exports.default = Utils;
