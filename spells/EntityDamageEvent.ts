const magik = magikcraft.io;
declare const Java: any;

const CommandCallback = Java.type("io.magikcraft.CommandCallback"),
    EventPriority = Java.type("org.bukkit.event.EventPriority"),
    EventCallback = Java.type("io.magikcraft.EventCallback");

function EntityDamageEvent() {
    magik.getPlugin().registerEvent(
            Java.type("org.bukkit.event.entity.EntityDamageEvent")
.class,
        EventPriority.MONITOR,
        true,
        new EventCallback({
            callback: function (event: any) {
                const entityType = event.getEntityType(); // EntityType
                magik.dixit('entityType: '+ entityType);

                // const damageeType = entityType;

                const cause = event.getCause(); // LIGHTNING STARVATION FIRE FALL ENTITY_ATTACK
                magik.dixit('cause: '+ cause);

                if (entityType == 'PLAYER') {
                    if (cause == 'LIGHTNING' || cause == 'FIRE' || cause == 'FIRE_TICK') {
                        magik.dixit('set LIGHTNING damage to 0 for ' + event.getEntity().getName());
                        event.setDamage(0);
                        event.setCancelled(true);
                    }
                }
            }
        }));	
}