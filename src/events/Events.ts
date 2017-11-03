import edbee from './edbee';
import Emitter from './Emitter';
const magik = magikcraft.io;
const log = magik.dixit;

const eventHandlers = {
	edbee,
}

const Events = {
	test: 'test',
	on: Emitter.on,

	registerAll: () => {
		for(let name in eventHandlers) {
			eventHandlers[name](magik.getPlugin());
		}
	},

	unregisterAll: (event) => {
		Emitter.removeAllListeners();
		// event.getHandlerList().unregisterAll(magik.getPlugin());
		const listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
		log('listeners: '+ JSON.stringify(listeners));
	},
};

log('Events.test: ' + Events.test);
export default Events;