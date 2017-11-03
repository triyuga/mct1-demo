import entityDamageByEntityEvent from './entityDamageByEntityEvent';
import Emitter from './Emitter';
const magik = magikcraft.io;
const log = magik.dixit;

const eventHandlers = {
	entityDamageByEntityEvent,
}

const Eventer = {
	test: 'test',
	on: Emitter.on,

	registerAll: () => {
		for(let name in eventHandlers) {
			eventHandlers[name]();
		}
	},

	unregisterAll: (event) => {
		Emitter.removeAllListeners();
		// event.getHandlerList().unregisterAll(magik.getPlugin());
		const listeners = event.getHandlerList().getRegisteredListeners(magik.getPlugin());
		log('listeners: '+ JSON.stringify(listeners));
	},
};

log('Eventer.test: ' + Eventer.test);
export default Eventer;