const magik = magikcraft.io;
const log = magik.dixit;
const KEY = 'mct1-demo';

export function getState() {
	const state = magik.playerMap.get(KEY) || {};
	log('state 1: ' + JSON.stringify(state));
	state.listening = state.listening !== undefined ? true : false;
	state.bgl = state.bgl !== undefined ? state.bgl : 5;
	state.insulin = state.insulin !== undefined ? state.insulin : 0;
	state.digestionQueue = state.digestionQueue ? state.digestionQueue.sort((a,b) => a.timestamp - b.timestamp) : [];
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

export function setState(state) {
	state.listening = state.listening !== undefined ? true : false;
	state.bgl = state.bgl !== undefined ? state.bgl : 5;
	state.insulin = state.insulin !== undefined ? state.insulin : 0;
	state.digestionQueue = state.digestionQueue ? state.digestionQueue.sort((a,b) => a.timestamp - b.timestamp) : [];
	state.bglBar = state.bglBar || null;
	state.insulinBar = state.insulinBar || null;
	state.digestionBar0 = state.digestionBar0 || null;
	state.digestionBar1 = state.digestionBar1 || null;
	state.confusionEffect = state.confusionEffect ? true : false
	state.blindnessEffect = state.blindnessEffect ? true : false;
	state.poisonEffect = state.poisonEffect ? true : false;
	magik.playerMap.put(KEY, state);
}