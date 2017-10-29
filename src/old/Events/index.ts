import { takeInsulin } from '../';
import * as log from '../util/log';
import * as Bukkit from '../lib/bukkit';
import { Food } from '../Carbs';

const magik = magikcraft.io;

function handleConsumeEvent(event) {
    if (event.getItem().getType() == Bukkit.Material.APPLE) {
        Food.apple.eat();
        return;
    }
    if (event.getItem().getItemMeta() instanceof Bukkit.PotionMeta) {
        takeInsulin();
        return;
    }
    log.info(event.getItem().toString());
}

export function registerEventHandlers() {
    magik.Events.on('PlayerItemConsumeEvent', handleConsumeEvent);
}