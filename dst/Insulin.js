"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { IBar } from 'magikcraft-lore-ui-bar/dst';
var log = require("./old/util/log");
var Bar = require("./Bar");
var magik = magikcraft.io;
var INSULIN_BAR_KEY = 'mct1.bar.insulin';
var InsulinProvider = (function () {
    function InsulinProvider() {
        this.set(0);
    }
    InsulinProvider.prototype.set = function (percent) {
        log.info("Inlsulin.set(" + percent + ")");
        if (magik.playerMap.containsKey(INSULIN_BAR_KEY)) {
            var _bar = magik.playerMap.get(INSULIN_BAR_KEY);
            _bar.destroy();
        }
        var bar = Bar.bar()
            .text("Inlsulin: " + percent)
            .color(Bar.color.BLUE)
            .style(Bar.style.NOTCHED_20)
            .progress(percent)
            .show();
        magik.playerMap.put(INSULIN_BAR_KEY, bar);
    };
    return InsulinProvider;
}());
var Inlsulin = new InsulinProvider();
exports.default = Inlsulin;
