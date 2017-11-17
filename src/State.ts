const magik = magikcraft.io;
const log = magik.dixit;

import FoodList from './FoodList';
const Food:any = {};
FoodList.forEach(item => Food[item.type] = item);

const KEY = 'mct1-demo';

function _ensureCompleteState(state) {
	state.listening = state.listening !== undefined ? state.listening : false;
	state.digesting = state.digesting !== undefined ? state.digesting : false;
	state.dead = state.dead !== undefined ? state.dead : false;
	// state.lastDeathLocation = state.lastDeathLocation || null;
	state.bgl = state.bgl !== undefined ? state.bgl : 5;
	state.insulin = state.insulin !== undefined ? state.insulin : 0;
	state.digestionQueue = state.digestionQueue ? _sortDigestionQueue(state.digestionQueue) : [];
	state.bglBar = state.bglBar || null;
	state.insulinBar = state.insulinBar || null;
	state.digestionBar0 = state.digestionBar0 || null;
	state.digestionBar1 = state.digestionBar1 || null;
	
	state.inRegion = state.inRegion || null;


	return state;
}

export function getState() {
	let state = magik.playerMap.get(KEY) || {};
	
	// Fix for weird behavior...
	if (JSON.stringify(state) === undefined) {
		state = {};
	}

	state = _ensureCompleteState(state);
	return state;
}

export function setState(state) {
	state = _ensureCompleteState(state);
	magik.playerMap.put(KEY, state);
}

function _sortDigestionQueue(digestionQueue) {
	digestionQueue = digestionQueue.sort((a,b) => a.timestamp - b.timestamp);
	const highGIQueue = digestionQueue.filter((item) => item.food.GI === 'high');
	const lowGIQueue = digestionQueue.filter((item) => item.food.GI === 'low');
	digestionQueue = highGIQueue.concat(lowGIQueue);
	log('digestionQueue: ' + JSON.stringify(digestionQueue));
	return digestionQueue
}