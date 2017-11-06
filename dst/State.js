"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var magik = magikcraft.io;
var log = magik.dixit;
var KEY = 'mct1-demo';
function _ensureCompleteState(state) {
    state.listening = state.listening !== undefined ? state.listening : false;
    state.digesting = state.digesting !== undefined ? state.digesting : false;
    state.dead = state.dead !== undefined ? state.dead : false;
    state.bgl = state.bgl !== undefined ? state.bgl : 5;
    state.insulin = state.insulin !== undefined ? state.insulin : 0;
    state.digestionQueue = state.digestionQueue ? state.digestionQueue.sort(function (a, b) { return a.timestamp - b.timestamp; }) : [];
    state.bglBar = state.bglBar || null;
    state.insulinBar = state.insulinBar || null;
    state.digestionBar0 = state.digestionBar0 || null;
    state.digestionBar1 = state.digestionBar1 || null;
    return state;
}
function getState() {
    var state = magik.playerMap.get(KEY) || {};
    log('state 1: ' + JSON.stringify(state));
    if (typeof state !== 'object') {
        log('not obj!');
        state = {};
    }
    log('typeof state: ' + typeof state);
    state = _ensureCompleteState(state);
    return state;
}
exports.getState = getState;
function setState(state) {
    state = _ensureCompleteState(state);
    magik.playerMap.put(KEY, state);
}
exports.setState = setState;
