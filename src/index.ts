import Player from './Player';

export const spells = {
    _default: () => Player.init(), // This is all that is required to run MCT1

    // Below: Utility functions only, not required for MCT1 operation.
    setBGL: () => Player.setBGL(),
    setInsulin: (num) => Player.setInsulin(num),
    setHeatlh: (num) => Player.setHealth(num),
    setFood: (num) => Player.setFood(num),
    getInventory: () => Player.getInventory(),
    refreshInventory: () => Player.refreshInventory(),
    setupInventory: () => Player.setupInventory(),
}
