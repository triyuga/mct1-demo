import { EventEmitter } from 'events';
const Emitter = new EventEmitter();

const magik = magikcraft.io;
const log = magik.dixit;

declare const Java: any;
// const Listener = Java.type("org.bukkit.event");
// const HandlerList = Java.type("org.bukkit.event.HandlerList");
const EventPriority = Java.type("org.bukkit.event.EventPriority");
const EventCallback = Java.type("io.magikcraft.EventCallback");

const eventTypes = {
	PlayerDeathEvent: 'org.bukkit.event.entity.PlayerDeathEvent',
	PlayerRespawnEvent: 'org.bukkit.event.player.PlayerRespawnEvent',
	EntityDamageByEntityEvent: 'org.bukkit.event.entity.EntityDamageByEntityEvent',
	EntityDamageEvent: 'org.bukkit.event.entity.EntityDamageEvent',
	ProjectileHitEvent: 'org.bukkit.event.entity.ProjectileHitEvent',
	PlayerItemConsumeEvent: 'org.bukkit.event.player.PlayerItemConsumeEvent',
	PlayerQuitEvent: 'org.bukkit.event.player.PlayerQuitEvent',
	RegionEnterEvent: 'com.mewin.WGRegionEvents.events.RegionEnterEvent',
	RegionLeaveEvent: 'com.mewin.WGRegionEvents.events.RegionLeaveEvent',
	PlayerCommandPreprocessEvent: 'org.bukkit.event.player.PlayerCommandPreprocessEvent',
};

const Events = {

	on: (eventName, callback) => Emitter.on(eventName, callback),

	unregisterAll: () => {
		Emitter.removeAllListeners();
	},

	registerAll: () => {
		for (let type in eventTypes) {
			const javaType = eventTypes[type];
			Emitter.removeAllListeners();
			magik.getPlugin().registerEvent(
				Java.type(javaType).class,
				EventPriority.MONITOR,
				true,
				new EventCallback({
					callback: function (event: any) {						
						Emitter.emit(type, event);
					}
				})
			);
		}
	},
};

export default Events;