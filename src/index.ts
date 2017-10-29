import Player from './Player';

const _default = Player.init;

export const spells = {
    _default,   
    setBGL: Player.setBGL,
    setInsulin: Player.setInsulin,
    setHeatlh: Player.setHealth,
    setFood: Player.setFood,
    getInventory: Player.getInventory,
}
