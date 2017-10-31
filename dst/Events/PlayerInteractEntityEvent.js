"use strict";
// https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/event/player/PlayerInteractEntityEvent.html
var magik = magikcraft.io;
var CommandCallback = Java.type("io.magikcraft.CommandCallback"), EventPriority = Java.type("org.bukkit.event.EventPriority"), EventCallback = Java.type("io.magikcraft.EventCallback");
function EntityDamageByEntityEvent() {
    magik.getPlugin().registerEvent(Java.type("org.bukkit.event.entity.EntityDamageByEntityEvent")
        .class, EventPriority.MONITOR, true, new EventCallback({
        callback: function (event) {
            // var player = magik.getSender();
            // const playerName = event.getPlayer().getName();
            // const playerName = player.getName();
            // magik.dixit("entityDamageEvent!: " + playerName)
            // .getEntity().getType();
            var entityType = event.getEntityType(); // EntityType
            // magik.dixit('entityType: '+ entityType);
            // const damageeType = entityType;
            var cause = event.getCause(); // LIGHTNING STARVATION FIRE FALL ENTITY_ATTACK
            // magik.dixit('cause: '+ cause);
            var damagerType = event.getDamager().getType();
            // magik.dixit('damagerType: '+ damagerType);
            if (damagerType == 'PLAYER') {
                // magik.dixit('is Player !!!');
                if (cause == 'ENTITY_ATTACK') {
                    magik.dixit('set fire to ' + entityType + '!!!');
                    event.getEntity().setFireTicks(200);
                    var loc = event.getEntity().getLocation();
                    var location = loc.getX() + " " + loc.getY() + " " + loc.getZ();
                    var server = magik.getPlugin().getServer();
                    var cmd = "execute " + event.getDamager().getName() + " ~ ~ ~ summon lightning_bolt " + location;
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
