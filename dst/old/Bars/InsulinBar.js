"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../util/log");
var Bar = require("magikcraft-lore-ui-bar");
var MCT1State = require("../State");
var magik = magikcraft.io;
log.info('Loading Insulin Bar...');
var INSULIN_BAR_KEY = 'mct.bar.insulin';
var initialState = MCT1State.getState();
var basal = initialState.basalInsulinOnBoard || 0;
var textComponent = getBasalMessage(basal);
var amount = initialState.rapidInsulinOnBoard || 0;
function init() {
    if (magik.playerMap.containsKey(INSULIN_BAR_KEY)) {
        var _bar = magik.playerMap.get(INSULIN_BAR_KEY);
        _bar.destroy();
    }
    exports.bar = Bar.bar()
        .textComponent(textComponent)
        .color(Bar.color.BLUE)
        .style(Bar.style.NOTCHED_10)
        .progress(amount)
        .show();
    magik.playerMap.put(INSULIN_BAR_KEY, exports.bar);
    var previousState = initialState;
    if (!exports.subscription) {
        exports.subscription = MCT1State.fusionStore.subscribe(this, function (state) {
            log.debug(state);
            if (previousState.basalInsulinOnBoard !== state.basalInsulinOnBoard) {
                var text = getBasalMessage(state.basalInsulinOnBoard);
                exports.bar.textComponent(text);
            }
            if (previousState.rapidInsulinOnBoard !== state.rapidInsulinOnBoard) {
                log.debug("Insulin onboard: " + state.rapidInsulinOnBoard);
                var amount_1 = Math.min(state.rapidInsulinOnBoard, 20);
                exports.bar.progress(Math.min(amount_1, 100));
            }
            previousState = state;
        });
    }
}
exports.init = init;
function getBasalMessage(basalInsulinOnBoard) {
    if (basalInsulinOnBoard > 0) {
        return Bar.ComponentBuilder("Insulin | ").append("Basal: Active").color(Bar.ChatColor.GREEN).create();
    }
    else {
        return Bar.ComponentBuilder("Insulin | ").append("Basal: Empty").color(Bar.ChatColor.RED).create();
    }
}
