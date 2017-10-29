"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BGL_1 = require("./BGL");
var log = require("./old/util/log");
var magik = magikcraft.io;
log.info('MCT1 loading...');
function init() {
    BGL_1.default.init();
}
exports.init = init;
function setBGL(num) {
    BGL_1.default.set(num);
}
exports.setBGL = setBGL;
var _default = init;
exports.spells = {
    _default: _default,
    init: init,
    setBGL: setBGL,
};
