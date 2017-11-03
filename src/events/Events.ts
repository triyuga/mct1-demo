import EntityDamageByEntityEvent from './EntityDamageByEntityEvent';
import EventEmitter from './EventEmitter';
const magik = magikcraft.io;
const log = magik.dixit;

const eventHandlers = {
	EntityDamageByEntityEvent,
}

const Eventer = {
	test: 'test',
	on: EventEmitter.on,

	registerAll: () => {
		for(let name in eventHandlers) {
			eventHandlers[name]();
		}
	},

	unregisterAll: (event) => {
		EventEmitter.removeAllListeners();
		// event.getHandlerList().unregisterAll(magik.getPlugin());
		const listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
		log('listeners: '+ JSON.stringify(listeners));
	},
};

log('Eventer.test: ' + Eventer.test);
export default Eventer;