// https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/event/player/PlayerInteractEntityEvent.html


const magik = magikcraft.io;
declare const Java: any;

const CommandCallback = Java.type("io.magikcraft.CommandCallback"),
    EventPriority = Java.type("org.bukkit.event.EventPriority"),
    EventCallback = Java.type("io.magikcraft.EventCallback");

function EntityDamageByEntityEvent() {
    magik.getPlugin().registerEvent(
            Java.type("org.bukkit.event.entity.EntityDamageByEntityEvent")
.class,
        EventPriority.MONITOR,
        true,
        new EventCallback({
            callback: function (event: any) {
                // var player = magik.getSender();
                // const playerName = event.getPlayer().getName();
                // const playerName = player.getName();
                // magik.dixit("entityDamageEvent!: " + playerName)
                // .getEntity().getType();
                
                const entityType = event.getEntityType(); // EntityType
                // magik.dixit('entityType: '+ entityType);

                // const damageeType = entityType;

                const cause = event.getCause(); // LIGHTNING STARVATION FIRE FALL ENTITY_ATTACK
                // magik.dixit('cause: '+ cause);

                const damagerType = event.getDamager().getType();
                // magik.dixit('damagerType: '+ damagerType);

                if (damagerType == 'PLAYER') {
                    // magik.dixit('is Player !!!');
                    if (cause == 'ENTITY_ATTACK') {
                        magik.dixit('set fire to '+ entityType + '!!!');
                        event.getEntity().setFireTicks(200);
                        const loc = event.getEntity().getLocation();
                        const location = `${loc.getX()} ${loc.getY()} ${loc.getZ()}`;
                        const server = magik.getPlugin().getServer();
                        const cmd = `execute ${event.getDamager().getName()} ~ ~ ~ summon lightning_bolt ${location}`;
                        server.dispatchCommand(server.getConsoleSender(), cmd);
                    }
                }
                // else if (entityType == 'PLAYER') {
                //     if (cause == 'ENTITY_ATTACK') {
                        
                //     }
                //     if (cause == 'LIGHTNING') {
                //         magik.dixit('set LIGHTNING damage to 0 for ' + event.getEntity().getName());
                //         event.setDamage(0);
                //     }
                // } else {
                //     if (cause == 'ENTITY_ATTACK') {
                        
                //     }
                // }

                // getDamage
                // getDamage
                // getFinalDamage
                // getHandlerList
                // getHandlers
                // getOriginalDamage
                // isApplicable
                // isCancelled
                // setCancelled
                // setDamage
  
            }
        }));	
}
