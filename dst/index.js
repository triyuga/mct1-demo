"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BGL_1 = require("./BGL");
var Insulin_1 = require("./Insulin");
var log = require("./old/util/log");
var magik = magikcraft.io;
function init() {
    log.info("init()");
    BGL_1.default.set(4);
    Insulin_1.default.set(0);
}
exports.init = init;
function setBGL(num) {
    if (num === void 0) { num = 0; }
    log.info("setBGL(" + num + ")");
    BGL_1.default.set(num);
}
exports.setBGL = setBGL;
function setInsulin(num) {
    if (num === void 0) { num = 0; }
    log.info("setInsulin(" + num + ")");
    Insulin_1.default.set(num);
}
exports.setInsulin = setInsulin;
var _default = init;
exports.spells = {
    _default: _default,
    init: init,
    setBGL: setBGL,
    setInsulin: setInsulin,
};
