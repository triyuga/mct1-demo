import Player from './Player';

export const spells = {
    _default: () => Player.init(), // This is all that is required to run MCT1

    // Below: Utility functions only, not required for MCT1 operation.
    countdown: () => Player.doCountdown(),
    // refreshInventory: () => Player.refreshInventory(),
    // setupInventory: () => Player.setupInventory(),
}
