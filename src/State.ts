const magik = magikcraft.io;
const log = magik.dixit;
const KEY = 'mct1-demo';

function _ensureCompleteState(state) {
	state.listening = state.listening !== undefined ? state.listening : false;
	state.digesting = state.digesting !== undefined ? state.digesting : false;
	state.dead = state.dead !== undefined ? state.dead : false;
	state.bgl = state.bgl !== undefined ? state.bgl : 5;
	state.insulin = state.insulin !== undefined ? state.insulin : 0;
	state.digestionQueue = state.digestionQueue ? state.digestionQueue.sort((a,b) => a.timestamp - b.timestamp) : [];
	state.bglBar = state.bglBar || null;
	state.insulinBar = state.insulinBar || null;
	state.digestionBar0 = state.digestionBar0 || null;
	state.digestionBar1 = state.digestionBar1 || null;
	return state;
}

export function getState() {
	let state = magik.playerMap.get(KEY) || {};
	state = _ensureCompleteState(state);
	// log('state: ' + JSON.stringify(state));
	return state;
}

export function setState(state) {
	state = _ensureCompleteState(state);
	magik.playerMap.put(KEY, state);
}