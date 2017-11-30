"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var magik = magikcraft.io;
var log = magik.dixit;
var FoodList_1 = require("./FoodList");
var Food = {};
FoodList_1.default.forEach(function (item) { return Food[item.type] = item; });
var KEY = 'mct1-demo';
function _ensureCompleteState(state) {
    state.disabled = state.disabled || false; // disable by default.
    state.isUSA = state.isUSA || false;
    state.listening = state.listening !== undefined ? state.listening : false;
    state.digesting = state.digesting !== undefined ? state.digesting : false;
    state.dead = state.dead !== undefined ? state.dead : false;
    // state.lastDeathLocation = state.lastDeathLocation || null;
    state.bgl = state.bgl !== undefined ? state.bgl : 4.9;
    state.insulin = state.insulin !== undefined ? state.insulin : 0;
    state.digestionQueue = state.digestionQueue ? _sortDigestionQueue(state.digestionQueue) : [];
    state.bglBar = state.bglBar || null;
    state.insulinBar = state.insulinBar || null;
    state.digestionBar0 = state.digestionBar0 || null;
    state.digestionBar1 = state.digestionBar1 || null;
    state.inRegion = state.inRegion || null;
    return state;
}
function getState() {
    var state = magik.playerMap.get(KEY) || {};
    // Fix for weird behavior...
    if (JSON.stringify(state) === undefined) {
        state = {};
    }
    state = _ensureCompleteState(state);
    return state;
}
exports.getState = getState;
function setState(state) {
    state = _ensureCompleteState(state);
    magik.playerMap.put(KEY, state);
}
exports.setState = setState;
function _sortDigestionQueue(digestionQueue) {
    digestionQueue = digestionQueue.sort(function (a, b) { return a.timestamp - b.timestamp; });
    var highGIQueue = digestionQueue.filter(function (item) { return item.food.GI === 'high'; });
    var lowGIQueue = digestionQueue.filter(function (item) { return item.food.GI === 'low'; });
    digestionQueue = highGIQueue.concat(lowGIQueue);
    return digestionQueue;
}
