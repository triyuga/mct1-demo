"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var env = require("./env");
var _verbose = false;
exports.info = (env.isNode) ? console.log
    : magikcraft.io.dixit;
exports.debug = function (msg) { return ((_verbose) ? exports.info(msg) : undefined); };
exports.verbose = function (trueOrFalse) { return _verbose = trueOrFalse; };
