import EntityDamageByEntityEvent from './EntityDamageByEntityEvent';
import Emitter from './Emitter';
const magik = magikcraft.io;
const log = magik.dixit;

const HandlerList = Java.type("org.bukkit.event.HandlerList");

const eventHandlers = {
	EntityDamageByEntityEvent,
}

const Events = {
	test: 'test',
	on: (eventName, callback) => Emitter.on(eventName, callback),

	registerAll: () => {
		for(let name in eventHandlers) {
			eventHandlers[name]();
		}
		// HandlerList.bakeAll();
	},

	unregisterAll: () => {
		HandlerList.unregisterAll(magik.getPlugin());
		log('unregisterAll listeners...');
		// const listeners = HandlerList.getRegisteredListeners(magik.getPlugin());

		// log('listeners: ' + JSON.stringify(listeners));
		
		// Emitter.removeAllListeners();
		// // event.getHandlerList().unregisterAll(magik.getPlugin());
		// const listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
		// log('listeners: '+ JSON.stringify(listeners));
	},
};

export default Events;