import Player from './Player';

export const spells = {
    _default: () => Player.init(), 
    setBGL: () => Player.setBGL(),
    setInsulin: (num) => Player.setInsulin(num),
    setHeatlh: (num) => Player.setHealth(num),
    setFood: (num) => Player.setFood(num),
    getInventory: () => Player.getInventory(),
}
