"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var State = require("../State");
var env = require("../util/env");
var Bukkit = require("../lib/bukkit");
var magik = magikcraft.io;
function applyEffect(effect, opts) {
    if (opts === void 0) { opts = {}; }
    if (env.isNode) {
        return effect;
    }
    var Color = magik.type("Color");
    if (State.hasEffect(effect)) {
        return;
    }
    var duration = opts.duration || 500;
    var amplifier = opts.amplifier || 1;
    var color = opts.color || "GREEN";
    var c = Color[color];
    var l = Bukkit.PotionEffectType[effect];
    var potionEffect = new Bukkit.PotionEffect(l, duration, amplifier, true, true, c);
    magik.getSender().addPotionEffect(potionEffect);
    State.addEffectMutex(effect);
    magik.setTimeout(function () {
        State.removeEffectMutex(effect);
    }, duration);
}
exports.applyEffect = applyEffect;
