"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player_1 = require("./Player");
exports.spells = {
    _default: function () { return Player_1.default.init(); },
    // Below: Utility functions only, not required for MCT1 operation.
    countdown: function () { return Player_1.default.doCountdown(); },
};
