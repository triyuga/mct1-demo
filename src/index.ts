import Player from './Player';


export const spells = {
    _default: Player.init,   
    setBGL: Player.setBGL,
    setInsulin: Player.setInsulin,
    setHeatlh: Player.setHealth,
    setFood: Player.setFood,
    getInventory: Player.getInventory,
}
