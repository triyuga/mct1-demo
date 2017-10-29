"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bar = require("./Bar");
var magik = magikcraft.io;
var BGL_BAR_KEY = 'mct1.bar.bgl';
var BGLProvider = (function () {
    function BGLProvider() {
        this.state = {
            BGL: 4,
        };
    }
    BGLProvider.prototype.init = function () {
        // log.info('BGL Bar loading...');
        if (magik.playerMap.containsKey(BGL_BAR_KEY)) {
            var _bar = magik.playerMap.get(BGL_BAR_KEY);
            _bar.destroy();
        }
        var bar = Bar.bar()
            .text("BGL: " + this.state.BGL)
            .color(Bar.color.GREEN)
            .style(Bar.style.NOTCHED_20)
            .progress(this.state.BGL)
            .show();
        magik.playerMap.put(BGL_BAR_KEY, bar);
    };
    BGLProvider.prototype.set = function (bgl) {
        var bar = magik.playerMap.get(BGL_BAR_KEY);
        bar.progress(bgl);
        magik.playerMap.put(BGL_BAR_KEY, bar);
    };
    return BGLProvider;
}());
var BGL = new BGLProvider();
exports.default = BGL;
