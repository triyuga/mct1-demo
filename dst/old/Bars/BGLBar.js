"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../util/log");
var Bar = require("magikcraft-lore-ui-bar");
var State = require("../State");
var magik = magikcraft.io;
var BGL_BAR_KEY = 'mct1.bar.bgl';
log.info('BGL Bar loading...');
var initialState = State.getState();
function init() {
    if (magik.playerMap.containsKey(BGL_BAR_KEY)) {
        var _bar = magik.playerMap.get(BGL_BAR_KEY);
        _bar.destroy();
    }
    var bgl = initialState.BGL || 4;
    exports.bar = Bar.bar()
        .text("BGL: " + initialState.BGL)
        .color(Bar.color.GREEN)
        .style(Bar.style.NOTCHED_20)
        .progress(bgl)
        .show();
    magik.playerMap.put(BGL_BAR_KEY, exports.bar);
    if (!exports.subscription) {
        var previousState_1 = initialState;
        exports.subscription = State.subscribe(function (state) {
            if (previousState_1.BGL !== state.BGL) {
                var bgl_1 = state.BGL || 0;
                var bglNum = Math.min(20, bgl_1);
                var bglString = bglNum.toFixed(1);
                previousState_1 = state;
                exports.bar.progress(bglNum * 5);
                exports.bar.text("BGL: " + bglString);
                exports.bar.color(getBGLColor(bgl_1));
            }
        });
    }
}
exports.init = init;
function getBGLColor(bgl) {
    if (bgl < 4 || bgl > 8) {
        return Bar.color.RED;
    }
    return Bar.color.GREEN;
}
