import EntityDamageByEntityEvent from './EntityDamageByEntityEvent';
import EventEmitter from './EventEmitter';
const magik = magikcraft.io;
const log = magik.dixit;

const eventHandlers = {
	EntityDamageByEntityEvent,
}

const Events = {
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

export default Events;