const magik = magikcraft.io;
const log = magik.dixit;
const KEY = 'mct1-demo';

export function getState() {
	const state = magik.playerMap.get(KEY) ? JSON.parse(magik.playerMap.get(KEY)) : {};
	state.listening = state.listening !== undefined ? state.listening : false;
	state.digesting = state.digesting !== undefined ? state.digesting : false;
	state.dead = state.dead !== undefined ? state.dead : false;
	state.inHeathyRange = state.inHeathyRange !== undefined ? state.inHeathyRange : true;
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
	log('state 2: ' + JSON.stringify(state));
	return state;
}

export function setState(state) {
	state.listening = state.listening !== undefined ? state.listening : false;
	state.digesting = state.digesting !== undefined ? state.digesting : false;
	state.dead = state.dead !== undefined ? state.dead : false;
	state.inHeathyRange = state.inHeathyRange !== undefined ? state.inHeathyRange : true;
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
	magik.playerMap.put(KEY, JSON.stringify(state));
	return state;
}