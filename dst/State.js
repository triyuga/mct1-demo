"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var magik = magikcraft.io;
var log = magik.dixit;
var KEY = 'mct1-demo';
function getState() {
    var state = magik.playerMap.get(KEY) || {};
    log('state 1: ' + JSON.stringify(state));
    state.listening = state.listening !== undefined ? state.listening : false;
    state.digesting = state.digesting !== undefined ? state.digesting : false;
    state.dead = state.dead !== undefined ? state.dead : false;
    state.inHeathyRange = state.inHeathyRange !== undefined ? state.inHeathyRange : true;
    state.bgl = state.bgl !== undefined ? state.bgl : 5;
    state.insulin = state.insulin !== undefined ? state.insulin : 0;
    state.digestionQueue = state.digestionQueue ? state.digestionQueue.sort(function (a, b) { return a.timestamp - b.timestamp; }) : [];
    state.bglBar = state.bglBar || null;
    state.insulinBar = state.insulinBar || null;
    state.digestionBar0 = state.digestionBar0 || null;
    state.digestionBar1 = state.digestionBar1 || null;
    state.confusionEffect = state.confusionEffect ? true : false;
    state.blindnessEffect = state.blindnessEffect ? true : false;
    state.poisonEffect = state.poisonEffect ? true : false;
    log('state: 2' + JSON.stringify(state));
    return state;
}
exports.getState = getState;
function setState(state) {
    state.listening = state.listening !== undefined ? state.listening : false;
    state.digesting = state.digesting !== undefined ? state.digesting : false;
    state.dead = state.dead !== undefined ? state.dead : false;
    state.inHeathyRange = state.inHeathyRange !== undefined ? state.inHeathyRange : true;
    state.bgl = state.bgl !== undefined ? state.bgl : 5;
    state.insulin = state.insulin !== undefined ? state.insulin : 0;
    state.digestionQueue = state.digestionQueue ? state.digestionQueue.sort(function (a, b) { return a.timestamp - b.timestamp; }) : [];
    state.bglBar = state.bglBar || null;
    state.insulinBar = state.insulinBar || null;
    state.digestionBar0 = state.digestionBar0 || null;
    state.digestionBar1 = state.digestionBar1 || null;
    state.confusionEffect = state.confusionEffect ? true : false;
    state.blindnessEffect = state.blindnessEffect ? true : false;
    state.poisonEffect = state.poisonEffect ? true : false;
    magik.playerMap.put(KEY, state);
}
exports.setState = setState;
function resetState(state) {
    state.listening = state.listening !== undefined ? state.listening : false;
    state.digesting = state.digesting !== undefined ? state.digesting : false;
    state.dead = state.dead !== undefined ? state.dead : false;
    state.inHeathyRange = true;
    state.bgl = 5;
    state.insulin = 0;
    state.digestionQueue = [];
    if (state.bglBar)
        state.bglBar.destroy();
    state.bglBar = null;
    if (state.insulinBar)
        state.insulinBar.destroy();
    state.insulinBar = null;
    if (state.digestionBar0)
        state.digestionBar0.destroy();
    state.digestionBar0 = null;
    if (state.digestionBar1)
        state.digestionBar1.destroy();
    state.digestionBar1 = null;
    state.confusionEffect = false;
    state.blindnessEffect = false;
    state.poisonEffect = false;
    magik.playerMap.put(KEY, state);
}
exports.resetState = resetState;
