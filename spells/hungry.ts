var magik = magikcraft.io;

function hungry(playerName = null) {
    const plugin = magik.getPlugin();
    const sender = magik.getSender();
    const player = playerName ? plugin.getPlayer(playerName) : sender; 
    player.setHealth(10); 
    player.setFoodLevel(10); 
}