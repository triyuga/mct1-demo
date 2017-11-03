import edbee from './edbee';
import emitter from './emitter';
const magik = magikcraft.io;
const log = magik.dixit;

const eventHandlers = {
	edbee,
}

const Events = {
	test: 'test',
	on: emitter.on,

	registerAll: () => {
		for(let name in eventHandlers) {
			eventHandlers[name](magik.getPlugin());
		}
	},

	unregisterAll: (event) => {
		emitter.removeAllListeners();
		// event.getHandlerList().unregisterAll(magik.getPlugin());
		const listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
		log('listeners: '+ JSON.stringify(listeners));
	},
};

log('Events.test: ' + Events.test);
export default Events;