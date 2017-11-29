import Player from './Player';

export const spells = {
    
    _default: (isUSA = false) => Player.init(isUSA), // This is all that is required to run MCT1

    // Below: Utility functions only, not required for MCT1 operation.
    countdown: (secs, isUSA) => Player.doCountdown(secs, isUSA),
    disable: () => Player.disableT1(),
    enable: () => Player.enableT1(),
    // refreshInventory: () => Player.refreshInventory(),
    // setupInventory: () => Player.setupInventory(),
}
