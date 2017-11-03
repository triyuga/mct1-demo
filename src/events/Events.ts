import EntityDamageByEntityEvent from './EntityDamageByEntityEvent';
import Emitter from './Emitter';
const magik = magikcraft.io;
const log = magik.dixit;

const eventHandlers = {
	EntityDamageByEntityEvent,
}

const Events = {
	test: 'test',
	on: (eventName, callback) => Emitter.on(eventName, callback),

	registerAll: () => {
		for(let name in eventHandlers) {
			eventHandlers[name](magik.getPlugin());
		}

		Emitter.on('EntityDamageByEntityEvent', (event) => log('here 2'))
		
	},

	unregisterAll: (event) => {
		Emitter.removeAllListeners();
		// event.getHandlerList().unregisterAll(magik.getPlugin());
		const listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
		log('listeners: '+ JSON.stringify(listeners));
	},
};

export default Events;