import * as State from '../State';
import * as env from '../util/env';
import * as Bukkit from '../lib/bukkit';
const magik = magikcraft.io;

export function applyEffect(effect: string, opts: any = {}) {
    if (env.isNode) {
        return effect;
    }

    const Color = magik.type("Color");
    if (State.hasEffect(effect)) {
        return;
    }

    const duration = opts.duration || 500;
    const amplifier = opts.amplifier || 1;
    const color = opts.color || "GREEN";
    const c = Color[color];
    const l = Bukkit.PotionEffectType[effect];
    const potionEffect = new Bukkit.PotionEffect(l, duration, amplifier, true, true, c);
    magik.getSender().addPotionEffect(potionEffect);
    State.addEffectMutex(effect);
    magik.setTimeout(() => {
        State.removeEffectMutex(effect);
    }, duration);
}