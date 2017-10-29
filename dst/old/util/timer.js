"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var env = require("./env");
exports.Interval = (env.isNode) ?
    {
        setInterval: setInterval,
        clearInterval: clearInterval,
        setTimeout: setTimeout
    } :
    {
        setInterval: magikcraft.io.setInterval,
        clearInterval: magikcraft.io.clearInterval,
        setTimeout: magikcraft.io.setTimeout
    };
